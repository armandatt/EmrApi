import { Routes, Route } from "react-router-dom"
import { Header } from "./components/Header"
// import { Footer } from "@/components/Footer"
import { GSAPProvider } from "@/components/GSAPProvider"
import { TransitionProvider } from "@/components/TransitionProvider"
import HomePage from "@/pages/HomePage"
import ContactPage from "@/pages/Contact"
import BlogPage from "@/pages/BlogPage"
import { UserDashboardEmr } from './components/UserDashboardEmr';
// import BlogPostPage from "./pages/BlogPostPage"
import "./index.css"
import PortfolioProjectPage from "@/pages/PortfolioProjectPage"
import SignIn from "./components/Signin"
import SignUp from "./components/SignUp"

function App() {
  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      <GSAPProvider>
        <TransitionProvider>
          {/* <Header /> */}
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/dashboard" element={<UserDashboardEmr />} />
              {/* <Route path="/blog/:slug" element={<BlogPostPage />} /> */}
              <Route path="/portfolio/:slug" element={<PortfolioProjectPage />} />
            </Routes>
          </main>
        </TransitionProvider>
      </GSAPProvider>
    </div>
  )
}

export default App
