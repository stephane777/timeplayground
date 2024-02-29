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

const ThemeContext = createContext({} as ReturnType<typeof useTheme>)

/** Below is for the Chrome React dev Tools extension
 * to display the name of the context instead
 * of "Context.provider"
 **/
ThemeContext.displayName = 'ThemeContext'

export const useTheme = () => {
    const [theme, setTheme] = useState<Theme>('light')

    const value = useMemo(() => {
        return { theme, setTheme }
    }, [theme, setTheme])
    return value
}

const ThemeProvider: FC<Props> = ({ children }) => {
    return (
        <ThemeContext.Provider value={useTheme()}>
            {children}{' '}
        </ThemeContext.Provider>
    )
}
export default ThemeProvider
