import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { analyzeDocument } from "@/lib/documents/ai";
import { cleanFilename, detectType, EXTENSION_FOR, extensionMatches, looksExecutable, type SafeType } from "@/lib/documents/file-check";
import { DAILY_UPLOADS, DOCUMENT_COLUMNS, FILE_TYPES, MAX_FILE_BYTES, toVaultDocument, type DocumentRow } from "@/lib/documents/types";
import { forbidden, requireUnlocked, sameOrigin } from "@/lib/documents/vault";

// Reading a long PDF can take a while.
export const maxDuration = 60;

const BUCKET = "documents";
const LIMIT_MESSAGE = `You've uploaded ${DAILY_UPLOADS} documents today. Try again tomorrow.`;

/**
 * Uploading happens in two steps, so large files never pass through this server (hosting caps
 * request bodies well under 10 MB):
 *   1. start: checks the name, size and daily limit, and returns a path in the person's folder.
 *      The browser then uploads the file straight to the private bucket (storage only accepts
 *      the person's own folder, while unlocked, up to 10 MB, PDF/JPG/PNG/WebP).
 *   2. finish: checks the stored file's real bytes, lets AI read it and saves the row. A file
 *      that fails a check, or a row that can't be saved, is removed again.
 */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return forbidden();
  const signed = await requireUnlocked();
  if (signed instanceof NextResponse) return signed;
  const { supabase, user } = signed;

  const body = (await request.json().catch(() => null)) as
    | { step?: string; filename?: unknown; size?: unknown; type?: unknown; path?: unknown }
    | null;
  if (!body) return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 400 });

  if (body.step === "start") {
    const filename = cleanFilename(String(body.filename ?? ""));
    const size = Number(body.size);
    const type = String(body.type ?? "") as SafeType;
    if (!FILE_TYPES.includes(type) || !extensionMatches(filename, type) || looksExecutable(filename)) {
      return NextResponse.json({ error: "Upload a PDF, JPG, PNG or WebP file." }, { status: 400 });
    }
    if (!Number.isFinite(size) || size <= 0) return NextResponse.json({ error: "This file is empty." }, { status: 400 });
    if (size > MAX_FILE_BYTES) return NextResponse.json({ error: "That file is over 10 MB." }, { status: 400 });
    if ((await uploadsToday(supabase)) >= DAILY_UPLOADS) {
      return NextResponse.json({ error: LIMIT_MESSAGE, code: "daily_limit" }, { status: 429 });
    }
    return NextResponse.json({ path: `${user.id}/${crypto.randomUUID()}.${EXTENSION_FOR[type]}` });
  }

  if (body.step !== "finish") return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 400 });

  const path = String(body.path ?? "");
  const pathOk = new RegExp(`^${user.id}/[0-9a-f-]{36}\\.(pdf|jpg|png|webp)$`).test(path);
  if (!pathOk) return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 400 });
  const filename = cleanFilename(String(body.filename ?? "document"));
  const remove = () => supabase.storage.from(BUCKET).remove([path]);

  const { data: blob, error: downloadError } = await supabase.storage.from(BUCKET).download(path);
  if (downloadError || !blob) return NextResponse.json({ error: "We couldn't find the uploaded file. Please try again." }, { status: 400 });
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const type = detectType(bytes);
  if (!type || bytes.length > MAX_FILE_BYTES || !extensionMatches(filename, type) || !path.endsWith(`.${EXTENSION_FOR[type]}`) || looksExecutable(filename)) {
    await remove();
    return NextResponse.json({ error: "That file isn't a real PDF, JPG, PNG or WebP." }, { status: 400 });
  }

  const analysis = await analyzeDocument(bytes, type);
  const { data, error } = await supabase
    .from("documents")
    .insert({
      user_id: user.id,
      filename,
      storage_path: path,
      file_type: type,
      file_size: bytes.length,
      category: analysis.category,
      issue_date: analysis.issueDate,
      expiry_date: analysis.expiryDate,
      summary: analysis.summary || null,
      extracted_fields: analysis.fields,
      ai_confidence: analysis.confidence,
    })
    .select(DOCUMENT_COLUMNS)
    .single<DocumentRow>();

  if (error || !data) {
    await remove();
    const limit = error?.hint === "daily_upload_limit";
    return NextResponse.json(
      limit ? { error: LIMIT_MESSAGE, code: "daily_limit" } : { error: "We couldn't save that document. Please try again." },
      { status: limit ? 429 : 500 },
    );
  }

  return NextResponse.json({
    document: toVaultDocument(data),
    // Ask the person to check: "unread" (AI couldn't read it), "unsure" (low confidence) or
    // "no_expiry" (read fine, but no expiry date printed). null when nothing needs checking.
    review: analysis.confidence === 0 ? "unread" : analysis.confidence < 50 ? "unsure" : !analysis.expiryDate ? "no_expiry" : null,
  });
}

async function uploadsToday(supabase: SupabaseClient) {
  const since = new Date(Date.now() - 86_400_000).toISOString();
  const { count } = await supabase.from("documents").select("id", { count: "exact", head: true }).gte("uploaded_at", since);
  return count ?? 0;
}
