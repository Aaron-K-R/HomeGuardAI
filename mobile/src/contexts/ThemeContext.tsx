import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';
type ThemePreference = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  themePreference: ThemePreference;
  toggleTheme: () => void;
  setThemePreference: (preference: ThemePreference) => void;
  setThemeFromUserSettings: (userTheme: string) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('auto');
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved theme preference on app start
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedPreference = await AsyncStorage.getItem('themePreference');
        if (savedPreference && ['light', 'dark', 'auto'].includes(savedPreference)) {
          setThemePreferenceState(savedPreference as ThemePreference);
          if (savedPreference === 'auto') {
            setTheme(Appearance.getColorScheme() === 'dark' ? 'dark' : 'light');
          } else {
            setTheme(savedPreference as Theme);
          }
        } else {
          // Default to system theme
          setThemePreferenceState('auto');
          setTheme(Appearance.getColorScheme() === 'dark' ? 'dark' : 'light');
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
        // Fallback to system theme
        setThemePreferenceState('auto');
        setTheme(Appearance.getColorScheme() === 'dark' ? 'dark' : 'light');
      } finally {
        setIsInitialized(true);
      }
    };

    loadThemePreference();
  }, []);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      // Only update theme if preference is 'auto'
      if (themePreference === 'auto') {
        setTheme(colorScheme === 'dark' ? 'dark' : 'light');
      }
    });

    return () => subscription?.remove();
  }, [themePreference]);


  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const setThemePreference = async (preference: ThemePreference) => {
    setThemePreferenceState(preference);
    if (preference === 'auto') {
      setTheme(Appearance.getColorScheme() === 'dark' ? 'dark' : 'light');
    } else {
      setTheme(preference);
    }
    
    // Save preference to AsyncStorage
    try {
      await AsyncStorage.setItem('themePreference', preference);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const setThemeFromUserSettings = async (userTheme: string) => {
    if (['light', 'dark', 'auto'].includes(userTheme)) {
      setThemePreferenceState(userTheme as ThemePreference);
      if (userTheme === 'auto') {
        setTheme(Appearance.getColorScheme() === 'dark' ? 'dark' : 'light');
      } else {
        setTheme(userTheme as Theme);
      }
      
      // Save preference to AsyncStorage
      try {
        await AsyncStorage.setItem('themePreference', userTheme);
      } catch (error) {
        console.error('Error saving theme preference from user settings:', error);
      }
    }
  };

  const isDark = theme === 'dark';

  const value = {
    theme,
    themePreference,
    toggleTheme,
    setThemePreference,
    setThemeFromUserSettings,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
