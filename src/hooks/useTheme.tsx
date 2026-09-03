import { useEffect, useState } from "react";

const THEME_KEY = 'theme'
export function useTheme() {
    const [isDark, setIsDark] = useState<boolean>(() => {
        const theme = localStorage.getItem(THEME_KEY)

        if (theme === 'dark') return true
        if (theme === 'light') return false

        // fallback to system preferences
        return window.matchMedia("(prefers-color-scheme: dark)").matches
    })

    useEffect(() => {
        const theme = isDark ? "dark" : "light"

        // document.documentElement.setAttribute("data-theme", theme)
        document.documentElement.classList.toggle('dark', isDark)
        localStorage.setItem(THEME_KEY, theme)
    }, [isDark])

    return { isDark, setIsDark }
}