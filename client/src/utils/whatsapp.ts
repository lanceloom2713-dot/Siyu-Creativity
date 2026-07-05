import { WHATSAPP_NUMBER } from "../constants/catalogue";

export const createProductWhatsappUrl = (productName: string) => {
  const text = `Hello Siyu Creativity, I am interested in ${productName}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
};
