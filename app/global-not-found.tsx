
import './globals.css'
import { Josefin_Sans } from 'next/font/google'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import HeaderContainer from '@/components/header/HeaderContainer'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'
import FooterContainer from '@/components/footer/FooterContainer'
import { auth } from '@/auth'
 
const josefin = Josefin_Sans({ subsets: ['latin'], display: 'swap' })
 
export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
}
 
export default async function GlobalNotFound() {

  const session = await auth();
  return (
    <html lang="en" className={josefin.className}>
      <body>
         <WishlistProvider user={session?.user}>
                <CartProvider>
        <HeaderContainer />
        <PageHeader title='404 Not Found' />
        <div className="flex flex-col justify-center items-center min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 px-4">
        <Image src="/images/not-found.png" alt="404 Error" width={300} height={300} className="mb-8" />
        <p>Oops!This page does not exist.</p>
        <Link href="/" className="px-6 bg-pink text-white py-4">Go Back Home!</Link>
        </div>
        <FooterContainer />
        </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  )
}