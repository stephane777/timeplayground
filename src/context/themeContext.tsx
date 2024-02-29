import React, {
    createContext,
    useMemo,
    useState,
    useContext,
    ReactNode,
    FC,
} from 'react'

type ThemeValue = 'dark' | 'light'

interface Props {
    children?: ReactNode
}

const ThemeContext = createContext<ThemeValue>('light')

/** Below is for the Chrome React dev Tools extension
 * to display the name of the context instead
 * of "Context.provider"
 **/
ThemeContext.displayName = 'ThemeContext'

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useValue must be used within a ValueProvider')
    }
    return context
}

const ThemeProvider: FC<Props> = ({ children }) => {
    const [theme, setTheme] = useState<ThemeValue>('light')

    const value = useMemo(() => {
        return { theme, setTheme }
    }, [theme, setTheme])

    return (
        <ThemeContext.Provider value={value.theme}>
            {children}{' '}
        </ThemeContext.Provider>
    )
}
export default ThemeProvider
