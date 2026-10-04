/** @type {import('tailwindcss').Config} */
const defaultConfig = require("shadcn/ui/tailwind.config")

module.exports = {
  ...defaultConfig,
  darkMode: 'class', // enable dark mode via class
  content: [...defaultConfig.content, "./src/**/*.{js,jsx,ts,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    ...defaultConfig.theme,
    extend: {
      ...defaultConfig.theme.extend,
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        // Primary accent – terracotta
        orange: {
          50: '#FAF0EC',
          100: '#F3DDD4',
          200: '#E8A58A', // Accent soft / light particles
          300: '#DF8B6A',
          400: '#D97757', // Accent base
          500: '#C6613F', // Accent strong (button bg)
          600: '#B5553A', // Accent hover
          700: '#9C4530',
          800: '#7E3525',
          900: '#60271B',
        },
        // Warm charcoal surfaces
        warm: {
          page: '#1F1E1D',
          outer: '#242321',
          panel: '#2A2927',
          header: '#2F2E2B',
          input: '#1F1E1D',
          border: '#3D3B37',
          'border-hover': '#4A4843',
          disabled: '#2F2E2B',
          text: '#FAF9F5',
          muted: '#A8A59B',
          placeholder: '#7A776F',
        },
        // Dark mode neutrals
        black: {
          50: '#FDFDFD',
          100: '#FAFAFA',
          200: '#F5F5F5',
          300: '#EFEFEF',
          400: '#E0E0E0',
          500: '#CCCCCC',
          600: '#B3B3B3',
          700: '#999999',
          800: '#808080',
          900: '#666666',
          950: '#333333',
          980: '#0F0F0F', // Near-black for surfaces
          990: '#0A0A0A',
        },
        // Light mode neutrals (we'll use inverted black palette)
        white: {
          50: '#FFFFFF',
          100: '#FFFFFF',
          200: '#FFFFFF',
          300: '#FFFFFF',
          400: '#F0F0F0',
          500: '#E0E0E0',
          600: '#D0D0D0',
          700: '#B0B0B0',
          800: '#909090',
          900: '#707070',
          950: '#303030',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Instrument Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['var(--font-display)', 'Newsreader', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.6s ease-out",
        float: "float 6s ease-in-out infinite",
        "gradient-x": "gradientX 3s ease infinite",
        "bounce-slow": "bounce 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        gradientX: {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [...defaultConfig.plugins, require("tailwindcss-animate")],
}
