import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{html,js,ts,jsx,tsx,vue,svelte}',
    './templates/**/*.{html,js,ts,jsx,tsx,vue,svelte}',
    './modules/**/*.{html,js,ts,jsx,tsx,vue,svelte}'
  ],
  theme: {
    extend: {
      // Tosoh Brand Colors
      colors: {
        // Base colors
        'true-black': '#000000',
        'true-white': '#ffffff',

        // Tosoh brand color palette
        'imperial-red': '#ed1a3b',
        'aztec-gold': '#c19e4f',
        'spanish-green': '#009552',
        'myrtle-green': '#2a7278',
        'metallic-seaweed': '#0e759a',
        'pewter-blue': '#87b2b2',
        'max-purple': '#7f317e',

        // Gray scale
        'light-gray': '#eeefef',
        'spanish-gray': '#95939b',
        'silver-gray': '#6d6e71',

        // Semantic colors
        'primary': '#ed1a3b', // imperial-red
        'text': '#27272A',
        'bg': '#ffffff',
        'overlay': '#000000b3',
        'error': '#e60000'
      },

      // Spacing system matching Tosoh variables
      spacing: {
        '0': '0',
        '2xs': '0.25rem',    // --space-2xs
        'xs': '0.5rem',      // --space-xs
        'sm': '0.75rem',     // --space-sm
        'base': '1rem',      // --space (base unit)
        'md': '2rem',        // --space-md
        'lg': '3rem',        // --space-lg
        'xl': '4rem',        // --space-xl
        '2xl': '6rem',       // --space-2xl
        '3xl': '8rem',       // --space-3xl
        '4xl': '16rem',      // --space-4xl

        // Responsive scale (will be handled via CSS variables)
        'scale': 'var(--scale, 1rem)'
      },

      // Max width system
      maxWidth: {
        'page': '1440px',           // --page-max-width
        'page-wide': '90%',         // Approximation of min(90%, calc(1440px * 0.9))
        'page-snug': '80%',         // Approximation of min(80%, calc(1440px * 0.8))
        'page-narrow': '70%',       // Approximation of min(70%, calc(1440px * 0.7))
        'page-tight': '60%'         // Approximation of min(60%, calc(1440px * 0.6))
      },

      // Typography system
      fontFamily: {
        'body': ['Univers', 'sans-serif'],       // --font-family
        'heading': ['UniversCond', 'sans-serif'], // --font-heading
        'sans': ['Univers', 'sans-serif']
      },

      fontSize: {
        // Only custom sizes that differ from Tailwind defaults
        'xs': ['0.7rem', { lineHeight: '1.5' }],      // Tosoh specific: 0.7rem vs TW's 0.75rem
        'sm': ['0.9rem', { lineHeight: '1.5' }],      // Tosoh specific: 0.9rem vs TW's 0.875rem
        'base': ['var(--scale, 1rem)', { lineHeight: '1.5' }], // Responsive base size
        'xl': ['1.375rem', { lineHeight: '1.4' }],    // Tosoh specific: 1.375rem vs TW's 1.25rem
        '2xl': ['1.5rem', { lineHeight: '1.3' }],     // Tosoh specific: 1.5rem vs TW's 1.5rem
        '4xl': ['2.75rem', { lineHeight: '1.2' }],    // Tosoh specific: 2.75rem vs TW's 2.25rem
        '5xl': ['3.5rem', { lineHeight: '1.1' }],     // Tosoh specific: 3.5rem vs TW's 3rem
        '6xl': ['4rem', { lineHeight: '1' }],         // Tosoh specific: 4rem vs TW's 3.75rem
        '7xl': ['5rem', { lineHeight: '1' }],         // Tosoh specific: 5rem vs TW's 4.5rem
        '8xl': ['6rem', { lineHeight: '1' }]          // Tosoh specific: 6rem vs TW's 6rem
      },

      // Animation and transitions
      transitionDuration: {
        'DEFAULT': '200ms',   // --ease-time
        'fast': '150ms',
        'slow': '325ms',      // --slide-in timing
        'slower': '525ms',    // --slide-in-slow timing
        'slowest': '825ms'    // --slide-in-slower timing
      },

      transitionTimingFunction: {
        'tosoh': 'cubic-bezier(0.55, 0.15, 0.5, 0.9)',           // --ease-type
        'slide': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'      // slide animations
      },

      // Shadows
      boxShadow: {
        'tosoh': '0 0 0.5rem 0 rgba(0, 0, 0, 0.1)',  // --shadow
        'light': '0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 8px 0 rgba(0, 0, 0, 0.1)',
        'heavy': '0 8px 16px 0 rgba(0, 0, 0, 0.15)'
      },

      // Animation keyframes
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        }
      },

      animation: {
        'slide-in': 'slide-in 325ms cubic-bezier(0.215, 0.610, 0.355, 1.000)',
        'slide-in-slow': 'slide-in 525ms cubic-bezier(0.215, 0.610, 0.355, 1.000)',
        'slide-in-slower': 'slide-in 825ms cubic-bezier(0.215, 0.610, 0.355, 1.000)'
      }
    }
  },
  plugins: [
    // Custom plugin to add CSS variables and utility classes
    function ({ addUtilities, addBase }: any) {
      // Add the responsive scale CSS variables
      addBase({
        ':root': {
          '--scale': 'min(16px, 3vw)',
        },
        '@media (min-width: 768px)': {
          ':root': {
            '--scale': 'min(16px, 1.4vw)',
          }
        }
      })

      // Add page width utilities that match the CSS calc functions
      addUtilities({
        '.w-page-wide': {
          width: 'min(90%, calc(1440px * 0.9))',
          maxWidth: '1296px' // 1440 * 0.9
        },
        '.w-page-snug': {
          width: 'min(80%, calc(1440px * 0.8))',
          maxWidth: '1152px' // 1440 * 0.8
        },
        '.w-page-narrow': {
          width: 'min(70%, calc(1440px * 0.7))',
          maxWidth: '1008px' // 1440 * 0.7
        },
        '.w-page-tight': {
          width: 'min(60%, calc(1440px * 0.6))',
          maxWidth: '864px' // 1440 * 0.6
        },

        // Responsive font size utilities
        '.text-responsive-base': {
          fontSize: 'var(--scale)'
        },

        // Brand color utilities with CSS variables for easy theming
        '.bg-tosoh-primary': {
          backgroundColor: 'var(--color-primary, #ed1a3b)'
        },
        '.text-tosoh-primary': {
          color: 'var(--color-primary, #ed1a3b)'
        },
        '.border-tosoh-primary': {
          borderColor: 'var(--color-primary, #ed1a3b)'
        }
      })
    }
  ]
}

export default config
