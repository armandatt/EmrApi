"use client"

import type React from "react"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Header } from "./Header"
import { BACKEND_URL } from "@/config"
import axios from "axios"
import { Alert, AlertTitle, AlertDescription } from "./ui/alert"

const SignIn = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errorMsg, setErrorMsg] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg("")

    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, formData)

      const jwt = response.data.token
      if (jwt) {
        localStorage.setItem("token", jwt)
        console.log("signedIn")
        navigate("/dashboard")
      }
    } catch (error: any) {
      console.error("Signin error:", error.response?.data || error.message)
      setErrorMsg("Error Signing In! Please check your credentials and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0c0e16]">
      <Header />

      <main className="flex flex-1 items-center justify-center px-6 py-12 pt-24">
        <Card className="w-full max-w-md bg-[#13151f] text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription className="text-gray-400">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  value={formData.email}
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

              {errorMsg && (
                <Alert variant="destructive">
                  <AlertTitle>Error Signing In!</AlertTitle>
                  <AlertDescription>{errorMsg}</AlertDescription>
                </Alert>
              )}

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

            <Button variant="outline" className="w-full border-gray-700 text-black hover:bg-gray-200">
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
      <footer className="border-t border-gray-800 py-6 text-center text-sm text-gray-400">
        <p>© 2025 Medi-Link All rights reserved.</p>
      </footer>
    </div>
  )
}

export default SignIn
