import { ChangeEvent, useState } from "react";
import { X, Upload } from "lucide-react";
import { adminCmsApi } from "../services/adminCmsApi";
import { useToast } from "./ToastProvider";

type MultiMediaUploadFieldProps = {
  label: string;
  title: string;
  alt: string;
  value: string;
  onChange: (urls: string) => void;
};

const parseUrls = (value: string) =>
  value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

const serializeUrls = (urls: string[]) => urls.join("\n");

export function MultiMediaUploadField({ label, title, alt, value, onChange }: MultiMediaUploadFieldProps) {
  const { notify } = useToast();
  const [uploading, setUploading] = useState(false);
  const urls = parseUrls(value);

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    setUploading(true);
    try {
      const uploaded = await Promise.all(
        files.map((file) => adminCmsApi.uploadMedia({ file, title: title || file.name, alt: alt || title || file.name }))
      );
      onChange(serializeUrls([...urls, ...uploaded.map((media) => media.url)]));
      notify(`${uploaded.length} file uploaded and attached.`);
    } catch {
      notify("File upload failed.", "error");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const removeUrl = (url: string) => {
    onChange(serializeUrls(urls.filter((item) => item !== url)));
  };

  return (
    <div className="grid gap-2">
      <label className="text-xs font-bold uppercase tracking-wide text-muted">{label}</label>
      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <textarea
          className="min-h-24 rounded-lg border border-ink/10 px-4 py-3 text-sm"
          placeholder="Paste one URL per line or upload multiple files"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-ink/10 px-4 py-3 text-sm font-semibold">
          <Upload size={16} />
          {uploading ? "Uploading..." : "Select"}
          <input accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" multiple onChange={upload} type="file" />
        </label>
      </div>
      {urls.length ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {urls.map((url) => (
            <div className="flex items-center gap-2 rounded-lg border border-ink/10 p-2" key={url}>
              <img className="h-12 w-12 rounded-md object-cover" src={url} alt={alt || title} />
              <p className="min-w-0 flex-1 truncate text-xs text-muted">{url}</p>
              <button className="rounded-md border border-ink/10 p-1" onClick={() => removeUrl(url)} type="button" aria-label="Remove image">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
