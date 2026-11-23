"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BellRing, ChevronDown, FileBadge, FolderOpen, Lock, Plus, Search, Settings } from "lucide-react";
import { Dialog } from "@/components/app/Dialog";
import { FormMessage } from "@/components/auth/FormMessage";
import { Spinner } from "@/components/ui/Spinner";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  DOCUMENT_TYPES,
  typeGroup,
  SORTS,
  daysUntil,
  documentTypeLabel,
  filterAndSort,
  localToday,
  type SortKey,
  type VaultDocument,
} from "@/lib/documents/types";
import { appBtnDanger, appBtnPrimary, appBtnSecondary, appCard, appField, appLink, appTitle, focusRing } from "@/lib/ui";
import { DocumentCard, TYPE_ICONS } from "./DocumentCard";
import { DocumentDialog } from "./DocumentDialog";
import { DocumentsIntro } from "./DocumentsIntro";
import { UnlockScreen } from "./PasscodeScreens";
import { SecurityStrip } from "./SecurityStrip";
import { UploadDialog } from "./UploadDialog";
import { api } from "./shared";

type Vault = { hasPasscode: boolean; unlocked: boolean; lockedUntil: string | null; autoLockMinutes: number; lockoutMinutes: number };
type View = "loading" | "error" | "setup" | "locked" | "open";

/**
 * Documents: a passcode-locked place for immigration documents, read by AI, with expiry
 * reminders. Checks the lock first, then shows the setup or unlock screen, or the documents.
 */
export function DocumentsClient({ email, remindersOn }: { email: string; remindersOn: boolean }) {
  const [view, setView] = useState<View>("loading");
  const [vault, setVault] = useState<Vault | null>(null);
  const [docs, setDocs] = useState<VaultDocument[] | null>(null);
  const [docsError, setDocsError] = useState<string | null>(null);
  // Set in the browser only, so dates compare in the person's own time zone.
  const [today, setToday] = useState("");

  const loadDocs = useCallback(async () => {
    setDocsError(null);
    const res = await api<{ documents?: VaultDocument[] }>("/api/documents");
    if (res.status === 423) return setView("locked");
    if (!res.ok) return setDocsError(res.data.error ?? "We couldn't load your documents.");
    setToday(localToday());
    setDocs(res.data.documents ?? []);
  }, []);

  const checkVault = useCallback(async () => {
    const res = await api<Vault>("/api/documents/vault");
    if (!res.ok) return setView("error");
    setVault(res.data);
    if (!res.data.hasPasscode) return setView("setup");
    if (!res.data.unlocked) return setView("locked");
    setView("open");
    void loadDocs();
  }, [loadDocs]);

  useEffect(() => {
    // Runs once on mount: the lock state comes from the server.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void checkVault();
  }, [checkVault]);

  const lock = useCallback(async () => {
    await api("/api/documents/vault", { body: { action: "lock" } });
    setDocs(null);
    setView("locked");
  }, []);

  useAutoLock(view === "open" ? (vault?.autoLockMinutes ?? 5) : 0, lock);

  const unlocked = () => {
    setView("open");
    void checkVault();
  };

  return (
    <>
      <header className="enter flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className={appTitle}>Documents</h1>
          <p className="mt-0.5 max-w-xl text-small text-slate">
            Your immigration documents in one private place, with a reminder before anything expires.
          </p>
        </div>
        {view === "open" && <OpenActions onLock={lock} onUploaded={(d) => setDocs((list) => upsert(list, d))} />}
      </header>

      {view === "loading" && <LoadingState />}
      {view === "error" && (
        <div className={`${appCard} mt-5 p-5 text-center`}>
          <p className="text-small text-slate">We couldn&apos;t open your documents.</p>
          <button type="button" onClick={() => void checkVault()} className={`${appLink} mx-auto mt-1`}>
            Try again
          </button>
        </div>
      )}
      {view === "setup" && (
        <>
          <DocumentsIntro onDone={unlocked} />
          <SecurityStrip />
        </>
      )}
      {view === "locked" && <UnlockScreen lockedUntil={vault?.lockedUntil ?? null} lockoutMinutes={vault?.lockoutMinutes ?? 5} onDone={unlocked} />}
      {view === "open" && (
        <OpenVault
          docs={docs}
          error={docsError}
          today={today}
          email={email}
          remindersOn={remindersOn}
          onRetry={() => void loadDocs()}
          onChange={setDocs}
        />
      )}
    </>
  );
}

