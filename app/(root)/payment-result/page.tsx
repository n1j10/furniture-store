'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PaymentResultContent() {
  const isSuccess = useSearchParams().get('status') === 'success';
  return (
    <main className='mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center gap-5 px-6 text-center'>
      <h1 className='text-2xl font-bold'>
        {isSuccess ? 'تم الدفع بنجاح' : 'لم تكتمل عملية الدفع'}
      </h1>
      <p className='text-muted-foreground'>
        {isSuccess
          ? 'تم تأكيد طلبك عبر ZainCash.'
          : 'لم يتم تأكيد الدفع. يمكنك المحاولة مرة أخرى من سلة التسوق.'}
      </p>
      <Link
        href={isSuccess ? '/orders' : '/cart'}
        className='rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground'
      >
        متابعة
      </Link>
    </main>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={<main className='p-8 text-center'>جارٍ التحقق من الدفع...</main>}>
      <PaymentResultContent />
    </Suspense>
  );
}
