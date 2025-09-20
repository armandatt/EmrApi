"use client"

import type React from "react"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Github, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
// import Header from "./Header"
import Footer from "./Footer"
import Navbar from "./NavBar"
import { BACKEND_URL } from "@/config"
import axios from "axios"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const SignUp = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        password: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData((prev) => ({ ...prev, [id]: value }))
    }

    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const responce = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, formData)
            const jwt = responce.data.jwt
            if (!jwt) {
            alert("Signup failed: User Already Exist.");
            setIsLoading(false)
            return;
  }
            console.log("JWT:", jwt)
            localStorage.setItem("token", jwt)
            navigate("/dashboard")


        } catch (error) {
            alert("Error Signing Up!\nPlease check your credentials and try again."),
            <Alert variant="destructive">
                <Terminal />
                <AlertTitle>Error Signing Up!</AlertTitle>
                <AlertDescription>
                    There was an error creating your account. Please try again!!
                </AlertDescription>
            </Alert>
            console.log(error)

            setTimeout(() => {
                console.log("Form submitted:", formData)
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
                        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                        <CardDescription className="text-gray-400">Enter your information to get started</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-gray-300">
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                    required
                                    className="border-gray-700 bg-[#1c1f2e] text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-gray-300">
                                    Email
                                </Label>
                                <Input
                                    type="email"
                                    id="username"
                                    value={formData.username}
                                    onChange={handleChange}
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
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
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

            <Footer />
        </div>
    )
}


export default SignUp