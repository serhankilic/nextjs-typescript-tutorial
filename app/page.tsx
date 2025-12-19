import type { ProductResponse } from "./types";
import Link from "next/link";

async function getListings(): Promise<ProductResponse> {
  const res = await fetch("https://dummyjson.com/products?limit=12", {
    // demo: cache'i kapat (geliştirirken “hep güncel” gör)
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("İlanlar alınamadı (DummyJSON fetch failed).");
  }

  return res.json();
}

export default async function HomePage() {
  const data = await getListings();

  return (
    <main style={{ padding: 24 }}>
      <header style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>İlanlar</h1>
        <p style={{ opacity: 0.7 }}>
          DummyJSON /products ile gelen veriyi “emlak ilanı” gibi listeliyoruz.
        </p>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        {data.products.map((p) => (
          <article
            key={p.id}
            style={{
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {/* Görsel */}
            {/* Next/Image kullanmak istersen ayrıca next.config'te remotePatterns ayarlarsın.
                Şimdilik <img> ile hızlı gidelim. */}
            <img
              src={p.thumbnail}
              alt={p.title}
              style={{ width: "100%", height: 160, objectFit: "cover" }}
              loading="lazy"
            />

            {/* İçerik */}
            <div style={{ padding: 12, display: "grid", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{p.title}</h2>
                <span style={{ fontWeight: 700 }}>{p.price} ₺</span>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", opacity: 0.8 }}>
                <span>🏷 {p.category}</span>
                <span>⭐ {p.rating}</span>
                <span>🏢 {p.brand}</span>
                <span>📐 {p.stock} m²</span>
              </div>

              <p style={{ margin: 0, opacity: 0.75, fontSize: 13 }}>
                {p.description.slice(0, 90)}
                {p.description.length > 90 ? "..." : ""}
              </p>

              {/* Detaya gidiş (detay sayfasını sonra /listing/[id] yaparsın) */}
              <Link
                href={`/listing/${p.id}`}
                style={{
                  marginTop: 6,
                  display: "inline-block",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Detayı gör →
              </Link>
            </div>
          </article>
        ))}
      </section>

      <footer style={{ marginTop: 16, opacity: 0.6 }}>
        Toplam: {data.total} ilan • Gösterilen: {data.products.length}
      </footer>
    </main>
  );
}
