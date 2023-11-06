import { Inter } from 'next/font/google'
import './globals.css'
import {Providers} from "./providers";
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Cuauhtémoc IPN',
  description: 'Equipo de Aeroespacial.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Script type='module' src='https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js'/>
          <Script type='module' src='https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js'/>
        </Providers>
      </body>
    </html>
  )
}
