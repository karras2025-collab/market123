// Capitalist Payment Webhook Handler
// This function receives payment notifications from Capitalist and updates order status

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// HMAC-MD5 implementation for signature verification
async function hmacMd5(message: string, key: string): Promise<string> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);
    const messageData = encoder.encode(message);

    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'MD5' },
        false,
        ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    return Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

function verifySignature(params: Record<string, string>, secretKey: string, receivedSign: string): Promise<boolean> {
    // Sort required params alphabetically and concatenate values
    const signParams = {
        c: params.c || '',      // currency
        o: params.o || '',      // operation ID
        oa: params.oa || '',    // merchant address
        s: params.s || '',      // sum
        st: params.st || '',    // status
    };

    const sortedKeys = Object.keys(signParams).sort();
    const dataString = sortedKeys.map(key => signParams[key as keyof typeof signParams]).join('');

    return hmacMd5(dataString, secretKey).then(calc => calc === receivedSign);
}

Deno.serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        // Get secrets from environment
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const capitalistSecretKey = Deno.env.get('CAPITALIST_SECRET_KEY')!;

        // Parse request body (form data or JSON)
        let params: Record<string, string> = {};

        const contentType = req.headers.get('content-type') || '';
        if (contentType.includes('application/x-www-form-urlencoded')) {
            const formData = await req.formData();
            formData.forEach((value, key) => {
                params[key] = value.toString();
            });
        } else if (contentType.includes('application/json')) {
            params = await req.json();
        } else {
            // Try URL params
            const url = new URL(req.url);
            url.searchParams.forEach((value, key) => {
                params[key] = value;
            });
        }

        console.log('Received webhook params:', params);

        // Verify signature
        const receivedSign = params.sign || '';
        const isValid = await verifySignature(params, capitalistSecretKey, receivedSign);

        if (!isValid) {
            console.error('Invalid signature');
            return new Response(JSON.stringify({ error: 'Invalid signature' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        // Extract payment data
        const orderId = params.o;           // Operation ID (our order ID)
        const paymentId = params.pid || ''; // Capitalist payment ID
        const status = params.st;           // Payment status
        const amount = params.s;            // Amount
        const currency = params.c;          // Currency

        // Map Capitalist status to our status
        // Capitalist statuses: 1 = success, 0 = fail, 2 = pending
        let paymentStatus: string;
        let orderStatus: string;

        switch (status) {
            case '1':
                paymentStatus = 'paid';
                orderStatus = 'processing';
                break;
            case '0':
                paymentStatus = 'failed';
                orderStatus = 'cancelled';
                break;
            case '2':
            default:
                paymentStatus = 'pending';
                orderStatus = 'pending';
                break;
        }

        // Create Supabase client with service role key
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Update order in database
        const { error } = await supabase
            .from('orders')
            .update({
                payment_status: paymentStatus,
                payment_id: paymentId,
                status: orderStatus,
            })
            .eq('id', orderId);

        if (error) {
            console.error('Database update error:', error);
            return new Response(JSON.stringify({ error: 'Database error' }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        console.log(`Order ${orderId} updated: payment_status=${paymentStatus}, status=${orderStatus}`);

        // Return success response (Capitalist expects 'YES' or similar)
        return new Response('YES', {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
        });

    } catch (error) {
        console.error('Webhook error:', error);
        return new Response(JSON.stringify({ error: 'Internal error' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
