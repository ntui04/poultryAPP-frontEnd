import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  loading?: boolean;
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({ 
  children, 
  loading, 
  style, 
  disabled,
  variant = 'default',
  size = 'md',
  fullWidth,
  ...props 
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[`button_${variant}`],
        styles[`button_${size}`],
        fullWidth && styles.buttonFullWidth,
        disabled && styles.buttonDisabled,
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'default' ? '#fff' : '#FF4747'} />
      ) : (
        <Text style={[
          styles.buttonText,
          styles[`buttonText_${variant}`],
          styles[`buttonText_${size}`],
          disabled && styles.buttonTextDisabled,
        ]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  button_default: {
    backgroundColor: '#FF4747',
    shadowColor: '#FF4747',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#FF4747',
  },
  button_ghost: {
    backgroundColor: 'transparent',
  },
  button_link: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    height: 'auto',
  },
  button_sm: {
    height: 36,
    paddingHorizontal: 16,
  },
  button_md: {
    height: 48,
    paddingHorizontal: 24,
  },
  button_lg: {
    height: 56,
    paddingHorizontal: 32,
  },
  buttonFullWidth: {
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: '#e2e8f0',
    borderColor: '#e2e8f0',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonText_default: {
    color: '#ffffff',
  },
  buttonText_outline: {
    color: '#FF4747',
  },
  buttonText_ghost: {
    color: '#FF4747',
  },
  buttonText_link: {
    color: '#FF4747',
    textDecorationLine: 'underline',
  },
  buttonText_sm: {
    fontSize: 14,
  },
  buttonText_md: {
    fontSize: 16,
  },
  buttonText_lg: {
    fontSize: 18,
  },
  buttonTextDisabled: {
    color: '#94a3b8',
  },
});