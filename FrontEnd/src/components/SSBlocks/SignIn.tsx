"use client"

import type React from "react"

import { useState } from "react"
import { Link , useNavigate } from "react-router-dom"
import { Github , Terminal} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
// import Header from "./Header"
import Footer from "./Footer"
import Navbar from "./NavBar"
import { BACKEND_URL } from "@/config"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import axios from "axios" ;
// import { Toast } from "../ui/toast"

const SignIn = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      rememberMe: checked,
    }))
  }

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, formData)
      const jwt = response.data.jwt

      if (jwt) {
        localStorage.setItem("token", jwt)

        console.log("signedIn")

        setTimeout(() => {
          navigate("/dashboard")
        }, 1500)
      }
    } catch (error) {
      alert("Error Signing In!\nPlease check your credentials and try again."),
      <Alert variant="destructive">
                <Terminal />
                <AlertTitle>Error Signing Up!</AlertTitle>
                <AlertDescription>
                    There was an error creating your account. Please try again!!
                </AlertDescription>
            </Alert>
      console.log("Invalid Credentials")
    } finally {
      // Always set loading to false
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0c0e16]">
        <Navbar></Navbar>
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md bg-[#13151f] text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription className="text-gray-400">Sign in to your account to continue</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">
                  Email
                </Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="border-gray-700 bg-[#1c1f2e] text-white"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-300">
                    Password
                  </Label>
                  <Link to="#" className="text-sm text-gray-400 hover:text-white">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="border-gray-700 bg-[#1c1f2e] text-white"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onCheckedChange={handleCheckboxChange}
                  className="border-gray-700 data-[state=checked]:bg-white data-[state=checked]:text-[#0c0e16]"
                />
                <label
                  htmlFor="rememberMe"
                  className="text-sm font-medium leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>

              <Button
                type="submit"
                className="mt-6 w-full bg-white text-[#0c0e16] hover:bg-gray-200"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="my-6 flex items-center">
              <Separator className="flex-1 bg-gray-700" />
              <span className="mx-4 text-sm text-gray-400">OR</span>
              <Separator className="flex-1 bg-gray-700" />
            </div>

            <Button variant="outline" className="w-full border-gray-700 text-white hover:bg-[#1c1f2e]">
              <Github className="mr-2 h-4 w-4" />
              Sign in with GitHub
            </Button>
          </CardContent>

          <CardFooter className="flex justify-center border-t border-gray-800 pt-4">
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <Link to="/sign-up" className="text-white hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>

      <Footer />
    </div>
  )
}

export default SignIn

