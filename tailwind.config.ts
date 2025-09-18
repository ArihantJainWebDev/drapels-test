import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Base colors
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        
        // Primary brand color (Soft Blue #2563eb)
        primary: {
          DEFAULT: "#2563eb",              // Soft blue
          foreground: "#ffffff",           // White text
          dark: "#1d4ed8",                // Deeper blue for hover
          light: "#dbeafe",               // Light blue tint
          50: "#eff6ff",                  // Almost white blue
          100: "#dbeafe",                 // Very light blue
          200: "#bfdbfe",                 // Light blue
          300: "#93c5fd",                 // Medium light blue
          400: "#60a5fa",                 // Medium blue
          500: "#2563eb",                 // Default blue
          600: "#1d4ed8",                 // Rich blue
          700: "#1e40af",                 // Deep blue
          800: "#1e3a8a",                 // Very dark blue
          900: "#1e293b",                 // Charcoal (almost black blue)
        },
        
        // Secondary color (Dark Mustard #b45309)
        secondary: {
          DEFAULT: "#b45309",             // Dark mustard
          foreground: "#ffffff",          // White text
          dark: "#92400e",               // Deeper mustard
          light: "#fef3c7",              // Light mustard
          50: "#fffbeb",                 // Almost white mustard
          100: "#fef3c7",                // Very light mustard
          200: "#fde68a",                // Light mustard
          300: "#fcd34d",                // Medium light mustard
          400: "#fbbf24",                // Medium mustard
          500: "#f59e0b",                // Rich mustard
          600: "#d97706",                // Deep mustard
          700: "#b45309",                // Default dark mustard
          800: "#92400e",                // Very dark mustard
          900: "#78350f",                // Almost black mustard
        },
        
        // Accent color (Charcoal #1e293b)
        accent: {
          DEFAULT: "#1e293b",             // Charcoal
          foreground: "#ffffff",          // White text
          dark: "#0f172a",               // Deeper charcoal
          light: "#f1f5f9",              // Light gray
          50: "#f8fafc",                 // Almost white
          100: "#f1f5f9",                // Very light gray
          200: "#e2e8f0",                // Light gray
          300: "#cbd5e1",                // Medium light gray
          400: "#94a3b8",                // Medium gray
          500: "#64748b",                // Rich gray
          600: "#475569",                // Deep gray
          700: "#334155",                // Darker gray
          800: "#1e293b",                // Default charcoal
          900: "#0f172a",                // Almost black
        },
        
        // Neutral colors (Warm grays with beige undertones)
        gray: {
          50: "hsl(30, 25%, 98%)",        // Warm off-white
          100: "hsl(30, 20%, 96%)",       // Very light warm gray
          200: "hsl(30, 15%, 92%)",       // Light warm gray
          300: "hsl(30, 12%, 86%)",       // Medium light warm gray
          400: "hsl(30, 10%, 68%)",       // Medium warm gray
          500: "hsl(30, 8%, 52%)",        // Medium warm gray
          600: "hsl(30, 10%, 38%)",       // Dark warm gray
          700: "hsl(30, 15%, 28%)",       // Very dark warm gray
          800: "hsl(30, 20%, 18%)",       // Almost black warm gray
          900: "hsl(30, 25%, 12%)",       // Rich black with warm undertones
        },
        
        // Brown shades for text and accents
        brown: {
          50: "hsl(25, 30%, 96%)",        // Very light brown
          100: "hsl(25, 25%, 92%)",       // Light brown
          200: "hsl(25, 22%, 85%)",       // Medium light brown
          300: "hsl(25, 20%, 75%)",       // Medium brown
          400: "hsl(25, 18%, 62%)",       // Medium dark brown
          500: "hsl(25, 20%, 48%)",       // Rich brown
          600: "hsl(25, 22%, 35%)",       // Dark brown
          700: "hsl(25, 25%, 25%)",       // Very dark brown
          800: "hsl(25, 28%, 18%)",       // Almost black brown
          900: "hsl(25, 30%, 12%)",       // Rich black brown
        },
        
        // Semantic colors (warm variants)
        success: {
          DEFAULT: "hsl(85, 60%, 55%)",   // Warm sage green
          foreground: "hsl(0, 0%, 100%)",
          light: "hsl(85, 60%, 95%)",     // Light sage for backgrounds
        },
        warning: {
          DEFAULT: "hsl(35, 91%, 65%)",   // Using primary amber
          foreground: "hsl(25, 20%, 20%)",
          light: "hsl(35, 91%, 96%)",     // Light amber for backgrounds
        },
        error: {
          DEFAULT: "hsl(5, 75%, 65%)",    // Soft coral red
          foreground: "hsl(0, 0%, 100%)",
          light: "hsl(5, 75%, 95%)",      // Light coral red for backgrounds
        },
        info: {
          DEFAULT: "hsl(200, 70%, 70%)",  // Soft blue-gray
          foreground: "hsl(0, 0%, 100%)",
          light: "hsl(200, 70%, 95%)",    // Light blue for backgrounds
        },
        
        // UI elements
        card: {
          DEFAULT: "hsl(30, 25%, 98%)",
          foreground: "hsl(25, 25%, 15%)",
        },
        popover: {
          DEFAULT: "hsl(30, 25%, 98%)",
          foreground: "hsl(25, 25%, 15%)",
        },
        muted: {
          DEFAULT: "hsl(30, 20%, 96%)",
          foreground: "hsl(25, 15%, 45%)",
        },
        
        // Dark mode overrides (warm dark theme)
        dark: {
          background: "hsl(25, 30%, 8%)",
          foreground: "hsl(30, 25%, 92%)",
          card: "hsl(25, 30%, 10%)",
          'card-foreground': "hsl(30, 25%, 92%)",
          popover: "hsl(25, 30%, 10%)",
          'popover-foreground': "hsl(30, 25%, 92%)",
          primary: "hsl(35, 91%, 75%)",
          'primary-foreground': "hsl(25, 30%, 8%)",
          secondary: "hsl(25, 25%, 15%)",
          'secondary-foreground': "hsl(30, 25%, 92%)",
          muted: "hsl(25, 25%, 15%)",
          'muted-foreground': "hsl(30, 20%, 65%)",
          accent: "hsl(25, 25%, 15%)",
          'accent-foreground': "hsl(30, 25%, 92%)",
          border: "hsl(25, 25%, 18%)",
          input: "hsl(25, 25%, 18%)",
          ring: "hsl(35, 91%, 75%)",
        },
        
        // Sidebar specific colors
        sidebar: {
          DEFAULT: "hsl(30, 25%, 98%)",
          foreground: "hsl(25, 25%, 15%)",
          primary: "hsl(35, 91%, 65%)",
          'primary-foreground': "hsl(25, 20%, 20%)",
          accent: "hsl(45, 86%, 83%)",
          'accent-foreground': "hsl(25, 20%, 20%)",
          border: "hsl(30, 15%, 92%)",
          ring: "hsl(35, 91%, 65%)",
        },
      },
      animation: {
        blob: "blob 7s infinite",
        "fade-in": "fadeIn 0.8s ease-out",
        "slide-up": "slideUp 0.8s ease-out 0.2s both",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gentle-bounce": "gentleBounce 2s ease-in-out infinite",
        "warm-glow": "warmGlow 3s ease-in-out infinite",
        "soft-pulse": "softPulse 2s ease-in-out infinite",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        fadeIn: {
          from: {
            opacity: "0",
            transform: "translateY(20px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        slideUp: {
          from: {
            opacity: "0",
            transform: "translateY(30px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        gentleBounce: {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-5px)",
          },
        },
        warmGlow: {
          "0%, 100%": {
            boxShadow: "0 0 20px hsl(35, 91%, 65%, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 30px hsl(35, 91%, 65%, 0.5)",
          },
        },
        softPulse: {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.8",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        'gradient-warm': 'linear-gradient(135deg, hsl(35, 91%, 75%) 0%, hsl(45, 86%, 83%) 50%, hsl(15, 80%, 85%) 100%)',
        'gradient-sunset': 'linear-gradient(135deg, hsl(35, 91%, 65%) 0%, hsl(25, 85%, 70%) 50%, hsl(15, 80%, 75%) 100%)',
        'gradient-gentle': 'linear-gradient(135deg, hsl(45, 86%, 95%) 0%, hsl(35, 91%, 92%) 50%, hsl(30, 25%, 98%) 100%)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;