/** @type {import('tailwindcss').Config} */
export default {
  content: [
      "./index.html",
      "./src/**/*.{ts,js}",
  ],
  theme: {
    extend: {
      colors: {
        "vl-black": {
          500: "#333332",
          600: "#858584",
          700: "#707070",
        },
        "vl-primary": {
          300: "rgba(255,230,21,0.3)",
          500: "#ffe615",
          600: "#fff073",
          700: "#ffee5b",
        },

        "vl-white": "#fff",
        "vl-outline": "rgba(0,85,204,.65)",

        "vl-bluey-gray": "#687483",
        "vl-heather": "#8695a8",
        "vl-mischka": "#cfd5dd",
        "vl-link-water": "#cbd2d9",
        "vl-white-lilac": "#f7f9fc",
        "vl-regent-gray": "#8695a8",
        "vl-pale-sky": "#6a7686",
        "vl-mine-shaft": "#333332",
        "vl-dove-gray": "#666",
        "vl-ghost": "#cbd2da",
        "vl-athens-gray": "#e8ebee",
        "vl-athens-gray-light": "#f1f2f4",
        "vl-friar-gray": "#80807d",
        "vl-cararra": "#e5e5e1",
        "vl-porcelain": "#f3f5f6",
        "vl-geyser": "#d3d9e0",
        "vl-silver-chalice": "#b2b2b2",
        "vl-gray": "#8c8c8c",
        "vl-ship-gray": "#3b3b3c",
        "vl-loblolly": "#c6cdd3",
        "vl-storm-dust": "#5f6364",

        // ================================
        // Green shades
        // ================================
        "vl-ocean-green": "#007a37",
        "vl-chateau-green": "#009e47",
        "vl-napier-green": "#238000",
        "vl-rum-swizzle": "#f7fae5",

        // ================================
        // Yellow shades
        // ================================
        "vl-amber": "#ffc515",
        "vl-orange-peel": "#ffA10a",
        "vl-persimmon": "#d07b06",
        "vl-mango-tango": "#9f5804",
        "vl-yellow": "#ffe615",
        "vl-off-yellow": "#fef9e5",
        "vl-school-bus-yellow": "#fedd00",

        // ================================
        // Blue shades
        // ================================
        "vl-science-blue": "#05c",
        "vl-dark-sky-blue": "#5990de",
        "vl-cornflower-blue": "#a1beec",
        "vl-curious-blue": "#003bb0",
        "vl-endeavour": "darken(#05c, 10%)",
        "vl-regal-blue": "#003a72",
        "vl-blue-bayoux": "#687483",
        "vl-allports": "#00789b",
        "vl-perano": "#b3cff5",

        // ================================
        // Brown shades
        // ================================
        "vl-brown": "#966729",
        "vl-french-beige": "#a67f59",
        "vl-bon-jour": "#e0d7d1",

        // ================================
        // Red shades
        // ================================
        "vl-punch": "#db3434",
        "vl-valencia-red": "#aa2729",
        "vl-faded-red": "#d2373c",

        // ================================
        // State colors
        // ================================
        "vl-limeade": "#8bae00",
        "vl-pink": "#d53e5e",
        "vl-purple": "#660599",

        // ================================
        // Sharing colors
        // ================================
        "vl-facebook-color": "#36609f",
        "vl-twitter-color": "#2caae1",
        "vl-linkedin-color": "#0a6c9b",
        "vl-googleplus-color": "#dc5442",
      },
    },
  },
  plugins: [],
}

