import { NextRequest, NextResponse } from 'next/server';
import {
  extractCallbackToken,
  getString,
  inquireZainCashPayment,
  settleZainCashPayment,
  verifyCallbackToken,
} from '@/lib/zaincash';

export const runtime = 'nodejs';

function resultRedirect(request: NextRequest, status: 'success' | 'failed') {
  return NextResponse.redirect(new URL(`/payment-result?status=${status}`, request.url));
}

export async function GET(request: NextRequest) {
  const token = extractCallbackToken(request.nextUrl.search);

  if (!token) return resultRedirect(request, 'failed');

  try {
    const payload = verifyCallbackToken(token);
    const transactionId = getString(payload, 'transactionId', 'transaction_id');
    if (!transactionId) return resultRedirect(request, 'failed');

    // The signed redirect is useful for UX, but inquiry is the final status check.
    const result = await inquireZainCashPayment(transactionId);

    await settleZainCashPayment({ transactionId, ...result });

    return resultRedirect(request, result.status.toUpperCase() === 'SUCCESS' ? 'success' : 'failed');

  } catch (error) {
    console.error('ZainCash callback verification failed', {
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    return resultRedirect(request, 'failed');
  }
}
