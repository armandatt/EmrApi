import { motion } from "framer-motion"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"
import { useNavigate } from "react-router-dom"

export function Header() {
  const headerRef = useRef(null)

  useGSAP(() => {
    gsap.from(headerRef.current, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      delay: 2,
    })
  }, [])

  const navigate = useNavigate();

  const isAuthenticated =
    !!localStorage.getItem("token") && localStorage.getItem("token") !== "null";

  function LogOut() {
    localStorage.removeItem("token");
    navigate("/sign-in");
  }

  // 👇 helper function to scroll to any section
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 px-4 py-2">
      <div className="container mx-auto flex justify-between items-center bg-black/30 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
        {/* Logo */}
        <a href="/" className="text-white font-bold text-xl">
          Medi-Link
        </a>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-white text-sm">
          <button
            onClick={() => scrollToSection("portfolio")}
            className="hover:text-neutral-300 transition-colors"
          >
            Solution
          </button>
          <button
            onClick={() => scrollToSection("blog")}
            className="hover:text-neutral-300 transition-colors"
          >
            Insights
          </button>
          <a href="contact" className="hover:text-neutral-300 transition-colors">
            Contact
          </a>
        </nav>

        {/* Button */}
        {isAuthenticated ? (
          <motion.button
            onClick={LogOut}
            className="bg-white text-black font-medium py-2 px-4 rounded-md text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            LogOut
          </motion.button>
        ) : (
          <a href="/sign-in">
            <motion.button
              className="bg-white text-black font-medium py-2 px-4 rounded-md text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              SignIn/SignUp
            </motion.button>
          </a>
        )}
      </div>
    </motion.header>
  )
}
