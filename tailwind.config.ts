
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
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
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
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					from: {
						opacity: '0'
					},
					to: {
						opacity: '1'
					}
				},
				'fade-out': {
					from: {
						opacity: '1'
					},
					to: {
						opacity: '0'
					}
				},
				'slide-up': {
					from: {
						transform: 'translateY(20px)',
						opacity: '0'
					},
					to: {
						transform: 'translateY(0)',
						opacity: '1'
					}
				},
				'slide-down': {
					from: {
						transform: 'translateY(-20px)',
						opacity: '0'
					},
					to: {
						transform: 'translateY(0)',
						opacity: '1'
					}
				},
				'slide-in-right': {
					from: {
						transform: 'translateX(20px)',
						opacity: '0'
					},
					to: {
						transform: 'translateX(0)',
						opacity: '1'
					}
				},
				'slide-in-left': {
					from: {
						transform: 'translateX(-20px)',
						opacity: '0'
					},
					to: {
						transform: 'translateX(0)',
						opacity: '1'
					}
				},
				'scale-in': {
					from: {
						transform: 'scale(0.95)',
						opacity: '0'
					},
					to: {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				float: {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				},
				'pulse-light': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.7'
					}
				},
				shimmer: {
					'0%': {
						backgroundPosition: '-500px 0'
					},
					'100%': {
						backgroundPosition: '500px 0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out forwards',
				'fade-out': 'fade-out 0.2s ease-in forwards',
				'slide-up': 'slide-up 0.4s ease-out forwards',
				'slide-down': 'slide-down 0.4s ease-out forwards',
				'slide-in-right': 'slide-in-right 0.4s ease-out forwards',
				'slide-in-left': 'slide-in-left 0.4s ease-out forwards',
				'scale-in': 'scale-in 0.3s ease-out forwards',
				'float': 'float 6s ease-in-out infinite',
				'pulse-light': 'pulse-light 3s ease-in-out infinite',
				'shimmer': 'shimmer 2s linear infinite'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'mesh-pattern': 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\' viewBox=\'0 0 40 40\'%3E%3Cg fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 20.83l2.83-2.83 1.41 1.41L1.41 22.24H0v-1.41zM0 3.07l2.83-2.83 1.41 1.41L1.41 4.48H0V3.07zM17.76 40l2.83-2.83 1.41 1.41L19.17 40h-1.41zM17.76 22.24l2.83-2.83 1.41 1.41L19.17 22.24h-1.41zM17.76 4.48l2.83-2.83 1.41 1.41L19.17 4.48h-1.41zM35.52 40l2.83-2.83 1.41 1.41L37.93 40h-2.41zM35.52 22.24l2.83-2.83 1.41 1.41L37.93 22.24h-2.41zM35.52 4.48l2.83-2.83 1.41 1.41L37.93 4.48h-2.41zM1.41 17.76l2.83 2.83 1.41-1.41L2.83 16.35H1.41v1.41zM1.41 0l2.83 2.83 1.41-1.41L2.83-1.41H1.41V0zM19.17 17.76l2.83 2.83 1.41-1.41-2.83-2.83h-1.41v1.41zM19.17 0l2.83 2.83 1.41-1.41-2.83-2.83h-1.41V0zM36.93 17.76l2.83 2.83 1.41-1.41-2.83-2.83h-1.41v1.41zM36.93 0l2.83 2.83 1.41-1.41-2.83-2.83h-1.41V0z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
			},
			boxShadow: {
				'soft': '0 2px 15px rgba(0, 0, 0, 0.05)',
				'glass': '0 8px 32px rgba(0, 0, 0, 0.07)',
				'highlight': '0 0 0 2px rgba(255, 255, 255, 0.1)'
			},
			transitionTimingFunction: {
				'apple': 'cubic-bezier(0.42, 0, 0.58, 1)',
				'bounce-soft': 'cubic-bezier(0.18, 0.89, 0.32, 1.28)'
			},
			backdropBlur: {
				'xs': '2px'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
