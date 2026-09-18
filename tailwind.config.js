/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./templates/**/*.html",
    "./static/js/**/*.js",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        sm: '1.5rem',
        md: '2rem',
        lg: '2.5rem',
        xl: '3rem',
        '2xl': '3.5rem',
      },
    },
    extend: {
      colors: {
        'pv-navy-dark': '#0B1F3A',
        'pv-navy': '#14335C',
        'pv-blue': '#1E5FA8',
        'pv-blue-bright': '#2E86DE',
        'pv-accent-red': '#E63946',
        'pv-offwhite': '#F4F7FB',
        'pv-yellow': '#FFD24C',
        'pv-gray-text': '#4B5563',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'marquee': 'marquee 30s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      boxShadow: {
        'glow-blue': '0 0 40px 10px rgba(30,95,168,0.25)',
        'glow-red': '0 0 20px 5px rgba(230,57,70,0.3)',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse at 60% 50%, #1E5FA8 0%, #0B1F3A 60%)',
        'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
      },
    },
  },
  plugins: [],
}
