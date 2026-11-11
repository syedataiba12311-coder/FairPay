import { NextResponse } from 'next/server';
import { getPayPalAccessToken, PAYPAL_BASE_URL } from '@/lib/paypal';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { orderID } = body;

        if (!orderID) {
            return NextResponse.json({ error: 'orderID is required' }, { status: 400 });
        }

        const accessToken = await getPayPalAccessToken();

        const res = await fetch(
            `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
            }
        );

        const data = await res.json();
        if (!res.ok) {
            console.error('PayPal capture-order error', data);
            return NextResponse.json(
                { error: data.message ?? 'Failed to capture PayPal order' },
                { status: res.status }
            );
        }

        // Extract payer details and capture amount for the response
        const captureUnit = data.purchase_units?.[0]?.payments?.captures?.[0];
        return NextResponse.json({
            success: true,
            status: data.status,
            orderID: data.id,
            payer: data.payer,
            amount: captureUnit?.amount,
            captureID: captureUnit?.id,
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('PayPal capture-order exception', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
