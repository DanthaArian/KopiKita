import {
  Armchair,
  BadgeCheck,
  CheckCircle2,
  Clock,
  Coffee,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Menu as MenuIcon,
  MessageCircle,
  Navigation,
  PhoneCall,
  Send,
  ShoppingBag,
  Star,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";

const whatsappBase =
  "https://wa.me/6281234567890?text=Halo%20KopiKita%2C%20saya%20mau%20pesan%20kopi";

const fullWhatsappTemplate = `Halo KopiKita, saya mau pesan:
- Nama menu:
- Jumlah:
- Dine-in / takeaway:
- Nama:
Terima kasih.`;

const navItems = [
  { label: "Beranda", href: "#beranda" },
  { label: "Tentang", href: "#tentang" },
  { label: "Menu", href: "#menu" },
  { label: "Galeri", href: "#galeri" },
  { label: "Testimoni", href: "#testimoni" },
  { label: "Lokasi", href: "#lokasi" },
];

const highlights = [
  {
    icon: Coffee,
    title: "Biji kopi pilihan",
    text: "Dipilih dari roaster lokal dengan profil rasa yang cocok untuk kopi harian.",
  },
  {
    icon: Wallet,
    title: "Harga ramah mahasiswa",
    text: "Mulai dari Rp15 ribuan, tetap enak tanpa bikin dompet tegang.",
  },
  {
    icon: Armchair,
    title: "Nyaman untuk ngobrol & kerja",
    text: "Tempat singgah yang santai buat nugas, meeting ringan, atau rehat sebentar.",
  },
];

const menuItems = [
  {
    name: "Kopi Susu Kita",
    price: "Rp18.000",
    description:
      "Espresso, susu segar, dan gula aren dengan rasa creamy yang seimbang.",
    badge: "Best Seller",
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Iced Americano",
    price: "Rp15.000",
    description:
      "Kopi hitam dingin yang clean, bold, dan cocok untuk teman produktif.",
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Caramel Latte",
    price: "Rp22.000",
    description:
      "Latte lembut dengan sentuhan caramel manis yang nyaman di lidah.",
    image:
      "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Matcha Coffee Fusion",
    price: "Rp24.000",
    description:
      "Perpaduan matcha creamy dan espresso untuk rasa unik yang nagih.",
    image:
      "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Vanilla Latte",
    price: "Rp21.000",
    description:
      "Espresso dengan susu lembut dan aroma vanilla yang manis ringan.",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Es Kopi Aren",
    price: "Rp19.000",
    description:
      "Kopi susu gula aren khas KopiKita, manisnya pas dan tidak berlebihan.",
    badge: "Best Seller",
    image: "/assets/kopikita-hero.png",
  },
  {
    name: "Cappuccino Hot",
    price: "Rp20.000",
    description:
      "Espresso, steamed milk, dan foam lembut untuk pecinta kopi klasik.",
    image:
      "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Chocolate Coffee",
    price: "Rp23.000",
    description:
      "Cokelat creamy berpadu espresso, cocok buat yang suka rasa manis bold.",
    image:
      "https://images.unsplash.com/photo-1579888944880-d98341245702?auto=format&fit=crop&w=900&q=85",
  },
];

const benefits = [
  {
    icon: BadgeCheck,
    title: "Rasa konsisten",
    text: "Racikan dibuat dengan takaran yang pas supaya rasanya tetap enak setiap kali kamu pesan.",
  },
  {
    icon: Wallet,
    title: "Harga ramah",
    text: "Cocok untuk mahasiswa, pekerja, dan siapa pun yang ingin ngopi tanpa bikin dompet kaget.",
  },
  {
    icon: Armchair,
    title: "Tempat nyaman",
    text: "Suasana hangat, cocok untuk ngobrol, kerja ringan, atau menikmati waktu sendiri.",
  },
  {
    icon: MessageCircle,
    title: "Order mudah",
    text: "Mau datang langsung atau pesan dulu lewat WhatsApp, semuanya dibuat praktis.",
  },
];

const galleryItems = [
  {
    title: "Interior kedai dengan lighting warm",
    image:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=85",
    tall: true,
  },
  {
    title: "Barista membuat kopi",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Close-up iced coffee",
    image: "/assets/kopikita-hero.png",
  },
  {
    title: "Meja kerja dengan laptop dan kopi",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Teman-teman ngobrol di kedai",
    image:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=85",
    tall: true,
  },
  {
    title: "Detail biji kopi dan espresso",
    image:
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=85",
  },
];

const testimonials = [
  {
    name: "Raka",
    role: "Mahasiswa",
    quote:
      "Kopi Susu Kita jadi penyelamat pas nugas. Rasanya enak, harganya masih aman buat kantong mahasiswa.",
  },
  {
    name: "Dinda",
    role: "Content Creator",
    quote:
      "Tempatnya nyaman banget buat kerja sebentar. Lighting-nya juga bagus buat foto kopi.",
  },
  {
    name: "Bagas",
    role: "Karyawan",
    quote:
      "Biasanya order dulu via WhatsApp sebelum pulang kantor. Sampai kedai tinggal ambil, praktis banget.",
  },
  {
    name: "Naya",
    role: "Coffee Lover",
    quote:
      "Es Kopi Aren-nya creamy tapi nggak terlalu manis. Salah satu kopi susu lokal favoritku.",
  },
];

function orderLink(menuName) {
  if (!menuName) return whatsappBase;

  const message = `Halo KopiKita, saya mau pesan kopi
- Nama menu: ${menuName}
- Jumlah:
- Dine-in / takeaway:
- Nama:
Terima kasih.`;

  return `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
}

function SectionHeader({ eyebrow, title, description, align = "left" }) {
  return (
    <div
      className={`mx-auto max-w-3xl ${
        align === "center" ? "text-center" : "text-left"
      }`}
    >
      {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
      <h2 className="section-title">{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </div>
  );
}

function ButtonLink({
  children,
  href = whatsappBase,
  variant = "primary",
  className = "",
  ...props
}) {
  const variantClass = variant === "secondary" ? "btn-secondary" : "btn-primary";

  return (
    <a className={`btn ${variantClass} ${className}`} href={href} {...props}>
      {children}
    </a>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-espresso/10 bg-softBeige/95 backdrop-blur-xl">
      <nav className="container-page flex h-20 items-center justify-between gap-4">
        <a
          className="flex items-center gap-3 text-espresso"
          href="#beranda"
          aria-label="KopiKita beranda"
          onClick={() => setOpen(false)}
        >
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-coffee text-cream shadow-soft">
            <Coffee aria-hidden="true" size={24} />
          </span>
          <span>
            <span className="block font-display text-xl font-extrabold leading-none">
              KopiKita
            </span>
            <span className="mt-1 block text-xs font-semibold text-coffee/70">
              Coffee shop lokal
            </span>
          </span>
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <a className="nav-link" href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <span className="hidden text-xs font-semibold text-coffee/65 xl:inline">
            Pesan dulu, ambil nanti.
          </span>
          <ButtonLink className="shadow-caramel" href={whatsappBase}>
            <MessageCircle aria-hidden="true" size={18} />
            Order WhatsApp
          </ButtonLink>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ButtonLink
            aria-label="Order KopiKita via WhatsApp"
            className="px-3"
            href={whatsappBase}
          >
            <MessageCircle aria-hidden="true" size={18} />
          </ButtonLink>
          <button
            aria-expanded={open}
            aria-label={open ? "Tutup menu" : "Buka menu"}
            className="icon-button"
            onClick={() => setOpen((value) => !value)}
            type="button"
          >
            {open ? <X size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-espresso/10 bg-softBeige px-5 py-4 shadow-soft md:hidden">
          <div className="mx-auto grid max-w-md gap-2">
            {navItems.map((item) => (
              <a
                className="rounded-md px-4 py-3 text-sm font-bold text-coffee transition hover:bg-cream"
                href={item.href}
                key={item.href}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-cream pt-20" id="beranda">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,rgba(201,133,66,0.20),transparent_34%),linear-gradient(135deg,#fff8ef_0%,#f7e8d0_100%)]" />
      <div className="container-page grid items-center gap-10 pb-14 pt-10 sm:pt-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:pb-16 lg:pt-14">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-md border border-caramel/30 bg-softBeige px-3 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-coffee">
            <Heart aria-hidden="true" size={15} />
            Kopi Enak, Teman Cerita Setiap Hari.
          </p>
          <h1 className="mt-6 max-w-full font-display text-3xl font-extrabold leading-tight text-espresso sm:text-5xl lg:text-6xl">
            Nikmati Kopi Enak yang Selalu Dekat dengan Ceritamu
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-coffee/80 sm:text-lg">
            Dari pagi produktif sampai malam penuh obrolan, KopiKita hadir
            dengan racikan kopi lokal yang nikmat, harga bersahabat, dan
            suasana kedai yang bikin betah.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink className="w-full sm:w-auto" href={whatsappBase}>
              <MessageCircle aria-hidden="true" size={19} />
              Order via WhatsApp
            </ButtonLink>
            <ButtonLink className="w-full sm:w-auto" href="#menu" variant="secondary">
              <ShoppingBag aria-hidden="true" size={19} />
              Lihat Menu
            </ButtonLink>
          </div>

          <p className="mt-5 flex items-start gap-2 text-sm font-semibold leading-6 text-coffee/70">
            <CheckCircle2
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-caramel"
              size={18}
            />
            Bisa dine-in, takeaway, atau pesan dulu lewat WhatsApp.
          </p>
        </div>

        <div className="relative">
          <div className="hero-image-card">
            <img
              alt="Iced coffee KopiKita di meja kayu dengan suasana kedai hangat"
              className="h-full w-full object-cover"
              src="/assets/kopikita-hero.png"
            />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3 rounded-lg bg-softBeige/95 p-4 shadow-soft backdrop-blur">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-caramel">
                  Rating Kedai
                </p>
                <p className="mt-1 font-display text-xl font-extrabold text-espresso">
                  4.8/5
                </p>
                <p className="text-xs font-semibold text-coffee/70">
                  dari pelanggan lokal
                </p>
              </div>
              <div className="flex text-caramel" aria-label="Rating 5 bintang">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    aria-hidden="true"
                    fill="currentColor"
                    key={index}
                    size={18}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="absolute -right-3 top-7 hidden rounded-lg bg-espresso px-4 py-3 text-cream shadow-soft sm:block">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-caramel">
              Mulai dari
            </p>
            <p className="font-display text-2xl font-extrabold">Rp15 ribuan</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="section bg-softBeige" id="tentang">
      <div className="container-page grid items-center gap-10 lg:grid-cols-[0.94fr_1.06fr]">
        <div className="relative order-2 lg:order-1">
          <img
            alt="Barista membuat kopi di coffee shop lokal"
            className="h-[420px] w-full rounded-lg object-cover shadow-soft"
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85"
          />
          <div className="absolute -bottom-5 left-5 right-5 rounded-lg border border-caramel/20 bg-cream p-5 shadow-soft sm:left-auto sm:w-72">
            <p className="text-sm font-bold text-coffee">
              Setiap gelas dibuat fresh saat kamu pesan.
            </p>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <SectionHeader
            eyebrow="Tentang KopiKita"
            title="Kopi Lokal, Rasa Akrab, Harga Bersahabat"
            description="KopiKita dibuat untuk kamu yang butuh tempat nyaman buat mulai hari, nugas, kerja sebentar, atau sekadar ngobrol santai. Kami percaya kopi yang enak tidak harus ribet dan mahal. Cukup dibuat dengan bahan berkualitas, racikan pas, dan disajikan dengan hati."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {highlights.map((item) => (
              <SmallHighlight key={item.title} {...item} />
            ))}
          </div>
          <ButtonLink className="mt-8" href="#lokasi" variant="secondary">
            <Users aria-hidden="true" size={19} />
            Kenalan dengan KopiKita
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

function SmallHighlight({ icon: Icon, title, text }) {
  return (
    <div className="rounded-lg border border-coffee/10 bg-white/70 p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-warm">
      <span className="grid h-11 w-11 place-items-center rounded-lg bg-caramel/15 text-caramel">
        <Icon aria-hidden="true" size={22} />
      </span>
      <h3 className="mt-4 font-display text-base font-extrabold text-espresso">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-coffee/70">{text}</p>
    </div>
  );
}

function MenuSection() {
  return (
    <section className="section bg-cream" id="menu">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeader
            eyebrow="Menu Favorit"
            title="Menu Favorit yang Wajib Kamu Coba"
            description="Dari kopi susu klasik sampai varian manis creamy, pilih minuman favoritmu dan pesan langsung lewat WhatsApp."
          />
          <ButtonLink className="shrink-0" href={whatsappBase}>
            <Send aria-hidden="true" size={19} />
            Pesan Menu Favorit
          </ButtonLink>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 text-sm font-bold text-coffee/70">
          <span className="pill">Harga mulai dari Rp15 ribuan.</span>
          <span className="pill">Klik menu favoritmu, langsung order lewat WhatsApp.</span>
          <span className="pill">Tersedia hot & iced untuk beberapa menu.</span>
        </div>

        <div className="mt-9 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {menuItems.map((item) => (
            <MenuCard item={item} key={item.name} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MenuCard({ item }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-coffee/10 bg-softBeige shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-warm">
      <div className="relative aspect-[4/3] overflow-hidden bg-coffee/10">
        <img
          alt={item.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
          src={item.image}
        />
        {item.badge && (
          <span className="absolute left-3 top-3 rounded-md bg-caramel px-3 py-1 text-xs font-extrabold text-espresso shadow-soft">
            {item.badge}
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-extrabold text-espresso">
            {item.name}
          </h3>
          <p className="rounded-md bg-cream px-2.5 py-1 text-sm font-extrabold text-coffee">
            {item.price}
          </p>
        </div>
        <p className="mt-3 min-h-[72px] text-sm leading-6 text-coffee/75">
          {item.description}
        </p>
        <ButtonLink
          className="mt-5 w-full justify-center"
          href={orderLink(item.name)}
        >
          <MessageCircle aria-hidden="true" size={18} />
          Order
        </ButtonLink>
      </div>
    </article>
  );
}

function PromoSection() {
  return (
    <section className="section bg-softBeige">
      <div className="container-page">
        <div className="overflow-hidden rounded-lg bg-espresso text-cream shadow-warm lg:grid lg:grid-cols-[1fr_0.82fr]">
          <div className="p-7 sm:p-10 lg:p-12">
            <span className="inline-flex items-center gap-2 rounded-md bg-caramel px-3 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-espresso">
              <Clock aria-hidden="true" size={15} />
              Promo Minggu Ini
            </span>
            <h2 className="mt-6 max-w-2xl font-display text-3xl font-extrabold leading-tight sm:text-4xl">
              Promo Hemat Buat Teman Ngopi Bareng
            </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-cream/80">
              Bawa temanmu dan nikmati paket kopi favorit dengan harga lebih
              hemat. Cocok untuk nugas, meeting santai, atau sekadar ngobrol
              sore.
            </p>
            <div className="mt-7 rounded-lg border border-cream/15 bg-cream/10 p-5">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-caramel">
                Paket Berdua
              </p>
              <p className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">
                2 Kopi Susu Kita hanya Rp34.000
              </p>
              <p className="mt-2 text-sm font-semibold text-cream/70">
                Promo berlaku selama persediaan masih ada.
              </p>
            </div>
            <ButtonLink className="mt-7" href={whatsappBase}>
              <MessageCircle aria-hidden="true" size={19} />
              Klaim Promo via WhatsApp
            </ButtonLink>
          </div>

          <div className="relative min-h-80">
            <img
              alt="Dua gelas kopi di meja untuk promo berdua"
              className="h-full min-h-80 w-full object-cover"
              loading="lazy"
              src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1200&q=85"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section className="section bg-cream">
      <div className="container-page">
        <SectionHeader
          align="center"
          eyebrow="Kenapa KopiKita"
          title="Kenapa Banyak yang Balik Lagi ke KopiKita?"
          description="Bukan cuma soal kopi. KopiKita hadir sebagai tempat kecil yang nyaman untuk berbagai cerita, dari deadline tugas sampai obrolan pulang kerja."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {benefits.map((item) => (
            <BenefitCard item={item} key={item.title} />
          ))}
        </div>

        <div className="mt-9 text-center">
          <ButtonLink href={whatsappBase}>
            <Coffee aria-hidden="true" size={19} />
            Coba KopiKita Hari Ini
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

function BenefitCard({ item }) {
  const Icon = item.icon;

  return (
    <article className="rounded-lg border border-coffee/10 bg-softBeige p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-warm">
      <span className="grid h-12 w-12 place-items-center rounded-lg bg-coffee text-cream">
        <Icon aria-hidden="true" size={24} />
      </span>
      <h3 className="mt-5 font-display text-xl font-extrabold text-espresso">
        {item.title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-coffee/75">{item.text}</p>
    </article>
  );
}

function GallerySection() {
  return (
    <section className="section bg-softBeige" id="galeri">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeader
            eyebrow="Galeri Kedai"
            title="Suasana Hangat Buat Cerita yang Panjang"
            description="Duduk sebentar, pesan kopi favorit, dan nikmati suasana kedai yang santai. KopiKita cocok untuk kamu yang ingin rehat dari rutinitas tanpa harus pergi jauh."
          />
          <ButtonLink className="shrink-0" href="#lokasi" variant="secondary">
            <MapPin aria-hidden="true" size={19} />
            Lihat Lokasi Kedai
          </ButtonLink>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item) => (
            <figure
              className={`gallery-card ${item.tall ? "lg:row-span-2" : ""}`}
              key={item.title}
            >
              <img
                alt={item.title}
                className="h-full w-full object-cover transition duration-500 hover:scale-105"
                loading="lazy"
                src={item.image}
              />
              <figcaption>{item.title}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="section bg-cream" id="testimoni">
      <div className="container-page">
        <SectionHeader
          align="center"
          eyebrow="Testimoni"
          title="Kata Mereka Tentang KopiKita"
          description="Pelanggan kami datang untuk kopi, lalu kembali karena suasananya."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {testimonials.map((item) => (
            <TestimonialCard item={item} key={item.name} />
          ))}
        </div>

        <div className="mt-9 text-center">
          <ButtonLink href={whatsappBase}>
            <MessageCircle aria-hidden="true" size={19} />
            Jadi Pelanggan Berikutnya
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ item }) {
  return (
    <article className="rounded-lg border border-coffee/10 bg-softBeige p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-warm">
      <div className="flex items-center gap-4">
        <span className="grid h-12 w-12 place-items-center rounded-lg bg-caramel font-display text-lg font-extrabold text-espresso">
          {item.name.charAt(0)}
        </span>
        <div>
          <h3 className="font-display text-lg font-extrabold text-espresso">
            {item.name}
          </h3>
          <p className="text-sm font-semibold text-coffee/60">{item.role}</p>
        </div>
      </div>
      <div className="mt-5 flex text-caramel" aria-label="Rating 5 bintang">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star aria-hidden="true" fill="currentColor" key={index} size={17} />
        ))}
      </div>
      <p className="mt-4 text-sm leading-7 text-coffee/80">"{item.quote}"</p>
    </article>
  );
}

function LocationSection() {
  return (
    <section className="section bg-softBeige" id="lokasi">
      <div className="container-page grid gap-8 lg:grid-cols-[0.94fr_1.06fr]">
        <div>
          <SectionHeader
            eyebrow="Lokasi & Jam Buka"
            title="Mampir ke KopiKita Hari Ini"
            description="Kami siap jadi tempat singgahmu untuk ngopi, ngobrol, atau sekadar mengambil jeda sebentar dari hari yang padat."
          />

          <div className="mt-8 grid gap-4">
            <InfoRow
              icon={MapPin}
              label="Alamat"
              text="Jl. Melati No. 18, dekat area kampus dan perkantoran, Jakarta Selatan"
            />
            <InfoRow
              icon={Clock}
              label="Jam buka"
              text="Senin-Jumat: 08.00-22.00 | Sabtu-Minggu: 09.00-23.00"
            />
            <InfoRow
              icon={PhoneCall}
              label="Kontak"
              text="WhatsApp 0812-3456-7890"
            />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink
              href="https://www.google.com/maps/search/?api=1&query=Jl.%20Melati%20No.%2018%20Jakarta%20Selatan"
              rel="noreferrer"
              target="_blank"
              variant="secondary"
            >
              <Navigation aria-hidden="true" size={19} />
              Buka Google Maps
            </ButtonLink>
            <ButtonLink href={whatsappBase}>
              <MessageCircle aria-hidden="true" size={19} />
              Order Sebelum Datang
            </ButtonLink>
          </div>

          <p className="mt-5 text-sm font-semibold text-coffee/70">
            Pesan dulu via WhatsApp, ambil saat sudah siap.
          </p>
        </div>

        <div className="map-card">
          <div className="map-grid" />
          <div className="relative z-10 max-w-sm rounded-lg bg-softBeige/95 p-6 shadow-soft">
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-caramel text-espresso">
              <MapPin aria-hidden="true" size={24} />
            </span>
            <h3 className="mt-5 font-display text-2xl font-extrabold text-espresso">
              KopiKita Jakarta Selatan
            </h3>
            <p className="mt-3 text-sm leading-7 text-coffee/75">
              Dekat kampus, mudah diakses, dan nyaman untuk mampir sebelum atau
              sesudah aktivitas.
            </p>
            <div className="mt-5 rounded-lg bg-cream p-4 text-sm font-bold text-coffee">
              Respon cepat saat kedai buka.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoRow({ icon: Icon, label, text }) {
  return (
    <div className="flex gap-4 rounded-lg border border-coffee/10 bg-white/70 p-5 shadow-soft">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-caramel/15 text-caramel">
        <Icon aria-hidden="true" size={22} />
      </span>
      <div>
        <p className="text-sm font-extrabold text-espresso">{label}</p>
        <p className="mt-1 text-sm leading-6 text-coffee/75">{text}</p>
      </div>
    </div>
  );
}

function CtaSection() {
  const templateLink = `https://wa.me/6281234567890?text=${encodeURIComponent(
    fullWhatsappTemplate,
  )}`;

  return (
    <section className="bg-espresso py-16 text-cream">
      <div className="container-page text-center">
        <p className="section-eyebrow text-caramel">Order WhatsApp</p>
        <h2 className="mx-auto max-w-3xl font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
          Sudah Tahu Mau Pesan Apa?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-cream/80">
          Klik tombol di bawah, pilih menu favoritmu, dan tim KopiKita akan
          bantu proses pesananmu lewat WhatsApp.
        </p>
        <ButtonLink className="mt-8" href={templateLink}>
          <MessageCircle aria-hidden="true" size={21} />
          Order Sekarang via WhatsApp
        </ButtonLink>
        <p className="mt-5 text-sm font-semibold text-cream/70">
          Respon cepat saat jam operasional.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#21130d] py-10 text-cream">
      <div className="container-page">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_1fr]">
          <div>
            <a className="inline-flex items-center gap-3" href="#beranda">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-caramel text-espresso">
                <Coffee aria-hidden="true" size={23} />
              </span>
              <span className="font-display text-2xl font-extrabold">
                KopiKita
              </span>
            </a>
            <p className="mt-4 max-w-sm text-sm leading-7 text-cream/70">
              KopiKita - Kopi enak, teman cerita setiap hari.
            </p>
            <p className="mt-4 text-sm font-semibold text-caramel">
              Dibuat dengan hangat untuk pecinta kopi lokal.
            </p>
          </div>

          <div>
            <h3 className="font-display text-lg font-extrabold">Menu</h3>
            <div className="mt-4 grid gap-2">
              {navItems
                .filter((item) => item.label !== "Testimoni")
                .map((item) => (
                  <a
                    className="text-sm font-semibold text-cream/70 transition hover:text-caramel"
                    href={item.href}
                    key={item.href}
                  >
                    {item.label}
                  </a>
                ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg font-extrabold">Kontak</h3>
            <div className="mt-4 grid gap-3 text-sm font-semibold text-cream/70">
              <a
                className="inline-flex items-center gap-2 transition hover:text-caramel"
                href={whatsappBase}
              >
                <MessageCircle aria-hidden="true" size={17} />
                WhatsApp: 0812-3456-7890
              </a>
              <a
                className="inline-flex items-center gap-2 transition hover:text-caramel"
                href="https://www.instagram.com/kopikita.id"
                rel="noreferrer"
                target="_blank"
              >
                <Instagram aria-hidden="true" size={17} />
                Instagram: @kopikita.id
              </a>
              <a
                className="inline-flex items-center gap-2 transition hover:text-caramel"
                href="mailto:halo@kopikita.id"
              >
                <Mail aria-hidden="true" size={17} />
                Email: halo@kopikita.id
              </a>
            </div>
          </div>
        </div>

        <div className="mt-9 border-t border-cream/10 pt-6 text-sm font-semibold text-cream/60">
          © 2026 KopiKita. Semua rasa dibuat dekat dengan keseharianmu.
        </div>
      </div>
    </footer>
  );
}

function StickyWhatsapp() {
  return (
    <a
      aria-label="Order KopiKita via WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-[#25D366] text-white shadow-[0_16px_42px_rgba(37,211,102,0.36)] transition duration-300 hover:-translate-y-1 hover:bg-[#1fb85a] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#25D366]/35 sm:h-auto sm:w-auto sm:px-5 sm:py-4"
      href={whatsappBase}
    >
      <MessageCircle aria-hidden="true" size={24} />
      <span className="ml-2 hidden text-sm font-extrabold sm:inline">
        Order WhatsApp
      </span>
    </a>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-softBeige font-body text-coffee selection:bg-caramel selection:text-espresso">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <MenuSection />
        <PromoSection />
        <BenefitsSection />
        <GallerySection />
        <TestimonialsSection />
        <LocationSection />
        <CtaSection />
      </main>
      <Footer />
      <StickyWhatsapp />
    </div>
  );
}
