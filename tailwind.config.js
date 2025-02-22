const { default: Colors } = require('constants/Colors');
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
			darkGray: Colors.darkGray,
			midGray: Colors.midGray,
			teal: Colors.teal,
			lightGray: Colors.lightGray
		},
	},
	plugins: [
		plugin(({ addUtilities }) => {
			addUtilities({});
		}),
	],
};