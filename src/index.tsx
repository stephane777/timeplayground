import React from 'react'
import { createRoot } from 'react-dom/client'
import ThemeProvider from './context/themeContext'
import App from './App'

import './styles/main.scss'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)
root.render(
    <React.StrictMode>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </React.StrictMode>
)
