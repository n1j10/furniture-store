'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const cartId = searchParams.get('cartId');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    if (!orderId || !cartId) {
      setError('بيانات الطلب غير مكتملة. ارجع إلى سلة التسوق وحاول مرة أخرى.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, cartId }),
      });
      const responseText = await response.text();
      let data: { error?: string; paymentUrl?: string } | undefined;
      try {
        data = responseText ? JSON.parse(responseText) : undefined;
      } catch {
        // A middleware/proxy response may be HTML or empty; report its HTTP status instead.
      }
      if (!response.ok) {
        throw new Error(data?.error || `تعذر بدء عملية الدفع (HTTP ${response.status})`);
      }
      const paymentUrl = data?.paymentUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        throw new Error('لم يتم استلام رابط الدفع');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر بدء عملية الدفع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="checkout" className="flex flex-col items-center p-8">
      <h1 className="font-bold text-2xl mb-6">Checkout</h1>
      <button
        onClick={handlePay}
        disabled={loading || !orderId || !cartId}
        className="pay-button h-12 min-w-[200px] rounded-lg bg-[#F5A623] px-6 font-semibold text-lg text-white transition-transform duration-200 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'جارٍ التحويل...' : 'الدفع عبر ZainCash'}
      </button>
      {error && <p role='alert' className='mt-4 text-sm text-destructive'>{error}</p>}
    </div>
  );
}


export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className='p-8 text-center'>جارٍ تحميل الدفع...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
