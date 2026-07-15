/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class', '[data-theme="dark"]'],
    content: {
        relative: true,
        files: [
            './app/**/*.{hbs,js}',
            './node_modules/.pnpm/@fleetbase+*/**/addon/**/*.{hbs,js}',
            './node_modules/@fleetbase+*/addon/**/*.{hbs,js}',
            './node_modules/@fleetbase/ember-ui/addon/templates/**/*.{hbs,js}',
            './node_modules/@fleetbase/ember-ui/addon/components/**/*.{hbs,js}',
            './node_modules/**/*-engine/addon/**/*.{hbs,js}',
        ],
    },
    safelist: [
        {
            pattern: /(py|px|mx|my|gap)-[1-9][0-9]?/,
        },
    ],
    theme: {
        extend: {
            gridTemplateColumns: {
                span: ['span 1', 'span 2', 'span 3', 'span 4', 'span 5', 'span 6', 'span 7', 'span 8', 'span 9', 'span 10', 'span 11', 'span 12'],
            },
            ringColor: {
                DEFAULT: 'transparent',
            },
            colors: {
                // ── Elite Logistics palette (named tokens) ──────────────────
                // Primary green #5DD62C / dark green #337418.
                // Neutral surfaces #F8F8F8 (light) / #202020 (dark) / #0F0F0F (darkest).
                brand: {
                    50: '#e8fbdd',
                    100: '#c6f4b0',
                    200: '#a1ec80',
                    300: '#7ee352',
                    400: '#6bde3f',
                    500: '#5dd62c', // primary
                    600: '#47a821',
                    700: '#337418', // dark / hover / active
                    800: '#26550f',
                    900: '#173408',
                    DEFAULT: '#5dd62c',
                    dark: '#337418',
                },
                // Neutral surface tokens (semantic aliases for the palette).
                surface: {
                    light: '#f8f8f8', // light-mode page background
                    dark: '#202020', // dark-mode card / surface
                    darkest: '#0f0f0f', // darkest bg / primary text
                },
                // Neutral gray ramp anchored to the palette. Light shades stay
                // neutral (light mode unchanged); dark shades snap to the brand
                // neutrals so all `dark:bg-gray-800/900` surfaces hit #202020 /
                // #0F0F0F, and `text-gray-800/900` hit the palette text colors.
                gray: {
                    50: '#f8f8f8', // light page bg (palette light)
                    100: '#f2f2f2',
                    200: '#e5e5e5', // light borders
                    300: '#d4d4d4',
                    400: '#a3a3a3', // secondary text
                    500: '#737373', // secondary text
                    600: '#525252',
                    700: '#2b2b2b', // dark input / hover / border
                    800: '#202020', // dark surface / secondary text (palette)
                    900: '#0f0f0f', // dark page / primary text (palette)
                    950: '#0a0a0a', // darkest
                },
                // Elite Logistics brand green (primary). #5DD62C brand, #337418 dark.
                sky: {
                    100: '#e8fbdd',
                    200: '#c6f4b0',
                    300: '#a1ec80',
                    400: '#7ee352',
                    500: '#5dd62c',
                    600: '#47a821',
                    700: '#337418',
                    800: '#26550f',
                    900: '#173408',
                },
                blue: {
                    100: '#e8fbdd',
                    200: '#c6f4b0',
                    300: '#a1ec80',
                    400: '#7ee352',
                    500: '#5dd62c',
                    600: '#47a821',
                    700: '#337418',
                    800: '#26550f',
                    900: '#173408',
                },
                nightsky: {
                    100: '#0d2f57',
                    200: '#092340',
                    300: '#06172a',
                    400: '#030b14',
                },
                night: {
                    801: '#222C3C',
                    802: '#202A3A',
                    803: '#1D2737',
                    804: '#1B2535',
                    805: '#182232',
                    901: '#131B2B',
                    902: '#111929',
                    903: '#0E1626',
                    904: '#0C1424',
                    905: '#091121',
                },
                midnight: {
                    100: '#555555',
                    200: '#484848',
                    300: '#3b3b3b',
                    400: '#2e2e2e',
                    500: '#222222',
                    600: '#151515',
                    700: '#080808',
                },
                moregray: {
                    750: '#283345',
                    850: '#212a38',
                },
            },
            boxShadow: {
                xs: '0 0 0 1px rgba(0,0,0, 0.05)',
                'light-xs': '0 0 0 1px rgba(212,220,236, 0.05)',
                'light-sm': '0 1px 2px 0 rgba(212,220,236, 0.05)',
                light: '0 1px 3px 0 rgba(212,220,236, 0.1), 0 1px 2px 0 rgba(212,220,236, 0.06)',
                'light-md': '0 4px 6px -1px rgba(212,220,236, 0.1), 0 2px 4px -1px rgba(212,220,236, 0.06)',
                'light-lg': '0 10px 15px -3px rgba(212,220,236, 0.1), 0 4px 6px -2px rgba(212,220,236, 0.05)',
                'light-xl': '0 20px 25px -5px rgba(212,220,236, 0.1), 0 10px 10px -5px rgba(212,220,236, 0.04)',
                'light-2xl': '0 25px 50px -12px rgba(212,220,236, 0.25)',
                'light-3xl': '0 35px 60px -15px rgba(212,220,236, 0.3)',
                pop: '0 0 2.25rem #d4dcec',
                'pop-less': '0 0 1rem #d4dcec',
                'pop-lesser': '0 0 .5rem #d4dcec',
                'pop-least': '0 0 .25rem #d4dcec',
                'dark-overlay': '-5px 10px 13px 3px rgba(0,0,0,0.3)',
                'dark-overlay-gray': '-5px 10px 13px 3px rgba(26, 32, 44, .5)',
                'overlay-inner': 'inset 0 1px 5px 0 rgba(0, 0, 0, 0.3)',
                'next-nav': 'rgba(0 0 0 / 35%) 0px 7px 32px',
            },
            width: {
                70: '18rem',
                74: '22rem',
                78: '26rem',
                82: '28rem',
                86: '30rem',
            },
            spacing: {
                6: '1.5rem',
                8: '2rem',
                10: '2.5rem',
                12: '3rem',
                16: '4rem',
                20: '5rem',
                24: '6rem',
                32: '8rem',
                40: '10rem',
                44: '11rem',
                48: '12rem',
                52: '13rem',
                56: '14rem',
                60: '15rem',
                64: '16rem',
                72: '18rem',
                74: '22rem',
                78: '26rem',
                82: '28rem',
                86: '30rem',
            },
        },
    },
    variants: {
        boxShadow: ['responsive', 'hover', 'focus', 'group-focus', 'dark'],
        backgroundColor: ['responsive', 'hover', 'focus', 'dark', 'dark-hover', 'dark-group-hover', 'dark-even', 'dark-odd'],
        borderColor: ['responsive', 'hover', 'focus', 'dark', 'dark-disabled', 'dark-focus', 'dark-focus-within'],
        border: ['hover', 'focus', 'dark', 'dark-disabled', 'dark-focus'],
        textColor: ['responsive', 'hover', 'focus', 'dark', 'dark-hover', 'dark-active', 'dark-placeholder'],
        maxWidth: ['responsive', 'hover', 'focus'],
    },
    plugins: [require('@tailwindcss/forms')],
};