function upsert(list: VaultDocument[] | null, doc: VaultDocument) {
  const rest = (list ?? []).filter((d) => d.id !== doc.id);
  return [doc, ...rest];
}

/** Locks again after the chosen minutes without a click, key or scroll (0 = never). */
function useAutoLock(minutes: number, lock: () => void) {
  const last = useRef(0);
  useEffect(() => {
    if (!minutes) return;
    last.current = Date.now();
    const touch = () => (last.current = Date.now());
    const events = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, touch, { passive: true }));
    const timer = window.setInterval(() => {
      if (Date.now() - last.current >= minutes * 60_000) lock();
    }, 15_000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, touch));
      window.clearInterval(timer);
    };
  }, [minutes, lock]);
}

/** Lock and Upload, top right. The upload dialog lives here. */
function OpenActions({ onLock, onUploaded }: { onLock: () => void; onUploaded: (d: VaultDocument) => void }) {
  const [uploading, setUploading] = useState(false);
  return (
    <div className="flex gap-2">
      <Link
        href="/dashboard/settings/preferences#documents"
        aria-label="Documents settings"
        title="Settings"
        className={`${appBtnSecondary} w-10 px-0! sm:w-9`}
      >
        <Settings aria-hidden className="size-4 shrink-0" />
      </Link>
      <button type="button" onClick={onLock} className={appBtnSecondary}>
        <Lock aria-hidden className="size-4" />
        Lock
      </button>
      <button type="button" onClick={() => setUploading(true)} className={appBtnPrimary} data-upload>
        <Plus aria-hidden className="size-4" />
        Upload
      </button>
      <UploadDialog open={uploading} onClose={() => setUploading(false)} onUploaded={onUploaded} />
    </div>
  );
}

