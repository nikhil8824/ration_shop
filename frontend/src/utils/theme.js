import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2E7D32', // Green
    primaryContainer: '#C8E6C9',
    secondary: '#FF6F00', // Orange
    secondaryContainer: '#FFE0B2',
    tertiary: '#1976D2', // Blue
    tertiaryContainer: '#BBDEFB',
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    background: '#FAFAFA',
    error: '#D32F2F',
    errorContainer: '#FFCDD2',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onTertiary: '#FFFFFF',
    onSurface: '#212121',
    onSurfaceVariant: '#757575',
    onBackground: '#212121',
    onError: '#FFFFFF',
    outline: '#BDBDBD',
    outlineVariant: '#E0E0E0',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#424242',
    inverseOnSurface: '#FFFFFF',
    inversePrimary: '#81C784',
    elevation: {
      level0: 'transparent',
      level1: '#FFFFFF',
      level2: '#FFFFFF',
      level3: '#FFFFFF',
      level4: '#FFFFFF',
      level5: '#FFFFFF',
    },
  },
  roundness: 8,
  fonts: {
    ...DefaultTheme.fonts,
    headlineLarge: {
      ...DefaultTheme.fonts.headlineLarge,
      fontFamily: 'System',
      fontWeight: '600',
    },
    headlineMedium: {
      ...DefaultTheme.fonts.headlineMedium,
      fontFamily: 'System',
      fontWeight: '600',
    },
    headlineSmall: {
      ...DefaultTheme.fonts.headlineSmall,
      fontFamily: 'System',
      fontWeight: '600',
    },
    titleLarge: {
      ...DefaultTheme.fonts.titleLarge,
      fontFamily: 'System',
      fontWeight: '500',
    },
    titleMedium: {
      ...DefaultTheme.fonts.titleMedium,
      fontFamily: 'System',
      fontWeight: '500',
    },
    titleSmall: {
      ...DefaultTheme.fonts.titleSmall,
      fontFamily: 'System',
      fontWeight: '500',
    },
    bodyLarge: {
      ...DefaultTheme.fonts.bodyLarge,
      fontFamily: 'System',
    },
    bodyMedium: {
      ...DefaultTheme.fonts.bodyMedium,
      fontFamily: 'System',
    },
    bodySmall: {
      ...DefaultTheme.fonts.bodySmall,
      fontFamily: 'System',
    },
    labelLarge: {
      ...DefaultTheme.fonts.labelLarge,
      fontFamily: 'System',
      fontWeight: '500',
    },
    labelMedium: {
      ...DefaultTheme.fonts.labelMedium,
      fontFamily: 'System',
      fontWeight: '500',
    },
    labelSmall: {
      ...DefaultTheme.fonts.labelSmall,
      fontFamily: 'System',
      fontWeight: '500',
    },
  },
};



