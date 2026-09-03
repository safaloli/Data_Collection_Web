import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/css/global.css'
import RouterConfig from './router/RouterConfig'
import AuthProvider from './context/provider/AuthProvider'
import { Toaster } from 'sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster richColors={true} closeButton={true} />
        <RouterConfig />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
