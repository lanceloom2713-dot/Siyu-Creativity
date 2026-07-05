import { products } from "../constants/catalogue";

export function GalleryPage() {
  const images = products.flatMap((product) => product.gallery.map((src) => ({ src, alt: product.name })));

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl font-semibold">Gallery</h1>
      <div className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3">
        {images.map((item) => (
          <img className="mb-5 rounded-[1.5rem] shadow-soft" src={item.src} alt={item.alt} key={item.src} />
        ))}
      </div>
    </section>
  );
}
