export const weddingConfig = {
  appName: "Save the Sadhya",

  // The public address of the site — used in calendar invites and link previews.
  siteUrl: "https://sdooodly.github.io/saveTheSadhya/",

  couple: {
    partner1: "Gayathri",
    partner2: "Anand",
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
    start: "2027-01-31T11:30:00+05:30",
    end: "2027-01-31T13:00:00+05:30",
    muhurthamTime: "11:30 a.m. to 1:00 p.m.",
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
    title: "Gayathri & Anand’s wedding", // browser tab + WhatsApp preview title
    description:
      "You are cordially invited to celebrate the wedding of Gayathri & Anand.",
    ogImage: "og-invite.jpg", // link-preview card (WhatsApp etc.), 1200×630 in /public
  },
} as const;

export type WeddingConfig = typeof weddingConfig;
