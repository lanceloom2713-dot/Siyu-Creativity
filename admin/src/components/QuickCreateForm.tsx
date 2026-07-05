import { Plus } from "lucide-react";
import { FormEvent, useState } from "react";

type QuickCreateFormProps = {
  label: string;
  placeholder: string;
  onCreate: (value: string) => void;
};

export function QuickCreateForm({ label, placeholder, onCreate }: QuickCreateFormProps) {
  const [value, setValue] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const nextValue = value.trim();
    if (!nextValue) return;
    onCreate(nextValue);
    setValue("");
  };

  return (
    <form className="mt-5 flex flex-col gap-3 rounded-lg bg-panel p-4 shadow-panel sm:flex-row" onSubmit={submit}>
      <input
        className="min-h-11 flex-1 rounded-lg border border-ink/10 px-4 text-sm outline-none focus:border-accent"
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
      <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-white" type="submit">
        <Plus size={16} />
        {label}
      </button>
    </form>
  );
}
