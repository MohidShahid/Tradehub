/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    fontFamily: {
      Roboto: ["Roboto", "sans-serif"],
      Poppins: ["Poppins", "sans-serif"],
      Inter: ["Inter", "sans-serif"],
    },
    extend: {
      screens: {
        "400px": "400px",
        "800px": "800px",
        "1000px": "1050px",
        "1100px": "1110px",
        "1300px": "1300px",
      },
      colors: {
        // ========== PRIMARY COLORS ==========
        primary: {
          DEFAULT: "#14532D",      // Dark Forest Green - Main brand color (logo, headings)
          hover: "#166534",        // Slightly lighter green - for hover effects
        },

        // ========== ACCENT COLORS ==========
        accent: {
          DEFAULT: "#F97316",      // Vibrant Orange - Main accent (buttons, CTAs, sale badges)
          hover: "#EA580C",        // Darker Orange - for button hover state
        },

        // ========== BACKGROUND COLORS ==========
        background: {
          DEFAULT: "#FFFFFF",      // Pure White - Main page background
          secondary: "#F8FAFC",    // Soft Off-White - Used for cards and sections
          tertiary: "#F1F5F9",     // Light Gray - Used for subtle backgrounds
        },

        // ========== TEXT COLORS ==========
        text: {
          DEFAULT: "#0F172A",      // Almost Black - Main body text
          secondary: "#64748B",    // Medium Gray - Secondary text (descriptions, labels)
          muted: "#94A3B8",        // Light Gray - Placeholder text, less important text
        },

        // ========== BORDER COLORS ==========
        border: {
          DEFAULT: "#E2E8F0",      // Light Border - Default card and input borders
          dark: "#CBD5E1",         // Slightly darker border - for stronger separation
        },

        // ========== SEMANTIC / STATUS COLORS ==========
        success: "#16A34A",        // Green - Success messages, in-stock, ratings
        danger: "#EF4444",         // Red - Error messages, delete buttons
        star: "#FBBF24",           // Yellow/Gold - Star ratings
      },
    },
  },
  plugins: [],
};