import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { startZainCashCheckout, ZainCashError } from '@/lib/zaincash';

export const runtime = 'nodejs';

export async function POST(request: Request) {

  const user = await currentUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null);

  const orderId = typeof body?.orderId === 'string' ? body.orderId : undefined;

  const cartId = typeof body?.cartId === 'string' ? body.cartId : undefined;

  if (!orderId || !cartId) return NextResponse.json({ error: 'Invalid payment request' }, { status: 400 });

  try {
    const { redirectUrl } = await startZainCashCheckout({
      clerkId: user.id,
      orderId,
      cartId,
    });
    return NextResponse.json({ paymentUrl: redirectUrl });
    
  } catch (error) {
    const message = error instanceof ZainCashError ? error.message : 'Unable to start payment';
    console.error('ZainCash payment initialization failed', { orderId, message });
    const status =
      message === 'Order not found' ? 404 : message === 'Order has already been paid' ? 409 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
