export const lightTheme = {
  background: '#ffffff',
  surface: '#f5f5f5',
  card: '#ffffff',
  text: '#333333',
  textSecondary: '#666666',
  textMuted: '#999999',
  primary: '#007AFF',
  success: '#28a745',
  danger: '#d9534f',
  warning: '#ffc107',
  border: '#e0e0e0',
  inputBackground: '#f9f9f9',
  inputBorder: '#ddd',
  shadow: '#000',
  isDark: false,
};

export const darkTheme = {
  background: '#1a1a1a',
  surface: '#2d2d2d',
  card: '#2d2d2d',
  text: '#ffffff',
  textSecondary: '#b0b0b0',
  textMuted: '#808080',
  primary: '#0a84ff',
  success: '#30d158',
  danger: '#ff453a',
  warning: '#ffd60a',
  border: '#3a3a3a',
  inputBackground: '#3a3a3a',
  inputBorder: '#4a4a4a',
  shadow: '#000',
  isDark: true,
};

export type Theme = typeof lightTheme;
