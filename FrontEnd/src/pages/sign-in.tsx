"use client"

import type React from "react"

import { useState } from "react"
import {Link} from "react-router-dom"
import { Github } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
// import { Checkbox } from "@/components/ui/checkbox"
// import Navbar from "@/components/SSBlocks/NavBar"

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

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
        
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md bg-[#13151f] text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription className="text-gray-400">Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Enter your password"
                  required
                  className="border-gray-700 bg-[#1c1f2e] text-white"
                />
              </div>
              {/* <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  className="border-gray-700 data-[state=checked]:bg-white data-[state=checked]:text-[#0c0e16]"
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div> */}
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
            <Button variant="outline" className="w-full border-gray-700 text-black hover:bg-[#1c1f2e]">
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

