# 🍛 Save The Sadhya

A **Wes Anderson–inspired** wedding RSVP web app built with Next.js, Tailwind CSS, and Framer Motion. Designed for a South Indian morning wedding — symmetrical layouts, pastel/earthy tones, retro typography, and frame-within-a-frame styling.

Fork it, update one config file, deploy. That's it.

---

## ✨ Features

| Feature | Toggle |
|---|---|
| Animated countdown timer | `features.enableCountdown` |
| RSVP form with +1 support & meal preferences | always on |
| Guest wishes wall | `features.enableGuestWishes` |
| Song request board | `features.enableSongRequests` |
| Live headcount display | `features.enableLiveHeadcount` |
| Wes Anderson framing & scroll animations | built-in |
| Fully config-driven — zero component edits needed | `wedding.config.ts` |

---

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/your-username/save-the-sadhya.git
cd save-the-sadhya

# 2. Install
npm install

# 3. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## ⚙️ Configuration

Everything lives in **`src/wedding.config.ts`**. You never need to touch any component files.

```ts
export const weddingConfig = {
  appName: "Save The Sadhya",
  couple: {
    partner1: "Groom",
    partner2: "Bride",
  },
  event: {
    title: "The Wedding & Sadhya",
    date: "2027-01-31",
    time: "8:00 AM – 1:00 PM IST",
    muhurthamTime: "9:00 AM – 10:15 AM",
    venue: "RDR Auditorium",
    address: "Trivandrum, Kerala",
    mapUrl: "https://maps.google.com/",
  },
  dressCode: {
    groomSide: "Traditional Kasavu Mundu / Kurta",
    brideSide: "Pastel Sarees / Kanchipuram Silk",
  },
  features: {
    enableCountdown: true,
    enableGuestWishes: true,
    enableSongRequests: true,
    enableLiveHeadcount: true,
  },
  rsvp: {
    mealOptions: ["Traditional Sadhya (Veg)", "Non-Veg Feast", "Jain / No Onion-Garlic"],
    maxPlusOnes: 3,
    deadline: "2027-01-15",
  },
  theme: {
    // ...color palette & fonts
  },
  meta: {
    title: "Save The Sadhya — Wedding Celebration",
    description: "You are cordially invited...",
    ogImage: "/og-image.png",
  },
};
```

### Color Palette

| Token | Hex | Role |
|---|---|---|
| `primary` | `#D96B43` | Terracotta / Warm Clay |
| `secondary` | `#F4EAD4` | Warm Cream |
| `accent` | `#4A7C59` | Sage / Banana Leaf Green |
| `yellow` | `#E8B83D` | Mustard / Marigold |
| `dark` | `#2C1810` | Deep Brown text |
| `cream` | `#FFF8F0` | Page background |
| `muted` | `#8B7355` | Secondary text |

---

## 🗄️ Database Integration

The API routes ship with **in-memory stubs** so you can run the app instantly. To persist data, swap the arrays in the route files with your preferred database:

### Supabase (PostgreSQL)

```bash
npm install @supabase/supabase-js
```

Create tables for `rsvps`, `wishes`, and `song_requests`, then update each route handler in `src/app/api/`.

### Turso (SQLite)

```bash
npm install @libsql/client
```

Point `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` at your Turso database and update the route files.

---

## 🚢 Deployment

### GitHub Pages

This repository is configured to deploy automatically from `main` to GitHub Pages
at `https://sdooodly.github.io/saveTheSadhya/`. Enable Pages in the repository
settings with **GitHub Actions** as the source, then push to `main`.

The GitHub Pages build is a static export. The RSVP form can still be used as a
front-end experience, but the included in-memory route does not persist responses
on a static host. Connect the form to Supabase, Formspree, or another hosted
endpoint before relying on it for guest data.

### Vercel

1. Push to GitHub
2. Import in [vercel.com](https://vercel.com)
3. Deploy — zero config needed

### Netlify

1. Push to GitHub
2. Import in Netlify, set build command to `npm run build` and publish directory to `.next`
3. Deploy

---

## 🛠️ Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** (CSS-first configuration)
- **Framer Motion** (scroll & entrance animations)
- **Lucide React** (icons)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── rsvp/
│   │   │   ├── route.ts        # RSVP submissions
│   │   │   └── count/route.ts  # Headcount endpoint
│   │   ├── wishes/route.ts     # Guest wishes
│   │   └── songs/route.ts      # Song requests
│   ├── globals.css             # Tailwind + Wes Anderson styles
│   ├── layout.tsx              # Root layout with fonts & meta
│   └── page.tsx                # Main page composition
├── components/
│   ├── sections/               # Full-page sections
│   │   ├── HeroSection.tsx
│   │   ├── EventDetailsSection.tsx
│   │   ├── CountdownSection.tsx
│   │   ├── RSVPSection.tsx
│   │   ├── GuestWishesSection.tsx
│   │   ├── SongRequestsSection.tsx
│   │   ├── LiveHeadcountSection.tsx
│   │   └── FooterSection.tsx
│   └── ui/                     # Reusable primitives
│       ├── WesAndersonFrame.tsx
│       ├── SectionHeading.tsx
│       ├── OrnamentalDivider.tsx
│       └── CountdownTimer.tsx
└── wedding.config.ts           # Single source of truth
```

---

## 📝 License

MIT — fork freely, celebrate joyfully.
