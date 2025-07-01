import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: { '2xl': '1400px' },
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			typography: (theme) => ({
				DEFAULT: {
					css: {
						color: theme('colors.foreground'),
						a: {
							color: theme('colors.primary.DEFAULT'),
						},
						strong: { color: theme('colors.foreground') },
						'ul > li::before': { backgroundColor: theme('colors.foreground') },
						blockquote: { color: theme('colors.muted.foreground') },
						h1: {
							fontSize: theme('fontSize.4xl')[0],
							fontWeight: '700',
							marginTop: '1.5em',
							marginBottom: '0.5em',
							color: theme('colors.primary.DEFAULT'),
						},
						h2: {
							fontSize: theme('fontSize.3xl')[0],
							fontWeight: '600',
							marginTop: '1.2em',
							marginBottom: '0.5em',
							color: theme('colors.primary.DEFAULT'),
						},
						h3: {
							fontSize: theme('fontSize.2xl')[0],
							fontWeight: '600',
							marginTop: '1em',
							marginBottom: '0.5em',
							color: theme('colors.primary.DEFAULT'),
						},
						h4: {
							fontSize: theme('fontSize.2xl')[0],
							fontWeight: '600',
							marginTop: '1em',
							marginBottom: '0.5em',
							color: theme('colors.primary.DEFAULT'),
						},
						table: {
							width: '100%',
							tableLayout: 'auto',
							textAlign: 'left',
							marginTop: '1.5em',
							marginBottom: '1.5em',
						},
						thead: {
							borderBottomWidth: '1px',
							borderBottomColor: theme('colors.border'),
						},
						'thead th': {
							padding: '0.5em 1em',
							fontWeight: '600',
							color: theme('colors.primary.DEFAULT'),
						},
						'tbody tr': {
							borderBottomWidth: '1px',
							borderBottomColor: theme('colors.border'),
						},
						'tbody td': {
							padding: '0.5em 1em',
							color: theme('colors.primary.DEFAULT'),
							borderBottomWidth: '1px',
							borderBottomColor: theme('colors.border'),
						},
						'td code': {
							backgroundColor: 'transparent',
							padding: '0',
							borderRadius: '0',
							fontWeight: 'normal',
							fontSize: '1em',
							color: theme('colors.primary.DEFAULT'),
						},
						'td code::before': { content: 'none' },
						'td code::after': { content: 'none' },
						'li code': {
							backgroundColor: 'transparent',
							padding: '0',
							borderRadius: '0',
							fontWeight: 'normal',
							fontSize: '1em',
							color: theme('colors.foreground'),
						},
						'li code::before': { content: 'none' },
						'li code::after': { content: 'none' },
						// ...existing code...
						'p code': {
							backgroundColor: theme('colors.muted.DEFAULT'), // Add a subtle background
							padding: '0.2em 0.4em', // Add some padding for readability
							borderRadius: '0.25em',
							fontWeight: 'normal',
							fontSize: '1em',
							color: theme('colors.primary.DEFAULT'), // Use a primary color for code text
						},
						// ...existing code...
						'p code::before': { content: 'none' },
						'p code::after': { content: 'none' }
					},
				},
				dark: {
					css: {
						color: theme('colors.foreground'),
						a: {
							color: theme('colors.primary.DEFAULT'),
							'&:hover': { color: theme('colors.primary.foreground') },
						},
						strong: { color: theme('colors.foreground') },
						'ul > li::before': { backgroundColor: theme('colors.foreground') },
						blockquote: { color: theme('colors.muted.foreground') },
						h1: {
							fontSize: theme('fontSize.4xl')[0],
							fontWeight: '700',
							marginTop: '1.5em',
							marginBottom: '0.5em',
							color: theme('colors.primary.DEFAULT'),
						},
						h2: {
							fontSize: theme('fontSize.3xl')[0],
							fontWeight: '600',
							marginTop: '1.2em',
							marginBottom: '0.5em',
							color: theme('colors.primary.DEFAULT'),
						},
						h3: {
							fontSize: theme('fontSize.2xl')[0],
							fontWeight: '600',
							marginTop: '1em',
							marginBottom: '0.5em',
							color: theme('colors.primary.DEFAULT'),
						},
						h4: {
							fontSize: theme('fontSize.2xl')[0],
							fontWeight: '600',
							marginTop: '1em',
							marginBottom: '0.5em',
							color: theme('colors.primary.DEFAULT'),
						},
						table: {
							width: '100%',
							tableLayout: 'auto',
							textAlign: 'left',
							marginTop: '1.5em',
							marginBottom: '1.5em',
						},
						thead: {
							borderBottomWidth: '1px',
							borderBottomColor: theme('colors.border'),
						},
						'thead th': {
							padding: '0.5em 1em',
							fontWeight: '600',
							color: theme('colors.primary.DEFAULT'),
						},
						'tbody tr': {
							borderBottomWidth: '1px',
							borderBottomColor: theme('colors.border'),
						},
						'tbody td': {
							padding: '0.5em 1em',
							color: theme('colors.primary.DEFAULT'),
							borderBottomWidth: '1px',
							borderBottomColor: theme('colors.border'),
						},
						'td code': {
							backgroundColor: 'transparent',
							padding: '0',
							borderRadius: '0',
							fontWeight: 'normal',
							fontSize: '1em',
							color: theme('colors.primary.DEFAULT'),
						},
						'td code::before': { content: 'none' },
						'td code::after': { content: 'none' },
						'li code': {
							backgroundColor: 'transparent',
							padding: '0',
							borderRadius: '0',
							fontWeight: 'normal',
							fontSize: '1em',
							color: theme('colors.foreground'),
						},
						'li code::before': { content: 'none' },
						'li code::after': { content: 'none' },
						'p code': {
							backgroundColor: theme('colors.muted.DEFAULT'), // Add a subtle background
							padding: '0.2em 0.4em', // Add some padding for readability
							borderRadius: '0.25em',
							fontWeight: 'normal',
							fontSize: '1em',
							color: theme('colors.primary.DEFAULT'), // Use a primary color for code text
						},
						'p code::before': { content: 'none' },
						'p code::after': { content: 'none' }
					},
				},
			}),
		},
	},
	plugins: [
		require("tailwindcss-animate"),
		require('@tailwindcss/typography')
	],
} satisfies Config;
