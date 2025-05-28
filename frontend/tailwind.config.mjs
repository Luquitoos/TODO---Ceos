/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': "var(--background)",
        'foreground': "var(--foreground)",
        'accent': "#69B8A5",
        'input-bg': "#D3E7D1",
        'button-bg': "#A0CBBF",
        'button-text': "var(--background)",
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'Arial', 'Helvetica', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      }
    },
  },
  plugins: [],
};