function OpenVault({
  docs,
  error,
  today,
  email,
  remindersOn,
  onRetry,
  onChange,
}: {
  docs: VaultDocument[] | null;
  error: string | null;
  today: string;
  email: string;
  remindersOn: boolean;
  onRetry: () => void;
  onChange: (fn: (list: VaultDocument[] | null) => VaultDocument[] | null) => void;
}) {
  const [type, setType] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("expiring");
  const [openId, setOpenId] = useState<string | null>(null);
  const [editOnOpen, setEditOnOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  async function download(id: string) {
    setDownloadError(null);
    setDownloadingId(id);
    const res = await api<{ downloadUrl?: string | null }>(`/api/documents/${id}`);
    setDownloadingId(null);
    if (res.ok && res.data.downloadUrl) window.location.assign(res.data.downloadUrl);
    else setDownloadError(res.data.error ?? "We couldn't download that document. Please try again.");
  }

  // Only the types this person has saved get a chip; anything uncommon falls under Other.
  const present = useMemo(() => new Set((docs ?? []).map((d) => typeGroup(d.category))), [docs]);
  // A chip disappears when its last document is deleted; fall back to all documents.
  const activeType = type === "all" || present.has(type) ? type : "all";
  const list = useMemo(() => filterAndSort([...(docs ?? [])], activeType, search, sort), [docs, activeType, search, sort]);
  const openDoc = docs?.find((d) => d.id === openId) ?? null;

  if (error) {
    return (
      <div className="mt-5">
        <FormMessage tone="error">{error}</FormMessage>
        <button type="button" onClick={onRetry} className={`${appLink} mt-2`}>
          Try again
        </button>
      </div>
    );
  }
  if (!docs) return <LoadingState />;

  const filtered = activeType !== "all" || search.trim() !== "";
  return (
    <div className="enter enter-delay">
      <Footnotes email={email} remindersOn={remindersOn} />

      {docs.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <Stats docs={docs} today={today} />

          <TypeChips value={activeType} onChange={setType} present={present} />

          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search documents"
                aria-label="Search documents"
                className={`${appField} pl-9`}
              />
            </div>
            <Select label="Sort documents" value={sort} onChange={(v) => setSort(v as SortKey)}>
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <p aria-live="polite" className="text-caption text-slate">
              {filtered ? `${list.length} of ${docs.length} documents` : `${docs.length} ${docs.length === 1 ? "document" : "documents"}`}
            </p>
            {filtered && (
              <button
                type="button"
                onClick={() => {
                  setType("all");
                  setSearch("");
                }}
                className={appLink}
              >
                Clear filters
              </button>
            )}
          </div>

          {downloadError && (
            <div className="mt-2">
              <FormMessage tone="error">{downloadError}</FormMessage>
            </div>
          )}

          {list.length === 0 ? (
            <div className={`${appCard} mt-2 px-5 py-8 text-center text-small text-slate`}>No documents match.</div>
          ) : (
            <ul className="mt-2 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {list.map((d) => (
                <li key={d.id} className="flex">
                  <DocumentCard
                    doc={d}
                    today={today}
                    downloading={downloadingId === d.id}
                    onDownload={() => void download(d.id)}
                    onDelete={() => setDeleteId(d.id)}
                    onOpen={() => {
                      setEditOnOpen(false);
                      setOpenId(d.id);
                    }}
                    onAddExpiry={() => {
                      setEditOnOpen(true);
                      setOpenId(d.id);
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <DeleteDialog
        doc={docs.find((d) => d.id === deleteId) ?? null}
        onClose={() => setDeleteId(null)}
        onDeleted={(id) => onChange((l) => (l ?? []).filter((x) => x.id !== id))}
      />

      <DocumentDialog
        doc={openDoc}
        today={today}
        startEditing={editOnOpen}
        onClose={() => setOpenId(null)}
        onChanged={(d) => onChange((l) => (l ?? []).map((x) => (x.id === d.id ? d : x)))}
        onDeleted={(id) => onChange((l) => (l ?? []).filter((x) => x.id !== id))}
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative sm:w-48">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${appField} cursor-pointer appearance-none pr-9`}
      >
        {children}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-slate" />
    </div>
  );
}

/** Three numbers that matter: how many, how many expire within 30 days, how many have expired. */
function Stats({ docs, today }: { docs: VaultDocument[]; today: string }) {
  const days = docs.map((d) => daysUntil(d.expiryDate, today));
  const soon = days.filter((n) => n !== null && n >= 0 && n <= 30).length;
  const expired = days.filter((n) => n !== null && n < 0).length;
  const counts = new Map<string, number>();
  for (const d of docs) counts.set(typeGroup(d.category), (counts.get(typeGroup(d.category)) ?? 0) + 1);
  const [topType, topCount] = [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0] ?? ["", 0];
  const tiles = [
    { label: "Documents", value: String(docs.length), note: "Saved", tone: "text-midnight", text: false },
    { label: "Expiring soon", value: String(soon), note: "Within 30 days", tone: soon ? "text-amber" : "text-midnight", text: false },
    { label: "Expired", value: String(expired), note: expired ? "Update the dates" : "None", tone: expired ? "text-red" : "text-midnight", text: false },
    {
      label: "Most common",
      value: topType ? documentTypeLabel(topType) : "None",
      note: `${topCount} ${topCount === 1 ? "document" : "documents"}`,
      tone: "text-midnight",
      text: true,
    },
  ];
  return (
    <dl className="mt-5 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
      {tiles.map((t) => (
        <div key={t.label} className={`${appCard} min-w-0 px-3 py-3 sm:px-4`}>
          <dt className="text-caption text-slate">{t.label}</dt>
          <dd className={`mt-0.5 truncate tabular-nums ${t.text ? "text-title leading-8" : "text-h3"} ${t.tone}`} title={t.value}>
            {t.value}
          </dd>
          <dd className="text-caption text-slate">{t.note}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Type chips: All, every known type, then any types the person typed themselves, then Other.
 * One scrolling row, so the list stays a single line on every screen.
 */
function TypeChips({ value, onChange, present }: { value: string; onChange: (v: string) => void; present: Set<string> }) {
  // DOCUMENT_TYPES ends with Other, so it stays last.
  const chips = [{ value: "all", label: "All documents" }, ...DOCUMENT_TYPES.filter((t) => present.has(t.value))];
  return (
    <div role="group" aria-label="Filter by type" className="-mx-4 mt-5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 [scrollbar-width:thin]">
      <div className="flex w-max gap-1.5">
        {chips.map((c) => (
          <Chip key={c.value} value={c.value} label={c.label} active={value === c.value} onClick={() => onChange(c.value)} />
        ))}
      </div>
    </div>
  );
}

function Chip({ value, label, active, onClick }: { value: string; label: string; active: boolean; onClick: () => void }) {
  const Icon = value === "all" ? FolderOpen : (TYPE_ICONS[value] ?? FileBadge);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex h-8 shrink-0 cursor-pointer items-center gap-1 rounded-full border px-2.5 text-caption font-medium whitespace-nowrap transition-colors duration-200 ${focusRing} ${
        active ? "border-blue bg-blue text-white" : "border-border bg-white text-midnight hover:border-blue/40 hover:bg-ice/60"
      }`}
    >
      <Icon aria-hidden className={`size-3 ${active ? "text-white" : "text-blue"}`} />
      {label}
    </button>
  );
}

/** "Delete this document?" from a card. The file and its details go for good. */
function DeleteDialog({ doc, onClose, onDeleted }: { doc: VaultDocument | null; onClose: () => void; onDeleted: (id: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    if (!doc) return;
    setError(null);
    setBusy(true);
    const res = await api(`/api/documents/${doc.id}`, { method: "DELETE" });
    setBusy(false);
    if (!res.ok) return setError(res.data.error ?? "We couldn't delete that document. Please try again.");
    onDeleted(doc.id);
    onClose();
  }

  return (
    <Dialog
      open={!!doc}
      onClose={() => {
        if (busy) return;
        setError(null);
        onClose();
      }}
      title="Delete this document?"
    >
      <p className="text-small text-slate">
        <span className="font-medium text-midnight">{doc?.filename}</span> and its details will be deleted. You can&apos;t undo this.
      </p>
      {error && (
        <div className="mt-3">
          <FormMessage tone="error">{error}</FormMessage>
        </div>
      )}
      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onClose} disabled={busy} className={appBtnSecondary} data-autofocus>
          Cancel
        </button>
        <button type="button" onClick={() => void remove()} disabled={busy} className={appBtnDanger}>
          {busy ? (
            <>
              <Spinner />
              Deleting…
            </>
          ) : (
            "Delete"
          )}
        </button>
      </div>
    </Dialog>
  );
}

function EmptyState() {
  return (
    <div className={`${appCard} mt-5 flex flex-col items-center px-6 py-10 text-center sm:py-12`}>
      <span className="flex size-12 items-center justify-center rounded-xl bg-ice text-blue">
        <FolderOpen aria-hidden className="size-6" />
      </span>
      <h2 className="mt-4 text-body font-semibold text-midnight">Add your first document</h2>
      <p className="mt-1 max-w-sm text-small text-slate">
        Upload a passport, green card, work permit or USCIS notice. We read the dates for you and remind you before it expires.
      </p>
      <button
        type="button"
        onClick={() => document.querySelector<HTMLButtonElement>("[data-upload]")?.click()}
        className={`${appBtnPrimary} mt-5`}
      >
        <Plus aria-hidden className="size-4" />
        Upload a document
      </button>
    </div>
  );
}

function Footnotes({ email, remindersOn }: { email: string; remindersOn: boolean }) {
  return (
    <div className="mt-5">
      <div className="flex gap-3 rounded-xl bg-ice px-4 py-3.5">
        <BellRing aria-hidden className="mt-0.5 size-4 shrink-0 text-blue" />
        <div className="text-small">
          <p className="font-medium text-midnight">{remindersOn ? "Expiry reminders are on" : "Expiry reminders are off"}</p>
          <p className="mt-0.5 text-slate">
            {remindersOn
              ? `We email ${email} 60, 45, 30, 20, 10 and 5 days before a document expires, and on the day.`
              : "Turn them on to get an email before a document expires."}{" "}
            <Link href="/dashboard/settings/preferences#documents" className="font-medium text-blue underline-offset-2 hover:underline">
              Change
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div role="status" aria-label="Loading your documents" className="mt-5">
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className={`h-32 rounded-xl ${i > 1 ? "hidden sm:block" : ""}`} />
        ))}
      </div>
    </div>
  );
}
