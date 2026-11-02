import daisyui from 'daisyui'

// flat, low-radius themes. "paper" is the light one, "ink" the dark one
const shared = {
  '--rounded-box': '0.3rem',
  '--rounded-btn': '0.25rem',
  '--rounded-badge': '0.2rem',
  '--animation-btn': '0s',
  '--animation-input': '0s',
  '--btn-focus-scale': '1',
  '--border-btn': '1px',
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    logs: false,
    themes: [
      {
        paper: {
          ...shared,
          primary: '#2f6f4e',
          'primary-content': '#ffffff',
          secondary: '#8a6d3b',
          accent: '#2f6f4e',
          neutral: '#2a2825',
          'neutral-content': '#f3f1ec',
          'base-100': '#fbfaf7',
          'base-200': '#f2f0ea',
          'base-300': '#dedbd1',
          'base-content': '#25231f',
          info: '#2f5f8f',
          success: '#2f6f4e',
          warning: '#a9741b',
          error: '#b23b34',
        },
        ink: {
          ...shared,
          primary: '#7fc29b',
          'primary-content': '#0f1a14',
          secondary: '#d1b172',
          accent: '#7fc29b',
          neutral: '#2a2c30',
          'neutral-content': '#e6e4de',
          'base-100': '#171819',
          'base-200': '#1e1f21',
          'base-300': '#2f3135',
          'base-content': '#e6e4de',
          info: '#7aa7d6',
          success: '#7fc29b',
          warning: '#d9a441',
          error: '#e07a72',
        },
      },
    ],
  },
}
