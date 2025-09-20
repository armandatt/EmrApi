import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Github, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate() 

  function isAuthenticated() {
    const token = localStorage.getItem("token")
    return !!token
  }

  function handleLogout() {
    localStorage.removeItem("token")
    navigate("/sign-in") 
  }

  const closeSheet = () => setIsOpen(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        {/* Logo */}
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">SecureSight</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center space-x-6 text-sm font-medium">
          <Link to="/solutions" className="transition-colors hover:text-primary">
            Solutions
          </Link>
          <Link to="/about" className="transition-colors hover:text-primary">
            About Us
          </Link>
          <Link to="/contact" className="transition-colors hover:text-primary">
            Contact Us
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <a href="https://github.com/armandatt" target="_blank" rel="noreferrer">
            <Button variant="ghost" size="icon">
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Button>
          </a>
          {isAuthenticated() ? (
            <>
              <Button size="sm" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button onClick={handleLogout} size="sm">
                LogOut
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link to="/sign-in">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden ml-auto">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-4">
                {/* Mobile Navigation Links */}
                <Link
                  to="/solutions"
                  className="text-lg font-medium transition-colors hover:text-primary"
                  onClick={closeSheet}
                >
                  Solutions
                </Link>
                <Link
                  to="/about"
                  className="text-lg font-medium transition-colors hover:text-primary"
                  onClick={closeSheet}
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  className="text-lg font-medium transition-colors hover:text-primary"
                  onClick={closeSheet}
                >
                  Contact Us
                </Link>

                {/* Divider */}
                <div className="border-t border-border my-4" />

                {/* Mobile Actions */}
                <div className="flex flex-col space-y-3">
                  <a href="https://github.com/armandatt" target="_blank" rel="noreferrer">
                    <Button variant="outline" className="w-full justify-start">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </Button>
                  </a>

                  {isAuthenticated() ? (
                    <>
                      <Button className="w-full" asChild onClick={closeSheet}>
                        <Link to="/dashboard">Dashboard</Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          handleLogout()
                          closeSheet()
                        }}
                      >
                        LogOut
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" className="w-full" asChild onClick={closeSheet}>
                        <Link to="/sign-in">Sign In</Link>
                      </Button>
                      <Button className="w-full" asChild onClick={closeSheet}>
                        <Link to="/sign-up">Sign Up</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
