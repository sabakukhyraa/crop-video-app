import React from 'react';
import { Text, TextProps, StyleProp, TextStyle } from 'react-native';
import tw from '@lib/tailwind';

const weightMap: { [key in 300 | 400 | 500 | 600 | 700]: string } = {
	700: 'ralewaybold',
	600: 'ralewaysemibold',
	500: 'ralewaymedium',
	400: 'raleway',
	300: 'ralewaylight',
};

interface ThemedTextProps extends TextProps {
	children: React.ReactNode;
	style?: StyleProp<TextStyle>;
	size?: number;
	weight?: 300 | 400 | 500 | 600 | 700;
	lineHeight?: number | null;
	color?: string;
}

const ThemedText: React.FC<ThemedTextProps> = ({
	children,
	style,
	size = 14,
	weight = 400,
	lineHeight = null,
	color = '000',
	...props
}) => {
	const fontFamily = weightMap[weight] || 'raleway';

	return (
		<Text
			{...props}
			style={[
				tw.style(`font-${fontFamily} text-[${color}]`, {
					lineHeight: size * 1.2,
				}),
				style,
				{ fontSize: size, lineHeight: lineHeight || size * 1.3 },
			]}
		>
			{children}
		</Text>
	);
};

export default ThemedText;