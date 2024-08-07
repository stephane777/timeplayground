import React, { createContext, useMemo, useState, useContext, ReactNode, FC } from 'react';

export type Theme = 'light' | 'dark';

interface Props {
  children?: ReactNode;
}

interface ContextValue {
  theme: Theme;
  setTheme?: React.Dispatch<React.SetStateAction<Theme>>;
}

export const ThemeContext = createContext<ContextValue>({ theme: 'dark' });

/** Below is for the Chrome React dev Tools extension
 * to display the name of the context instead
 * of "Context.provider"
 **/
ThemeContext.displayName = 'ThemeContext';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  // if (context === undefined) {
  //   throw new Error('useTheme must be used within a ValueProvider');
  // }
  return context;
};

const usePassedDownValues = () => {
  const [theme, setTheme] = useState<Theme>('dark');

  //The state should be memoized to maintain the referential equality/ same location in memory. If not
  // every time this context is called a new location in memory will be created for the values.
  const value = useMemo(() => {
    return { theme, setTheme };
  }, [theme, setTheme]);
  return value;
};

const ThemeProvider: FC<Props> = ({ children }) => {
  return <ThemeContext.Provider value={usePassedDownValues()}>{children} </ThemeContext.Provider>;
};
export default ThemeProvider;
