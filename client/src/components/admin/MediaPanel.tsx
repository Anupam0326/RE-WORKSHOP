import { useCallback, useEffect, useRef, useState } from "react";
import { ImagePlus, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import { mediaSlots, type MediaSlot } from "@/data/media";
import { explainError, listSiteMedia, removeSiteMedia, saveSiteMediaPhoto, updateSiteMediaText, type AdminMedia } from "@/lib/adminApi";

const MAX_UPLOAD_MB = 20;

function SlotCard({ slot, media, onChanged }: { slot: MediaSlot; media?: AdminMedia; onChanged: () => Promise<void> }) {
  const [caption, setCaption] = useState(media?.caption || slot.caption);
  const [alt, setAlt] = useState(media?.alt ?? "");
  const [busy, setBusy] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCaption(media?.caption || slot.caption);
    setAlt(media?.alt ?? "");
  }, [media, slot.caption]);

  const preview = media ? media.url_small ?? media.url : slot.fallback ? slot.fallback.urlSmall ?? slot.fallback.url : null;
  const textChanged = Boolean(media) && (caption.trim() !== media!.caption || alt.trim() !== media!.alt);

  async function upload(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error(`“${file.name}” isn’t an image.`);
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) return toast.error(`“${file.name}” is larger than ${MAX_UPLOAD_MB} MB.`);
    try {
      setBusy("Uploading…");
      await saveSiteMediaPhoto(slot.key, file, { caption: caption.trim() || slot.caption, alt: alt.trim() }, media);
      toast.success("Photo updated on the website");
      await onChanged();
    } catch (error) {
      toast.error(explainError(error));
    } finally {
      setBusy("");
    }
  }

  async function saveText() {
    try {
      setBusy("Saving…");
      await updateSiteMediaText(slot.key, { caption: caption.trim() || slot.caption, alt: alt.trim() });
      toast.success("Caption saved");
      await onChanged();
    } catch (error) {
      toast.error(explainError(error));
    } finally {
      setBusy("");
    }
  }

  async function reset() {
    if (!media || !window.confirm("Remove this photo and go back to the default?")) return;
    try {
      setBusy("Removing…");
      await removeSiteMedia(media);
      toast.success("Back to the default photo");
      await onChanged();
    } catch (error) {
      toast.error(explainError(error));
    } finally {
      setBusy("");
    }
  }

  return (
    <article className="admin-card admin-media">
      <div className="admin-media__preview">
        {preview ? <img src={preview} alt="" loading="lazy" /> : <span>No photo yet. A branded placeholder shows on the website.</span>}
        <span className={media ? "admin-badge" : "admin-badge admin-badge--muted"}>{media ? "Your photo" : preview ? "Default photo" : "Placeholder"}</span>
      </div>
      <div className="admin-media__body">
        <h2>{slot.label}</h2>
        <p className="admin-muted">{slot.hint}</p>
        <label className="admin-field">
          <span>Caption</span>
          <input value={caption} onChange={(event) => setCaption(event.target.value)} maxLength={60} disabled={Boolean(busy)} />
          {!media && <small className="admin-field__hint">Saved together with the photo you upload.</small>}
        </label>
        <label className="admin-field">
          <span>Describe the photo (for screen readers)</span>
          <input value={alt} onChange={(event) => setAlt(event.target.value)} maxLength={200} placeholder="What’s in the photo?" />
        </label>
        <div className="admin-media__actions">
          <button type="button" className="admin-btn admin-btn--primary admin-btn--sm" onClick={() => fileRef.current?.click()} disabled={Boolean(busy)}>
            <ImagePlus size={16} aria-hidden="true" /> {media ? "Replace photo" : "Upload photo"}
          </button>
          {textChanged && (
            <button type="button" className="admin-btn admin-btn--sm" onClick={saveText} disabled={Boolean(busy)}>
              <Save size={16} aria-hidden="true" /> Save caption
            </button>
          )}
          {media && (
            <button type="button" className="admin-btn admin-btn--sm" onClick={reset} disabled={Boolean(busy)}>
              <RotateCcw size={16} aria-hidden="true" /> Use default
            </button>
          )}
          <span className="admin-muted" aria-live="polite">
            {busy}
          </span>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            upload(file);
          }}
        />
      </div>
    </article>
  );
}

export function MediaPanel({ onChanged }: { onChanged: () => Promise<void> }) {
  const [media, setMedia] = useState<AdminMedia[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      setMedia(await listSiteMedia());
    } catch (err) {
      setError(explainError(err));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const changed = useCallback(async () => {
    await Promise.all([load(), onChanged()]);
  }, [load, onChanged]);

  return (
    <section aria-labelledby="media-title">
      <div className="admin-head">
        <div>
          <h1 id="media-title">Site photos</h1>
          <p className="admin-muted">Photos on the home page outside the product shelves. Please use real Re Workshop photos only, no stock or AI images.</p>
        </div>
      </div>
      {error && (
        <div className="admin-error" role="alert">
          {error}{" "}
          <button type="button" className="admin-link" onClick={load}>
            Try again
          </button>
        </div>
      )}
      <div className="admin-media-grid">
        {mediaSlots.map((slot) => (
          <SlotCard key={slot.key} slot={slot} media={media.find((item) => item.key === slot.key)} onChanged={changed} />
        ))}
      </div>
    </section>
  );
}
