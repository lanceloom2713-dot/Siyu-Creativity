import { ChangeEvent } from "react";
import { Upload } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { adminCmsApi } from "../services/adminCmsApi";
import { useToast } from "./ToastProvider";

type MediaUploadFieldProps = {
  label: string;
  title: string;
  alt: string;
  value: string;
  onChange: (url: string) => void;
};

export function MediaUploadField({ label, title, alt, value, onChange }: MediaUploadFieldProps) {
  const { notify } = useToast();
  const uploadMutation = useMutation({
    mutationFn: adminCmsApi.uploadMedia,
    onSuccess: (media) => {
      onChange(media.url);
      notify("File uploaded and URL attached.");
    },
    onError: () => notify("File upload failed.", "error")
  });

  const upload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    uploadMutation.mutate({ file, title: title || file.name, alt: alt || title || file.name });
  };

  return (
    <div className="grid gap-2">
      <label className="text-xs font-bold uppercase tracking-wide text-muted">{label}</label>
      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" placeholder="Paste URL or upload file" value={value} onChange={(event) => onChange(event.target.value)} />
        <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-ink/10 px-4 py-3 text-sm font-semibold">
          <Upload size={16} />
          {uploadMutation.isPending ? "Uploading..." : "Select"}
          <input accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm" className="sr-only" onChange={upload} type="file" />
        </label>
      </div>
      {value ? <p className="truncate text-xs text-muted">{value}</p> : null}
    </div>
  );
}
