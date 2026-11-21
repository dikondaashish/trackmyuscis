"use client";

import { useState } from "react";
import { HeroReceiptCard } from "@/components/HeroReceiptCard";
import { ReceiptForm } from "@/components/ReceiptForm";
import type { ReceiptCheck } from "@/lib/receipt";

/**
 * The hero's two halves share one result: checking a number on the left fills in the
 * "how to read it" card on the right with that number.
 */
export function HeroTracker({ intro, note }: { intro: React.ReactNode; note: React.ReactNode }) {
  const [result, setResult] = useState<ReceiptCheck | null>(null);

  return (
    <>
      <div className="enter">
        {intro}
        <div className="mt-9 max-w-xl">
          <ReceiptForm onResult={setResult} />
        </div>
        {note}
      </div>
      <div className="enter enter-delay mx-auto w-full max-w-xl lg:max-w-none">
        <HeroReceiptCard result={result?.ok ? result : null} />
      </div>
    </>
  );
}
