import { NextResponse } from "next/server";
import { DOCUMENT_COLUMNS, toVaultDocument, type DocumentRow } from "@/lib/documents/types";
import { requireUnlocked } from "@/lib/documents/vault";

/** Every document of the signed-in person, newest first. Needs this browser unlocked. */
export async function GET() {
  const signed = await requireUnlocked();
  if (signed instanceof NextResponse) return signed;
  const { data, error } = await signed.supabase
    .from("documents")
    .select(DOCUMENT_COLUMNS)
    .order("uploaded_at", { ascending: false })
    .returns<DocumentRow[]>();
  if (error) return NextResponse.json({ error: "We couldn't load your documents. Please try again." }, { status: 500 });
  return NextResponse.json({ documents: data.map(toVaultDocument) }, { headers: { "cache-control": "no-store" } });
}
