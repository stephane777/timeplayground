import React, {
    createContext,
    useMemo,
    useState,
    useContext,
    ReactNode,
    FC,
} from 'react'

type Theme = 'light' | 'dark'

interface Props {
    children?: ReactNode
}

const ThemeContext = createContext({} as ReturnType<typeof usePassedDownValues>)

/** Below is for the Chrome React dev Tools extension
 * to display the name of the context instead
 * of "Context.provider"
 **/
ThemeContext.displayName = 'ThemeContext'

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ValueProvider')
    }
}

const usePassedDownValues = () => {
    const [theme, setTheme] = useState<Theme>('light')

    //The state should be memoized to maintain the referential equality/ same location in memory. If not
    // every time this context is called a new location in memory will be created for the values.
    const value = useMemo(() => {
        return { theme, setTheme }
    }, [theme, setTheme])
    return value
}

const ThemeProvider: FC<Props> = ({ children }) => {
    return (
        <ThemeContext.Provider value={usePassedDownValues()}>
            {children}{' '}
        </ThemeContext.Provider>
    )
}
export default ThemeProvider
