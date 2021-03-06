import { MantineProvider } from '@mantine/core'
import { invoke } from '@tauri-apps/api/tauri'
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './components/App'
import './styles/index.css'

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    invoke('close_splashscreen')
  }, 1000)
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={{ colorScheme: 'dark' }} withGlobalStyles withNormalizeCSS>
      <App />
    </MantineProvider>
  </React.StrictMode>
)
