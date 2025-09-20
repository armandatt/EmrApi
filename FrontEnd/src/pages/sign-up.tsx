"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Github } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/Header" // ✅ Add your fixed navbar

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [headerHeight, setHeaderHeight] = useState(0)

  useEffect(() => {
    const header = document.querySelector("header")
    if (header) {
      setHeaderHeight(header.offsetHeight)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0c0e16]">
      <Header />

      {/* ✅ Dynamic padding so content sits below Navbar */}
      <main
        className="flex flex-1 items-center justify-center px-6 py-12"
        style={{ paddingTop: headerHeight + 20 }}
      >
        <Card className="w-full max-w-md bg-[#13151f] text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription className="text-gray-400">
              Enter your information to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  required
                  className="border-gray-700 bg-[#1c1f2e] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="border-gray-700 bg-[#1c1f2e] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  required
                  className="border-gray-700 bg-[#1c1f2e] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-gray-300">
                  Confirm Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  required
                  className="border-gray-700 bg-[#1c1f2e] text-white"
                />
              </div>
              <Button
                type="submit"
                className="mt-6 w-full bg-white text-[#0c0e16] hover:bg-gray-200"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
            <div className="my-6 flex items-center">
              <Separator className="flex-1 bg-gray-700" />
              <span className="mx-4 text-sm text-gray-400">OR</span>
              <Separator className="flex-1 bg-gray-700" />
            </div>
            <Button variant="outline" className="w-full border-gray-700 text-white hover:bg-[#1c1f2e]">
              <Github className="mr-2 h-4 w-4" />
              Sign up with GitHub
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-gray-800 pt-4">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link to="/sign-in" className="text-white hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>

      <footer className="border-t border-gray-800 py-6 text-center text-sm text-gray-400">
        <p>© 2025 Medi-Link. All rights reserved.</p>
      </footer>
    </div>
  )
}


