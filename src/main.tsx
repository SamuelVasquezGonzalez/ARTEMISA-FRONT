import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './UserContext'
import { ProductsProvider } from './ProductContext'
import { RoutesMiddleware } from './Routes/Routes'

export type Picture = {
    public_id: string,
    url: string
}


createRoot(document.getElementById('root')!).render(
  <StrictMode>
        <AuthProvider>
            <ProductsProvider>
                <RoutesMiddleware />
            </ProductsProvider>
        </AuthProvider>
    </StrictMode>
)
