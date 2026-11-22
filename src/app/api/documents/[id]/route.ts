import { NextResponse } from "next/server";
import { DOCUMENT_COLUMNS, isCalendarDate, normalizeType, toVaultDocument, type DocumentRow } from "@/lib/documents/types";
import { forbidden, requireUnlocked, sameOrigin } from "@/lib/documents/vault";

const BUCKET = "documents";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/** Short-lived links: long enough to look at the file, not to pass around. */
const LINK_SECONDS = 300;

type Context = { params: Promise<{ id: string }> };

const notFound = () => NextResponse.json({ error: "We couldn't find that document." }, { status: 404 });

/** One document with 5-minute links to view and download the file. */
export async function GET(_request: Request, { params }: Context) {
  const { id } = await params;
  if (!UUID.test(id)) return notFound();
  const signed = await requireUnlocked();
  if (signed instanceof NextResponse) return signed;
  const { supabase } = signed;

  const { data } = await supabase
    .from("documents")
    .select(`${DOCUMENT_COLUMNS}, storage_path`)
    .eq("id", id)
    .maybeSingle<DocumentRow & { storage_path: string }>();
  if (!data) return notFound();

  const [view, download] = await Promise.all([
    supabase.storage.from(BUCKET).createSignedUrl(data.storage_path, LINK_SECONDS),
    supabase.storage.from(BUCKET).createSignedUrl(data.storage_path, LINK_SECONDS, { download: data.filename }),
  ]);
  return NextResponse.json(
    { document: toVaultDocument(data), viewUrl: view.data?.signedUrl ?? null, downloadUrl: download.data?.signedUrl ?? null },
    { headers: { "cache-control": "no-store" } },
  );
}

/** Change the type, issue date or expiry date. A new expiry date restarts its reminders. */
export async function PATCH(request: Request, { params }: Context) {
  if (!sameOrigin(request)) return forbidden();
  const { id } = await params;
  if (!UUID.test(id)) return notFound();
  const signed = await requireUnlocked();
  if (signed instanceof NextResponse) return signed;

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Nothing to save." }, { status: 400 });

  const update: Record<string, string | null> = {};
  if ("category" in body) {
    const category = normalizeType(String(body.category ?? ""));
    if (!category) return NextResponse.json({ error: "Enter a document type." }, { status: 400 });
    update.category = category;
  }
  for (const [key, column] of [
    ["expiryDate", "expiry_date"],
    ["issueDate", "issue_date"],
  ] as const) {
    if (!(key in body)) continue;
    const value = body[key];
    if (value === null || value === "") update[column] = null;
    else if (typeof value === "string" && isCalendarDate(value) && value >= "1900-01-01" && value <= "2200-12-31") update[column] = value;
    else return NextResponse.json({ error: "Enter a real date." }, { status: 400 });
  }
  if (Object.keys(update).length === 0) return NextResponse.json({ error: "Nothing to save." }, { status: 400 });

  const { data, error } = await signed.supabase
    .from("documents")
    .update(update)
    .eq("id", id)
    .select(DOCUMENT_COLUMNS)
    .maybeSingle<DocumentRow>();
  if (error) return NextResponse.json({ error: "We couldn't save that. Please try again." }, { status: 500 });
  if (!data) return notFound();
  return NextResponse.json({ document: toVaultDocument(data) });
}

/** Delete the file and its row. The file goes first, so a failure never leaves a hidden file. */
export async function DELETE(request: Request, { params }: Context) {
  if (!sameOrigin(request)) return forbidden();
  const { id } = await params;
  if (!UUID.test(id)) return notFound();
  const signed = await requireUnlocked();
  if (signed instanceof NextResponse) return signed;
  const { supabase } = signed;

  const { data } = await supabase.from("documents").select("storage_path").eq("id", id).maybeSingle<{ storage_path: string }>();
  if (!data) return notFound();
  const { error: fileError } = await supabase.storage.from(BUCKET).remove([data.storage_path]);
  if (fileError) return NextResponse.json({ error: "We couldn't delete the file. Please try again." }, { status: 500 });
  const { error } = await supabase.from("documents").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "We couldn't delete that document. Please try again." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
