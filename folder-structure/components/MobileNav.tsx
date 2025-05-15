"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path ? "text-primary font-semibold" : "text-foreground"
  }

  const routes = [
    { href: "/", label: "Home" },
    { href: "/spaces", label: "Spaces" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <nav className="flex flex-col gap-4 mt-8">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`text-lg ${isActive(route.href)} hover:text-primary transition-colors`}
              onClick={() => setOpen(false)}
            >
              {route.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Sign In
            </Button>
            <Button onClick={() => setOpen(false)}>Sign Up</Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
