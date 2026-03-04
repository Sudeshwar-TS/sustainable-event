'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InvitePage({ params }: { params: { eventToken: string } }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/entrance/${params.eventToken}`);
  }, [router, params.eventToken]);

  return <div>Redirecting...</div>;
}