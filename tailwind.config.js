const plugin = require('tailwindcss/plugin');

module.exports = {
	theme: {
		fontFamily: {
			ralewaybold: ['Raleway-Bold', 'sans-serif'],
			ralewaysemibold: ['Raleway-SemiBold', 'sans-serif'],
			ralewaymedium: ['Raleway-Medium', 'sans-serif'],
			raleway: ['Raleway-Regular', 'sans-serif'],
			ralewaylight: ['Raleway-Light', 'sans-serif'],
		},
		colors: {

		},
	},
	plugins: [
		plugin(({ addUtilities }) => {
			addUtilities({});
		}),
	],
};