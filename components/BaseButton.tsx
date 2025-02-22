import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import tw from '../lib/tailwind';
import { LinearGradient } from 'expo-linear-gradient';
import ThemedText from './ThemedText';
import Colors from '../constants/Colors';

interface BaseButtonProps extends TouchableOpacityProps {
  children?: React.ReactNode;
  cover?: boolean;
  style?: StyleProp<ViewStyle>;
  isLoading?: boolean;
  disabled?: boolean;
  content?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

function BaseButton({
  children,
  cover = true,
  style,
  isLoading = false,
  disabled,
  content = 'Press',
  gradientFrom,
  gradientTo,
  ...props
}: BaseButtonProps) {
  const fromColor = gradientFrom || Colors.lightGray;
  const toColor = gradientTo || Colors.lightGray;

  return (
    <TouchableOpacity
      style={tw.style(
        'h-13 items-center justify-center',
        cover && 'w-full',
        (isLoading || disabled) && 'opacity-50',
        style ? StyleSheet.flatten(style) : {}
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      <LinearGradient
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}
        colors={[fromColor, toColor]}
        style={tw.style('w-full h-full absolute top-0 right-0 rounded-2xl')}
      />
      {isLoading ? (
        <ActivityIndicator size="small" color={Colors.darkGray} />
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

export default BaseButton;