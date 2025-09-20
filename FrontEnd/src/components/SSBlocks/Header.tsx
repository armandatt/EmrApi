import {Link} from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="py-4 px-6 bg-white shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">
          StreamLine
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link to="#features" className="text-gray-600 hover:text-primary">
            Features
          </Link>
          <Link to="#testimonials" className="text-gray-600 hover:text-primary">
            Testimonials
          </Link>
          <Link to="#pricing" className="text-gray-600 hover:text-primary">
            Pricing
          </Link>
        </nav>
        <Button>Get Started</Button>
        <hr />
      </div>
    </header>
  )
}

