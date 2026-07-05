import { MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { publicCatalogueApi } from "../../services/publicCatalogueApi";
import { createWhatsappUrl } from "../../utils/whatsapp";

export function FloatingWhatsApp() {
  const { data: settings } = useQuery({ queryKey: ["public-settings"], queryFn: publicCatalogueApi.getSettings });

  return (
    <a
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-xl"
      href={createWhatsappUrl(settings?.whatsapp)}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={26} />
    </a>
  );
}
