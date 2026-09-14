export const weddingConfig = {
  appName: "Save The Sadhya",

  couple: {
    partner1: "Gayathri",
    partner2: "Anand",
    photo: "/couple.jpg",
  },

  event: {
    title: "The Wedding & Sadhya",
    date: "2027-01-31",
    time: "8:00 AM – 1:00 PM",
    muhurthamTime: "9:00 AM – 10:15 AM",
    venue: "RDR Auditorium",
    address: "Trivandrum, Kerala",
    mapUrl: "https://www.google.com/maps/search/RDR+Auditorium+Trivandrum+Kerala",
  },

  dressCode: {
    groomSideNote: "Red & Maroon shades",
    brideSideNote: "Blue & Green shades",
  },

  rsvp: {
    maxPlusOnes: 3,
    deadline: "2027-01-15",
  },

  theme: {
    palette: {
      primary: "#2D6A6A",
      secondary: "#EDE8DF",
      accent: "#B8860B",
      dark: "#1E2F2F",
      cream: "#F7F5F0",
      muted: "#7A8078",
      groomRed: "#B5403A",
      brideTeal: "#3A7D7B",
    },
  },

  meta: {
    title: "Save The Sadhya",
    description:
      "You are cordially invited to celebrate the wedding of Gayathri & Anand.",
    ogImage: "/og-image.png",
  },
} as const;

export type WeddingConfig = typeof weddingConfig;
