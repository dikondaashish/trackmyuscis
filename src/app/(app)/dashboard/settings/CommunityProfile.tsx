"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImagePlus, Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  COMMUNITY_BIO_MAX,
  COMMUNITY_BUCKET,
  COMMUNITY_NAME_MAX,
  COMMUNITY_PHOTO_TYPES,
  communityInitial,
  communityNameProblem,
  communityPhotoProblem,
} from "@/lib/community";
import { USERNAME_MAX, usernameProblem } from "@/lib/username";
import { FormMessage } from "@/components/auth/FormMessage";
import { Spinner } from "@/components/ui/Spinner";
import { appBtnPrimary, appBtnSecondary, appField, appFieldLabel, appSectionTitle } from "@/lib/ui";

type Community = { name: string | null; bio: string | null; photoUrl: string | null; photoPath: string | null };

/** UTC so the server and browser render the same date. */
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

const factLabel = "text-caption font-medium text-slate";

function CommunityAvatar({ src, initial, size }: { src: string | null; initial: string; size: number }) {
  const [broken, setBroken] = useState(false);
  const style = { width: size, height: size };
  if (src && !broken) {
    return (
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        sizes={`${size}px`}
        unoptimized={src.startsWith("blob:")}
        onError={() => setBroken(true)}
        style={style}
        className="shrink-0 rounded-full border border-border bg-ice object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden
      style={style}
      className={`flex shrink-0 items-center justify-center rounded-full bg-blue font-semibold text-white ${size >= 64 ? "text-h3" : "text-body"}`}
    >
      {initial}
    </span>
  );
}

/**
 * The community profile: display name, username, bio and photo, kept apart from the person's
 * real name and Google photo. View first, with an Edit button; editing happens in place.
 */
export function CommunityProfile({
  userId,
  username,
  usernameLockedUntil,
  community,
}: {
  userId: string;
  username: string | null;
  usernameLockedUntil: string | null;
  community: Community;
}) {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const shownName = community.name?.trim() || username || "Your community name";
  const initial = communityInitial(community.name, username);

  return (
    <section aria-labelledby="community-title" className="rounded-xl border border-border bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 id="community-title" className={appSectionTitle}>
            Community profile
          </h2>
          <p className="mt-0.5 text-small text-slate">How you&apos;ll appear to others. Separate from your personal profile.</p>
        </div>
        {!editing && (
          <button
            type="button"
            onClick={() => {
              setSaved(false);
              setEditing(true);
            }}
            className={appBtnPrimary}
          >
            <Pencil aria-hidden className="size-3.5" />
            Edit profile
          </button>
        )}
      </div>

      {editing ? (
        <CommunityForm
          userId={userId}
          username={username ?? ""}
          usernameLockedUntil={usernameLockedUntil}
          community={community}
          onDone={(didSave) => {
            setEditing(false);
            setSaved(didSave);
          }}
        />
      ) : (
        <div className="swap mt-4 rounded-lg bg-cloud p-4 sm:p-5">
          {saved && (
            <div className="mb-4">
              <FormMessage tone="success">Profile saved.</FormMessage>
            </div>
          )}
          <div className="flex flex-col items-center text-center">
            <CommunityAvatar src={community.photoUrl} initial={initial} size={72} />
            <p className="mt-3 text-body font-semibold text-midnight">{shownName}</p>
            {username && <p className="text-small text-blue">u/{username}</p>}
          </div>
          <dl className="mt-5 grid gap-4 text-small sm:grid-cols-2">
            <div>
              <dt className={factLabel}>Display name</dt>
              <dd className="mt-0.5 text-midnight">{community.name?.trim() || <span className="text-slate">Not set (shows your username)</span>}</dd>
            </div>
            <div>
              <dt className={factLabel}>Username</dt>
              <dd className="mt-0.5 text-midnight">{username ? `u/${username}` : "—"}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className={factLabel}>Bio</dt>
              <dd className="mt-0.5 whitespace-pre-line break-words text-midnight">
                {community.bio?.trim() || <span className="text-slate">No bio yet.</span>}
              </dd>
            </div>
          </dl>
          <p className="mt-5 border-t border-border pt-3 text-caption text-slate">
            Nobody can see your community profile yet. It will be what others see when community features launch. Your
            real name and email are never shown here.
          </p>
        </div>
      )}
    </section>
  );
}

function CommunityForm({
  userId,
  username,
  usernameLockedUntil,
  community,
  onDone,
}: {
  userId: string;
  username: string;
  usernameLockedUntil: string | null;
  community: Community;
  onDone: (saved: boolean) => void;
}) {
  const router = useRouter();
  const ids = { name: useId(), username: useId(), usernameHint: useId(), bio: useId(), bioCount: useId(), photo: useId() };
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(community.name ?? "");
  const [handle, setHandle] = useState(username);
  const [bio, setBio] = useState(community.bio ?? "");
  // Photo: keep the current one, replace it with a new file, or remove it.
  const [file, setFile] = useState<File | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const previewRef = useRef<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const locked = usernameLockedUntil !== null;

  function showPreview(next: File | null) {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = next ? URL.createObjectURL(next) : null;
    setPreview(previewRef.current);
    setFile(next);
  }
  useEffect(() => () => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
  }, []);

  const shownPhoto = preview ?? (removePhoto ? null : community.photoUrl);

  function pickPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0];
    e.target.value = "";
    if (!picked) return;
    const problem = communityPhotoProblem(picked);
    if (problem) return setError(problem);
    setError(null);
    setRemovePhoto(false);
    showPreview(picked);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const nextName = name.trim();
    const nextHandle = handle.trim();
    const nextBio = bio.trim();
    const handleChanged = nextHandle !== username;

    const problem =
      communityNameProblem(nextName) ??
      (handleChanged ? usernameProblem(nextHandle) : null) ??
      (nextBio.length > COMMUNITY_BIO_MAX ? `Keep your bio to ${COMMUNITY_BIO_MAX} characters.` : null);
    if (problem) return setError(problem);

    setBusy(true);
    const supabase = createClient();
    let newPath: string | null = null;
    if (file) {
      const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
      newPath = `${userId}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from(COMMUNITY_BUCKET)
        .upload(newPath, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
      if (uploadError) {
        setBusy(false);
        return setError("We couldn't upload that photo. Please try again.");
      }
    }

    const update: Record<string, string | null> = {
      community_name: nextName || null,
      community_bio: nextBio || null,
    };
    if (newPath) update.community_avatar_path = newPath;
    else if (removePhoto) update.community_avatar_path = null;
    if (handleChanged) update.username = nextHandle;

    const { error: saveError } = await supabase.from("profiles").update(update).eq("user_id", userId);
    if (saveError) {
      if (newPath) await supabase.storage.from(COMMUNITY_BUCKET).remove([newPath]);
      setBusy(false);
      const msg = saveError.message ?? "";
      return setError(
        saveError.hint === "username_cooldown"
          ? "You can change your username once every 30 days."
          : saveError.code === "23505"
            ? "That username is taken. Please try another."
            : msg.includes("community_name")
              ? "That display name isn't allowed. Please pick another."
              : msg.includes("username")
                ? "That username isn't allowed. Please try another."
                : "We couldn't save your profile. Please try again.",
      );
    }

    // The old photo is no longer used: remove it from storage (a leftover file is harmless).
    if (community.photoPath && (newPath || removePhoto)) {
      await supabase.storage.from(COMMUNITY_BUCKET).remove([community.photoPath]);
    }
    setBusy(false);
    router.refresh();
    onDone(true);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="swap mt-4 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <CommunityAvatar src={shownPhoto} initial={communityInitial(name, handle)} size={64} />
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <input
              ref={fileRef}
              id={ids.photo}
              type="file"
              accept={COMMUNITY_PHOTO_TYPES.join(",")}
              onChange={pickPhoto}
              className="sr-only"
              tabIndex={-1}
            />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={busy} className={appBtnSecondary}>
              <ImagePlus aria-hidden className="size-3.5" />
              {shownPhoto ? "Change photo" : "Upload photo"}
            </button>
            {shownPhoto && (
              <button
                type="button"
                onClick={() => {
                  showPreview(null);
                  setRemovePhoto(true);
                }}
                disabled={busy}
                className={`${appBtnSecondary} hover:border-red/40 hover:text-red`}
              >
                <Trash2 aria-hidden className="size-3.5" />
                Remove
              </button>
            )}
          </div>
          <p className="mt-1.5 text-caption text-slate">PNG, JPG or WebP, under 2 MB. Not your Google photo.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={ids.name} className={appFieldLabel}>
            Display name <span className="font-normal text-slate">(optional)</span>
          </label>
          <input
            id={ids.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={handle || "e.g. Priya R."}
            maxLength={COMMUNITY_NAME_MAX}
            disabled={busy}
            className={`${appField} mt-1.5`}
          />
        </div>
        <div>
          <label htmlFor={ids.username} className={appFieldLabel}>
            Username
          </label>
          <div className="relative mt-1.5">
            <span aria-hidden className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-body text-slate sm:text-small">
              u/
            </span>
            <input
              id={ids.username}
              value={handle}
              onChange={(e) => setHandle(e.target.value.replace(/\s/g, ""))}
              autoCapitalize="none"
              autoComplete="username"
              spellCheck={false}
              maxLength={USERNAME_MAX}
              disabled={busy || locked}
              aria-describedby={ids.usernameHint}
              className={`${appField} pl-8`}
            />
          </div>
          <p id={ids.usernameHint} className="mt-1.5 text-caption text-slate">
            {locked
              ? `You can change it again on ${formatDate(usernameLockedUntil)}.`
              : "Letters, numbers, - or _. Changes once every 30 days."}
          </p>
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor={ids.bio} className={appFieldLabel}>
            Bio <span className="font-normal text-slate">(optional)</span>
          </label>
          <span id={ids.bioCount} className={`text-caption tabular-nums ${bio.length > COMMUNITY_BIO_MAX ? "text-red" : "text-slate"}`}>
            {bio.length}/{COMMUNITY_BIO_MAX}
          </span>
        </div>
        <textarea
          id={ids.bio}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          maxLength={COMMUNITY_BIO_MAX}
          placeholder="e.g. Waiting on my I-485. Happy to share what I've learned."
          disabled={busy}
          aria-describedby={ids.bioCount}
          className={`${appField} mt-1.5 h-auto min-h-20 resize-y py-2 leading-snug`}
        />
        <p className="mt-1.5 text-caption text-slate">Don&apos;t include receipt numbers or anything that identifies you.</p>
      </div>

      {error && <FormMessage tone="error">{error}</FormMessage>}

      <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
        <button type="button" onClick={() => onDone(false)} disabled={busy} className={appBtnSecondary}>
          Cancel
        </button>
        <button type="submit" disabled={busy} className={appBtnPrimary}>
          {busy ? (
            <>
              <Spinner />
              Saving…
            </>
          ) : (
            "Save profile"
          )}
        </button>
      </div>
    </form>
  );
}
