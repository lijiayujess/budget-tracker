import { useColorMode, usePreferredDark } from '@vueuse/core'

export function useTheme() {
  const mode = useColorMode({
    attribute: 'class',
    modes: {
      light: 'light',
      dark: 'dark'
    }
  })

  const preferredDark = usePreferredDark()

  function initTheme() {
    const stored = localStorage.getItem('vueuse-color-scheme')
    if (!stored || stored === 'auto') {
      mode.value = preferredDark.value ? 'dark' : 'light'
    }
  }

  function toggleTheme() {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
  }

  return {
    mode,
    initTheme,
    toggleTheme
  }
}
