"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BellRing, ChevronDown, FolderOpen, Lock, Plus, Search } from "lucide-react";
import { FormMessage } from "@/components/auth/FormMessage";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  SORTS,
  daysUntil,
  documentTypeLabel,
  filterAndSort,
  localToday,
  type SortKey,
  type VaultDocument,
} from "@/lib/documents/types";
import { appBtnPrimary, appBtnSecondary, appCard, appField, appLink, appTitle } from "@/lib/ui";
import { DocumentCard } from "./DocumentCard";
import { DocumentDialog } from "./DocumentDialog";
import { SetupScreen, UnlockScreen } from "./PasscodeScreens";
import { UploadDialog } from "./UploadDialog";
import { api } from "./shared";

type Vault = { hasPasscode: boolean; unlocked: boolean; lockedUntil: string | null; autoLockMinutes: number };
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
      {view === "setup" && <SetupScreen onDone={unlocked} />}
      {view === "locked" && <UnlockScreen lockedUntil={vault?.lockedUntil ?? null} onDone={unlocked} />}
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

  const list = useMemo(() => filterAndSort([...(docs ?? [])], type, search, sort), [docs, type, search, sort]);
  const types = useMemo(() => [...new Set((docs ?? []).map((d) => d.category))].sort(), [docs]);
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

  const filtered = type !== "all" || search.trim() !== "";
  return (
    <div className="enter enter-delay">
      {docs.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <Stats docs={docs} today={today} />

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
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
            <Select label="Filter by type" value={type} onChange={setType}>
              <option value="all">All types</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {documentTypeLabel(t)}
                </option>
              ))}
            </Select>
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

          {list.length === 0 ? (
            <div className={`${appCard} mt-2 px-5 py-8 text-center text-small text-slate`}>No documents match.</div>
          ) : (
            <ul className="mt-2 grid gap-3 sm:grid-cols-2">
              {list.map((d) => (
                <li key={d.id} className="flex">
                  <DocumentCard
                    doc={d}
                    today={today}
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

      <Footnotes email={email} remindersOn={remindersOn} />

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
  const tiles = [
    { label: "Documents", value: docs.length, tone: "text-midnight" },
    { label: "Expiring in 30 days", value: soon, tone: soon ? "text-amber" : "text-midnight" },
    { label: "Expired", value: expired, tone: expired ? "text-red" : "text-midnight" },
  ];
  return (
    <dl className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
      {tiles.map((t) => (
        <div key={t.label} className={`${appCard} px-3 py-3 sm:px-4`}>
          <dt className="text-caption text-slate">{t.label}</dt>
          <dd className={`mt-0.5 text-h3 tabular-nums ${t.tone}`}>{t.value}</dd>
        </div>
      ))}
    </dl>
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
    <div className="mt-6">
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
