export const weddingConfig = {
  appName: "Save the Sadhya",

  // The public address of the site — used in calendar invites and link previews.
  siteUrl: "https://sdooodly.github.io/saveTheSadhya/",

  couple: {
    partner1: "Gayathri",
    partner2: "Anand",
    photo: "/heroPic.jpg",
    childhoodPhotos: {
      bride: "/gaya-child.png",
      groom: "/anand-child.png",
    },
  },

  // Live photo-booth "GIF" on the main page — hidden while this list is empty.
  // To show it, add pictures to /public/booth and list them here, e.g. "/booth/1.jpg".
  photoBooth: {
    photos: [] as string[],
    secondsPerPhoto: 0.6,
  },

  event: {
    title: "The Wedding & Sadhya",
    date: "2027-01-31",
    // Muhurtham, in Indian time. Used for the calendar invite; keep in sync with muhurthamTime.
    start: "2027-01-31T12:12:00+05:30",
    end: "2027-01-31T12:33:00+05:30",
    muhurthamTime: "12:12 p.m. to 12:33 p.m.",
    venue: "RDR Auditorium",
    address: "Thiruvananthapuram",
    fullAddress: "RDR Auditorium, Edapazhanji, Thiruvananthapuram, Kerala, India",
    mapUrl: "https://www.google.com/maps/search/RDR+Auditorium+Edapazhanji+Thiruvananthapuram",
  },

  rsvp: {
    maxPlusOnes: 3,
    deadline: "2027-01-01",
  },

  meta: {
    title: "Save the Sadhya",
    description:
      "You are cordially invited to celebrate the wedding of Gayathri & Anand.",
    ogImage: "og-invite.jpg", // link-preview card (WhatsApp etc.), 1200×630 in /public
  },
} as const;

export type WeddingConfig = typeof weddingConfig;
