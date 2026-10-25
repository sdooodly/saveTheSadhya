export const weddingConfig = {
  appName: "Save the Sadhya",

  couple: {
    partner1: "Gayathri",
    partner2: "Anand",
    photo: "/heroPic.jpg",
    childhoodPhotos: {
      bride: "/gaya.png",
      groom: "/ana.png",
    },
  },

  // Live photo-booth "GIF" on the main page.
  // Swap these placeholders for real pictures in /public/booth (e.g. "/booth/1.jpg").
  photoBooth: {
    photos: [
      "/booth/booth-1.svg",
      "/booth/booth-2.svg",
      "/booth/booth-3.svg",
      "/booth/booth-4.svg",
    ],
    secondsPerPhoto: 0.6,
  },

  event: {
    title: "The Wedding & Sadhya",
    date: "2027-01-31",
    muhurthamTime: "11:30 AM – 1:00 PM",
    venue: "RDR Auditorium",
    address: "Trivandrum, Kerala",
    mapUrl: "https://www.google.com/maps/search/RDR+Auditorium+Trivandrum+Kerala",
  },

  rsvp: {
    maxPlusOnes: 3,
    deadline: "2027-01-15",
  },

  meta: {
    title: "Save the Sadhya",
    description:
      "You are cordially invited to celebrate the wedding of Gayathri & Anand.",
    ogImage: "/og-image.png",
  },
} as const;

export type WeddingConfig = typeof weddingConfig;
