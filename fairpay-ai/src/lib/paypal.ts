// ── PayPal Sandbox helpers (server-side only) ──────────────────────────────

export const PAYPAL_CLIENT_ID =
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? 'sb';

const BASE_URL =
    process.env.PAYPAL_BASE_URL ?? 'https://api-m.sandbox.paypal.com';

/**
 * Exchange Client ID + Secret for a short-lived Bearer token.
 * Called only inside Next.js API Route Handlers (server-side).
 */
export async function getPayPalAccessToken(): Promise<string> {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !secret) {
        throw new Error(
            'Missing NEXT_PUBLIC_PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET in .env.local'
        );
    }

    const credentials = Buffer.from(`${clientId}:${secret}`).toString('base64');

    const res = await fetch(`${BASE_URL}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
        cache: 'no-store',
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`PayPal auth failed: ${res.status} – ${text}`);
    }

    const data = await res.json();
    return data.access_token as string;
}

export { BASE_URL as PAYPAL_BASE_URL };
