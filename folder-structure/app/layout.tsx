import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <footer className="border-t py-8 mt-12">
          <div className="container mx-auto text-center text-muted-foreground text-sm">
            <p>© {new Date().getFullYear()} SpaceHub. All rights reserved.</p>
            <p className="mt-2">Find and book the perfect space for your needs.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}


import './globals.css'