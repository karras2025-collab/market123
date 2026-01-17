// Supabase Edge Function: send-telegram-code
// Deploy this to Supabase Dashboard -> Edge Functions
//
// Add these secrets in Supabase Dashboard:
// - TELEGRAM_BOT_TOKEN = your bot token
// - TELEGRAM_CHAT_ID = your chat ID

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')!
const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID')!

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { code, type } = await req.json()

        if (!code || typeof code !== 'string') {
            return new Response(JSON.stringify({ error: 'Invalid code' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        // Build message based on type
        let message: string
        if (type === '2fa') {
            message = `🔐 Код для входа в админ-панель: ${code}\n\n⏱️ Действителен 5 минут.`
        } else if (type === 'order') {
            message = `📦 Новый заказ!\n\n${code}`
        } else {
            message = code
        }

        // Send to Telegram
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        })

        const result = await response.json()

        return new Response(JSON.stringify({ ok: result.ok }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    } catch (error) {
        console.error('Error:', error)
        return new Response(JSON.stringify({ error: 'Failed to send message' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
})
