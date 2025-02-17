import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
		keyframes: {
			'infinite-scroll': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(var(--scroll-width))' },
        },
			scroll: {
				'0%': { transform: 'translateX(0)' },
				'100%': { transform: 'translateX(calc(-50% - 1rem))' }
			  },
			'move-down': {
          '0%': { transform: 'translate(-50%, 0)' },
          '100%': { transform: 'translate(-50%, calc(100% - 2rem))' }
        },
			'fade-in': {
			  '0%': { opacity: '0' },
			  '100%': { opacity: '1' },
			},
			'slide-down': {
			  '0%': { transform: 'translateY(-100%)', opacity: '0' },
			  '100%': { transform: 'translateY(0)', opacity: '1' },
			},
			'slide-up': {
			  '0%': { transform: 'translateY(100%)', opacity: '0' },
			  '100%': { transform: 'translateY(0)', opacity: '1' },
			},
			'fade-scale-in': {
				'0%': { 
					opacity: '0',
					transform: 'scale(0.95) rotate(-3deg)'
				},
				'100%': { 
					opacity: '1',
					transform: 'scale(1) rotate(0)'
				}
				},
				'train-move': {
          '0%': { 
            transform: 'translateY(0) translateX(-50%)',
            opacity: '0'
          },
          '5%': {
            opacity: '1'
          },
          '95%': {
            opacity: '1'
          },
          '100%': { 
            transform: 'translateY(calc(100% - 2rem)) translateX(-50%)',
            opacity: '0'
          }
        }
		  },
		  animation: {
			'fade-in': 'fade-in 1s ease-out',
			'train-move': 'train-move 4s linear infinite',
			'slide-down': 'slide-down 0.8s ease-out',
			'slide-up': 'slide-up 0.8s ease-out 0.3s',
			'move-down': 'move-down 3s linear forwards',
			'scroll': 'scroll 25s linear infinite',
			'infinite-scroll': 'infinite-scroll 25s linear infinite',
			
		  },
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			cornflowerBlue: 'var(--cornflower-blue)',
  			juneBud: 'hsl(var(--june-bud))',
  			signalBlack: 'var(--signal-black)',
  			linen: 'hsl(var(--linen))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: 'var(--font-geist-sans)',
  			mono: 'var(--font-geist-mono)',
  			poppins: 'var(--font-poppins)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	},
  	plugins: [
  		'tailwindcssAnimate'
  	]
  },
    plugins: [tailwindcssAnimate]
};

export default config;
