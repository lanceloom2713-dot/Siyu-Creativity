import { WHATSAPP_NUMBER } from "../constants/catalogue";

const normalizeWhatsappNumber = (value?: string) => {
  const digits = String(value ?? "").replace(/\D/g, "");
  return digits || WHATSAPP_NUMBER;
};

export const createProductWhatsappUrl = (productName: string, whatsappNumber?: string) => {
  const text = `Hello Siyu Creativity, I am interested in ${productName}`;
  return `https://wa.me/${normalizeWhatsappNumber(whatsappNumber)}?text=${encodeURIComponent(text)}`;
};

export const createWhatsappUrl = (whatsappNumber?: string) => {
  const text = "Hello Siyu Creativity, I would like to enquire.";
  return `https://wa.me/${normalizeWhatsappNumber(whatsappNumber)}?text=${encodeURIComponent(text)}`;
};
