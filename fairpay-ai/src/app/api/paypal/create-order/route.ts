import { NextResponse } from 'next/server';
import { getPayPalAccessToken, PAYPAL_BASE_URL } from '@/lib/paypal';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            amount = '50.00',
            currency = 'USD',
            description = 'FairPay AI – Milestone Escrow Deposit',
        } = body;

        const accessToken = await getPayPalAccessToken();

        const res = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                Prefer: 'return=representation',
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        description,
                        amount: {
                            currency_code: currency,
                            value: String(parseFloat(amount).toFixed(2)),
                        },
                    },
                ],
                application_context: {
                    brand_name: 'FairPay AI',
                    user_action: 'PAY_NOW',
                },
            }),
            cache: 'no-store',
        });

        const data = await res.json();
        if (!res.ok) {
            console.error('PayPal create-order error', data);
            return NextResponse.json(
                { error: data.message ?? 'Failed to create PayPal order' },
                { status: res.status }
            );
        }

        return NextResponse.json({ id: data.id, status: data.status });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('PayPal create-order exception', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
