import CryptoJS from 'crypto-js';

// Capitalist Merchant API Configuration
const CAPITALIST_MERCHANT_ADDRESS = import.meta.env.VITE_CAPITALIST_MERCHANT_ADDRESS || '';
const CAPITALIST_SECRET_KEY = import.meta.env.VITE_CAPITALIST_SECRET_KEY || '';
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://digideal.netlify.app';

// Capitalist payment gateway URL
const CAPITALIST_PAY_URL = 'https://capitalist.net/merchant/payGate/createorder';

export interface PaymentFormData {
    operationId: string;
    amount: number;
    currency: string;
    description: string;
    email?: string;
    lang?: 'ru' | 'en';
}

export interface PaymentParams {
    merchantAddress: string;
    operationId: string;
    currency: string;
    sum: string;
    description: string;
    email?: string;
    successURL: string;
    failURL: string;
    statusURL: string;
    interactionURL: string;
    lang: string;
    sign: string;
}

/**
 * Generate HMAC-MD5 signature for Capitalist API
 * According to docs: concatenate required params alphabetically, then HMAC-MD5 with secret key
 */
export function generateSignature(params: Record<string, string>): string {
    // Sort parameters alphabetically by key
    const sortedKeys = Object.keys(params).sort();

    // Concatenate values in alphabetical order of keys
    const dataString = sortedKeys.map(key => params[key]).join('');

    // Generate HMAC-MD5 signature
    const signature = CryptoJS.HmacMD5(dataString, CAPITALIST_SECRET_KEY).toString();

    return signature;
}

/**
 * Create payment form data for redirecting to Capitalist payment page
 */
export function createPaymentFormData(data: PaymentFormData): PaymentParams {
    const baseParams: Record<string, string> = {
        oa: CAPITALIST_MERCHANT_ADDRESS,  // Merchant address
        o: data.operationId,               // Operation ID (order ID)
        c: data.currency,                  // Currency code
        s: data.amount.toFixed(2),         // Sum
        d: data.description,               // Description
        su: `${SITE_URL}/#/payment/success?order=${data.operationId}`,  // Success URL
        fu: `${SITE_URL}/#/payment/fail?order=${data.operationId}`,     // Fail URL
        us: `${SITE_URL}/#/payment/status?order=${data.operationId}`,   // Status URL
        i: `${SITE_URL}/api/capitalist-webhook`,  // Interaction URL (webhook)
        l: data.lang || 'ru',              // Language
    };

    if (data.email) {
        baseParams.em = data.email;
    }

    // Generate signature using required params with correct field names
    // Order: amount, currency, description, merchantid, number (alphabetical)
    const signParams = {
        amount: baseParams.s,
        currency: baseParams.c,
        description: baseParams.d,
        merchantid: baseParams.oa,
        number: baseParams.o,
    };

    const sign = generateSignature(signParams);

    return {
        merchantAddress: baseParams.oa,
        operationId: baseParams.o,
        currency: baseParams.c,
        sum: baseParams.s,
        description: baseParams.d,
        email: data.email,
        successURL: baseParams.su,
        failURL: baseParams.fu,
        statusURL: baseParams.us,
        interactionURL: baseParams.i,
        lang: baseParams.l,
        sign: sign,
    };
}

/**
 * Create and submit payment form to Capitalist
 */
export function redirectToPayment(data: PaymentFormData): void {
    const params = createPaymentFormData(data);

    // Create a form and submit it
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = CAPITALIST_PAY_URL;
    form.style.display = 'none';

    const fields: Record<string, string> = {
        merchantid: params.merchantAddress,
        number: params.operationId,
        currency: params.currency,
        amount: params.sum,
        description: params.description,
        success_url: params.successURL,
        fail_url: params.failURL,
        status_url: params.statusURL,
        interaction_url: params.interactionURL,
        lang: params.lang,
        sign: params.sign,
    };

    if (params.email) {
        fields.email = params.email;
    }

    Object.entries(fields).forEach(([name, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
}

/**
 * Verify webhook signature from Capitalist
 */
export function verifyWebhookSignature(params: Record<string, string>, receivedSign: string): boolean {
    const signParams = {
        c: params.c || '',
        o: params.o || '',
        oa: params.oa || '',
        s: params.s || '',
        st: params.st || '',
    };

    const calculatedSign = generateSignature(signParams);
    return calculatedSign === receivedSign;
}

// Currency codes supported by Capitalist
export const CAPITALIST_CURRENCIES = {
    RUR: 'RUR',  // Russian Rubles (not RUB!)
    USD: 'USD',
    EUR: 'EUR',
    USDT_TRC20: 'USDT-TRC20',
    USDT_ERC20: 'USDT-ERC20',
    BTC: 'BTC',
} as const;

export type CapitalistCurrency = keyof typeof CAPITALIST_CURRENCIES;
