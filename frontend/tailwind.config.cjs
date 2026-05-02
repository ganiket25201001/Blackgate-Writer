module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        panel: 'var(--panel)',
        accent: 'var(--accent)',
        muted: 'var(--muted)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)'
      }
    }
  },
  plugins: [],
}
