export const weddingConfig = {
  appName: "Save the Sadhya",

  couple: {
    partner1: "Gayathri",
    partner2: "Anand",
    photo: "/couple.jpg",
    childhoodPhotos: {
      bride: "/gaya.png",
      groom: "/ana.png",
    },
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
