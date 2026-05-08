import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Anek Bangla','Noto Sans Bengali' , 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Anek Bangla', 'Noto Sans Bengali', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Display headings - larger than normal
        'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.015em', fontWeight: '700' }],
        'display-md': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '700' }],
        'display-sm': ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '700' }],

        // Headings
        'heading-2xl': ['2.25rem', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '700' }],
        'heading-xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.008em', fontWeight: '700' }],
        'heading-lg': ['1.5rem', { lineHeight: '1.35', letterSpacing: '-0.005em', fontWeight: '600' }],
        'heading-md': ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.003em', fontWeight: '600' }],
        'heading-sm': ['1.125rem', { lineHeight: '1.45', letterSpacing: '0', fontWeight: '600' }],
        'heading-xs': ['1rem', { lineHeight: '1.5', letterSpacing: '0.005em', fontWeight: '600' }],

        // Body text
        'body-xl': ['1.25rem', { lineHeight: '1.6', letterSpacing: '0.003em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '0.002em' }],
        'body-md': ['1rem', { lineHeight: '1.6', letterSpacing: '0.001em' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.005em' }],
        'body-xs': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.01em' }],

        // Labels and captions
        'label-lg': ['0.875rem', { lineHeight: '1.4', letterSpacing: '0.01em', fontWeight: '600' }],
        'label-md': ['0.813rem', { lineHeight: '1.4', letterSpacing: '0.01em', fontWeight: '500' }],
        'label-sm': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.015em', fontWeight: '500' }],
        'label-xs': ['0.688rem', { lineHeight: '1.35', letterSpacing: '0.02em', fontWeight: '500' }],
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },
      lineHeight: {
        'tight': '1.15',
        'snug': '1.25',
        'normal': '1.5',
        'relaxed': '1.625',
        'loose': '1.75',
      },
    },
  },
  plugins: [],
};

export default config;
