import { NextRequest, NextResponse } from 'next/server';
import db from '@/utils/db';
import {
  getString,
  inquireZainCashPayment,
  settleZainCashPayment,
  verifyCallbackToken,
  ZainCashError,
} from '@/lib/zaincash';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const token = typeof body?.webhook_token === 'string'
  ? body.webhook_token: typeof body?.webhookToken === 'string'
      ? body.webhookToken
      : undefined;
  if (!token) return NextResponse.json({ error: 'Missing webhook token' }, { status: 400 });

  try {
    const payload = verifyCallbackToken(token);

    const eventId = getString(payload, 'eventId', 'event_id');

    const transactionId = getString(payload, 'transactionId', 'transaction_id');

    const status = getString(payload, 'status', 'currentStatus', 'transactionStatus', 'paymentStatus');

    if (!eventId || !transactionId || !status) {
      return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 });
    }

    const existing = await db.zainCashWebhookEvent.findUnique({ where: { eventId } });
    if (existing?.processedAt) return NextResponse.json({ received: true });

    const payment = await db.zainCashPayment.findUnique({ where: { transactionId } });

    if (!payment) return NextResponse.json({ error: 'Unknown transaction' }, { status: 404 });

    const event = existing ?? await db.zainCashWebhookEvent.create({
      data: {
        eventId,
        paymentId: payment.id,
        status,
        payload: JSON.parse(JSON.stringify(payload)),
      },
    });

    // The webhook is signed; inquiry adds a second server-to-server confirmation.
    const inquiry = await inquireZainCashPayment(transactionId);

    await settleZainCashPayment({ transactionId, ...inquiry });

    await db.zainCashWebhookEvent.update({
      where: { id: event.id },
      data: { 
        processedAt: new Date(), 
        status: inquiry.status 
      },
    });
    return NextResponse.json({ received: true });
    
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('ZainCash webhook processing failed', { message });
    // A 5xx tells ZainCash to retry a valid event that was not processed.
    return NextResponse.json(
      { error: error instanceof ZainCashError ? message : 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
