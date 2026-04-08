import { Suspense } from "react";

import SurgeonPreferenceComparisonClient from "./preferences-client";

export default function SurgeonPreferenceComparisonPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-screen max-w-[420px] items-center justify-center bg-[var(--app-bg)] px-4 text-slate-600">
          불러오는 중...
        </div>
      }
    >
      <SurgeonPreferenceComparisonClient />
    </Suspense>
  );
}
