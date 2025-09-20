"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Shield,
  Code,
  FileText,
  CheckCircle,
  AlertTriangle,
  GitBranch,
  Loader2,
  Sparkles,
  LogOut,
  ArrowLeft,
} from "lucide-react"
import axios from "axios"
import { BACKEND_URL } from "@/config"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar } from "@radix-ui/react-avatar"
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNavigate } from "react-router-dom"

const scanSteps = [
  { id: 1, title: "Cloning repository...", description: "Fetching repository data" },
  { id: 2, title: "Analyzing code structure...", description: "Examining file patterns" },
  { id: 3, title: "Detecting similarities...", description: "Comparing with database" },
  { id: 4, title: "Processing README...", description: "Evaluating documentation" },
  { id: 5, title: "Calculating scores...", description: "Generating analysis report" },
  { id: 6, title: "Finalizing results...", description: "Preparing dashboard" },
  { id: 7, title: "Scan complete!", description: "Analysis ready for review" },
]

export default function RepoAnalysisPage() {
  const [repoUrl, setRepoUrl] = useState("")
  const [isScanned, setIsScanned] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [user, setUser] = useState<any>(null)

  const handleScan = async () => {
    setIsScanning(true)
    setIsScanned(false)
    setCurrentStep(0)
    setProgress(0)

    const token = localStorage.getItem("token")

    const scanSteps = [
      "Cloning repository...",
      "Analyzing code structure...",
      "Detecting similarities...",
      "Processing README content...",
      "Calculating originality scores...",
      "Generating final report...",
      "Scan complete!",
    ]

    try {
      const backendPromise = axios.post(
        `${BACKEND_URL}/api/v1/verify/verifyWebsite`,
        { url: repoUrl },
        {
          headers: {
            Authorization: ` ${token}`,
            "Content-Type": "application/json",
          },
        },
      )

      let backendResponse: { data?: any } | null = null

      for (let i = 0; i < scanSteps.length; i++) {
        setCurrentStep(i)

        // Adjust timing for ~1 minute total: each step takes 8-10 seconds
        const stepDuration = 8000 + Math.random() * 2000

        // Calculate target progress for current step
        const stepProgress = ((i + 1) / scanSteps.length) * 100

        // Animate progress for current step
        await new Promise((resolve) => {
          const startTime = Date.now()
          const animate = () => {
            const elapsed = Date.now() - startTime
            const currentProgress = Math.min(stepProgress, (elapsed / stepDuration) * stepProgress)
            setProgress(currentProgress)

            if (elapsed < stepDuration) {
              requestAnimationFrame(animate)
            } else {
              resolve(void 0)
            }
          }
          animate()
        })

        if (i >= 4 && !backendResponse) {
          try {
            backendResponse = await Promise.race([
              backendPromise,
              new Promise<{ data?: any } | null>((resolve) => setTimeout(() => resolve(null), 100)),
            ]) as { data?: any } | null
          } catch (error) {
            // Backend still processing, continue animation
          }
        }
      }

      if (!backendResponse) {
        backendResponse = await backendPromise
      }

      console.log("Response from backend:", backendResponse.data)
      setAiAnalysis(backendResponse.data.PlagiarismAnalysis)
      setIsScanned(true)
    } catch (error) {
      console.error("Error scanning repo:", error)
    } finally {
      setIsScanning(false)
    }
  }




  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/verify/getUserData`, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        })
        if (response.status === 200) {
          setUser(response.data)
        }
      } catch (err) {
        console.error("Error fetching user", err)
      }
    }

    fetchUser()
  }, [])

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    // setUser(null); // Remove or implement setUser if needed
    navigate("/sign-in")
  }

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: "#090e27" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-10 border-b border-slate-700/30 backdrop-blur-xl"
        style={{ backgroundColor: "#0d0e16" }}
      >
        <div className="flex items-center justify-between h-16 px-6 md:px-10">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-300 hover:text-white transition-all duration-200 hover:bg-slate-700/50"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Go back</span>
            </Button>

            <div className="flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-md">
              <Shield className="h-6 w-6" style={{ color: "#5068c9" }} />
              <span className="text-xl font-bold tracking-tight text-white">SecureSight</span>
            </div>

            <Badge
              variant="outline"
              className="border-blue-400/50 text-white flex items-center gap-1"
              style={{ backgroundColor: "#5068c9", borderColor: "#5068c9" }}
            >
              <Sparkles className="h-3 w-3" />
              <span>Premium</span>
            </Badge>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* <Button
              variant="outline"
              size="icon"
              className="border-slate-600/50 text-slate-300 hover:text-white transition-all duration-200 bg-transparent"
              style={{ backgroundColor: "#0d0e16", borderColor: "#5068c9" }}
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="border-slate-600/50 text-slate-300 hover:text-white transition-all duration-200 bg-transparent"
              style={{ backgroundColor: "#0d0e16", borderColor: "#5068c9" }}
            >
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button> */}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative p-0 h-8 w-8 rounded-full overflow-hidden hover:bg-transparent focus:ring-0 focus:outline-none"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-[#5068c9]">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="User"
                      className="h-8 w-8 rounded-full"
                    />
                    <AvatarFallback
                      className="h-8 w-8 flex items-center justify-center rounded-full text-white font-semibold"
                      style={{ background: "linear-gradient(135deg, #5068c9, #7c3aed)" }}
                    >
                      {user?.name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("") || "US"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-56 backdrop-blur-xl border-slate-600/50 text-white"
                style={{ backgroundColor: "#0d0e16" }}
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name || "Loading..."}</p>
                    <p className="text-xs leading-none text-slate-400">{user?.username || ""}</p>
                  </div>
                </DropdownMenuLabel>

                {/* <DropdownMenuSeparator className="bg-slate-600/50" />

                <DropdownMenuItem className="text-slate-300 hover:bg-slate-700/50 hover:text-white">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>

                <DropdownMenuItem className="text-slate-300 hover:bg-slate-700/50 hover:text-white">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Security</span>
                </DropdownMenuItem> */}

                <DropdownMenuSeparator className="bg-slate-600/50" />

                <DropdownMenuItem className="text-slate-300 hover:bg-slate-700/50 hover:text-white">
                  <Button onClick={handleLogout} className="w-full text-left flex items-center gap-2">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {" "}
        {/* increased py-8 to py-12 to move content down from navbar */}
        {/* Repository Input */}
        <Card
          className="mb-8 backdrop-blur-sm border-slate-600/30 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
          style={{ backgroundColor: "#0d0e16" }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <GitBranch className="h-15 w-5 animate-pulse" style={{ color: "#5068c9" }} />
              Enter GitHub Repository Link
              <Badge variant="destructive" className="ml-2 animate-bounce bg-red-500/20 text-red-400 border-red-500/50">
                README required
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                className="flex-1 border-slate-600/50 text-white placeholder:text-slate-400 transition-all duration-200 focus:scale-[1.02]"
                style={{ backgroundColor: "#090e27" }}
                disabled={isScanning}
              />
              <Button
                onClick={handleScan}
                disabled={isScanning}
                className="hover:scale-105 transition-all duration-200 disabled:opacity-50 text-white"
                style={{ backgroundColor: "#5068c9" }}
              >
                {isScanning ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                {isScanning ? "Scanning..." : "Scan"}
              </Button>
            </div>
          </CardContent>
        </Card>
        {isScanning && (
          <Card
            className="mb-8 border-blue-500/30 animate-in slide-in-from-top duration-500"
            style={{ background: "linear-gradient(135deg, #5068c9/20, #7c3aed/20)", backgroundColor: "#0d0e16" }}
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <GitBranch className="h-6 w-6 animate-pulse" style={{ color: "#5068c9" }} />
                      <div
                        className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping"
                        style={{ backgroundColor: "#5068c9" }}
                      ></div>
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: "#5068c9" }}>
                        {scanSteps[currentStep]?.title}
                      </h3>
                      <p className="text-sm text-slate-400">{scanSteps[currentStep]?.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold" style={{ color: "#5068c9" }}>
                      {Math.round(progress)}%
                    </div>
                    <div className="text-sm text-slate-400">
                      Step {currentStep + 1} of {scanSteps.length}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Progress
                    value={progress}
                    className="h-3 transition-all duration-300"
                    style={{ backgroundColor: "#090e27" }}
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>0%</span>
                    <span className="animate-pulse">Processing...</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Step indicators */}
                <div className="flex justify-between items-center pt-2">
                  {scanSteps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex flex-col items-center transition-all duration-300 ${index <= currentStep ? "" : "text-slate-600"
                        }`}
                      style={{ color: index <= currentStep ? "#5068c9" : undefined }}
                    >
                      <div
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index < currentStep
                          ? "scale-110"
                          : index === currentStep
                            ? "animate-pulse scale-125"
                            : "bg-slate-600"
                          }`}
                        style={{ backgroundColor: index <= currentStep ? "#5068c9" : undefined }}
                      />
                      <span className="text-xs mt-1 hidden sm:block">{step.id}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Scan Status */}
        {isScanned && !isScanning && (
          <Card
            className="mb-8 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-green-500/30 animate-in slide-in-from-top duration-500"
            style={{ backgroundColor: "#0d0e16" }}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-400 animate-pulse" />
                <div>
                  <h3 className="font-semibold text-green-300">Scan Complete</h3>
                  <p className="text-sm text-slate-400">We've analyzed the repository content for plagiarism.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Analysis Tabs - Only show when scan is complete */}
        {isScanned && !isScanning && (
          <Tabs defaultValue="summary" className="space-y-6">
            <TabsList
              className="grid w-full grid-cols-3 border border-slate-600/50"
              style={{ backgroundColor: "#0d0e16" }}
            >
              <TabsTrigger
                value="summary"
                className="text-slate-300 transition-all duration-200 hover:scale-105 data-[state=active]:text-white data-[state=active]:bg-[#5068c9]"
                style={{ backgroundColor: "#090e27" }}
              >
                Summary
              </TabsTrigger>
              <TabsTrigger
                value="code"
                className="text-slate-300 transition-all duration-200 hover:scale-105 data-[state=active]:text-white data-[state=active]:bg-[#5068c9]"
                style={{ backgroundColor: "#090e27" }}
              >
                Code
              </TabsTrigger>
              <TabsTrigger
                value="readme"
                className="text-slate-300 transition-all duration-200 hover:scale-105 data-[state=active]:text-white data-[state=active]:bg-[#5068c9]"
                style={{ backgroundColor: "#090e27" }}
              >
                README
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-6 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Overall Plagiarism */}
                <Card
                  className="backdrop-blur-sm border-slate-600/30 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  style={{ backgroundColor: "#0d0e16" }}
                >
                  <CardHeader>
                    <CardTitle className="text-white">Overall Plagiarism</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="relative">
                      <div className="flex items-center justify-center">
                        <div className="relative w-32 h-32">
                          <svg
                            className="w-32 h-32 transform -rotate-90 transition-transform duration-1000 hover:rotate-0"
                            viewBox="0 0 36 36"
                          >
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="text-slate-600"
                            />
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#ff6b35"
                              strokeWidth="2"
                              strokeDasharray="58, 100"
                              className="animate-pulse"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl font-bold hover:scale-110 transition-transform duration-200 text-white">
                              {aiAnalysis ? `${aiAnalysis.overallPlagiarismScore}%` : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-center text-sm text-slate-400 mt-2">Based on code similarity detection</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 hover:translate-x-2 transition-transform duration-200">
                        <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                        <Badge
                          variant="secondary"
                          className="bg-green-400/20 text-green-300 hover:scale-105 transition-transform duration-200 border-green-400/50"
                        >
                          {aiAnalysis ? aiAnalysis.IdeaUniqueness : "N/A"}
                        </Badge>
                        <span className="text-sm text-slate-300">Idea Uniqueness</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                        <span className="text-sm text-slate-400">
                          Human-like comments: {aiAnalysis.hasHumanComments ? "Present" : "Absent"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Code Analysis */}
                <Card
                  className="backdrop-blur-sm border-slate-600/30 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  style={{ backgroundColor: "#0d0e16" }}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Code className="h-5 w-5 animate-pulse" style={{ color: "#5068c9" }} />
                      Code Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-300">Original Code Score</span>
                        <span className="text-orange-400 font-bold hover:scale-110 transition-transform duration-200">
                          {aiAnalysis ? ` ${100 - aiAnalysis.AdjustedCodeScore}%` : "N/A"}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-1000"
                          style={{
                            width: `${100 - aiAnalysis?.AdjustedCodeScore || 0}%`,
                            backgroundColor: "#5068c9",
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-slate-400 mt-1">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-600/50">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-4 w-4 text-green-400 animate-pulse" />
                        <span className="font-medium text-slate-300">README Analysis</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-300">Idea Originality Score</span>
                        <Badge
                          variant="destructive"
                          className="animate-bounce bg-red-500/20 text-red-400 border-red-500/50"
                        >
                          {aiAnalysis ? `${100 - aiAnalysis.ReadmeScore}%` : "N/A"}
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-1000"
                          style={{
                            width: `${100 - aiAnalysis?.ReadmeScore || 0}%`,
                            backgroundColor: "#5068c9",
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-slate-400 mt-1">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bottom Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card
                  className="backdrop-blur-sm border-slate-600/30 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
                  style={{ backgroundColor: "#0d0e16" }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg transition-colors duration-200"
                        style={{ backgroundColor: "#5068c9/20" }}
                      >
                        <GitBranch className="h-4 w-4" style={{ color: "#5068c9" }} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-300">Fork Status</p>
                        <Badge
                          variant="secondary"
                          className="text-slate-400 hover:scale-105 transition-transform duration-200 border-slate-600/50"
                          style={{ backgroundColor: "#090e27" }}
                        >
                          {aiAnalysis.isForked ? "Forked" : "Original"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="backdrop-blur-sm border-slate-600/30 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
                  style={{ backgroundColor: "#0d0e16" }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg transition-colors duration-200"
                        style={{ backgroundColor: "#5068c9/20" }}
                      >
                        <FileText className="h-4 w-4" style={{ color: "#5068c9" }} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-300">Human Comments</p>
                        <Badge
                          variant="destructive"
                          className="animate-pulse bg-red-500/20 text-red-400 border-red-500/50"
                        >
                          {aiAnalysis.hasHumanComments ? "Present" : "Absent"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="backdrop-blur-sm border-slate-600/30 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
                  style={{ backgroundColor: "#0d0e16" }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg transition-colors duration-200"
                        style={{ backgroundColor: "#5068c9/20" }}
                      >
                        <Code className="h-4 w-4" style={{ color: "#5068c9" }} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-300">Random Variables</p>
                        <Badge
                          variant="secondary"
                          className="text-slate-400 hover:scale-105 transition-transform duration-200 border-slate-600/50"
                          style={{ backgroundColor: "#090e27" }}
                        >
                          {aiAnalysis.hasRandomVariableNames ? "Yes" : "No"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="backdrop-blur-sm border-slate-600/30 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
                  style={{ backgroundColor: "#0d0e16" }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg transition-colors duration-200"
                        style={{ backgroundColor: "#5068c9/20" }}
                      >
                        <AlertTriangle className="h-4 w-4" style={{ color: "#5068c9" }} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-300">Structural Match</p>
                        <Badge
                          variant="destructive"
                          className="animate-pulse bg-red-500/20 text-red-400 border-red-500/50"
                        >
                          {aiAnalysis.hasHighStructuralMatch ? "Yes" : "No"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="code" className="space-y-6 animate-in fade-in duration-500">
              <Card
                className="backdrop-blur-sm border-slate-600/30 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
                style={{ backgroundColor: "#0d0e16" }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Code className="h-5 w-5 animate-pulse" style={{ color: "#5068c9" }} />
                    Code Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-slate-300">Code Scores</h4>
                      <div className="space-y-4">
                        <div className="hover:translate-x-2 transition-transform duration-200">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-slate-300">Original Code Score</span>
                            <span className="text-sm font-medium text-orange-400">{100 - aiAnalysis.OriginalCodeScore}</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-1000"
                              style={{
                                width: "50%",
                                backgroundColor: "#5068c9",
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="hover:translate-x-2 transition-transform duration-200">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-slate-300">Adjusted Code Score</span>
                            <span className="text-sm font-medium text-orange-400">{100 - aiAnalysis.AdjustedCodeScore}</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-1000"
                              style={{
                                width: `${100 - aiAnalysis?.AdjustedCodeScore || 0}%`,
                                backgroundColor: "#5068c9",
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-slate-300">Code Analysis Flags</h4>
                      <div className="space-y-3">
                        <div
                          className="flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:scale-105"
                          style={{ backgroundColor: "#090e27" }}
                        >
                          <span className="text-sm text-slate-300">Is Fork</span>
                          <Badge
                            variant="secondary"
                            className="text-blue-400 border-blue-500/50"
                            style={{ backgroundColor: "#5068c9/20" }}
                          >
                            {aiAnalysis.isForked ? "True" : "False"}
                          </Badge>
                        </div>
                        <div
                          className="flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:scale-105"
                          style={{ backgroundColor: "#090e27" }}
                        >
                          <span className="text-sm text-slate-300">High Structural Match</span>
                          <Badge
                            variant="secondary"
                            className="text-blue-400 border-blue-500/50"
                            style={{ backgroundColor: "#5068c9/20" }}
                          >
                            {aiAnalysis.hasHighStructuralMatch ? "True" : "False"}
                          </Badge>
                        </div>
                        <div
                          className="flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:scale-105"
                          style={{ backgroundColor: "#090e27" }}
                        >
                          <span className="text-sm text-slate-300">Human Comments</span>
                          <Badge
                            variant="secondary"
                            className="text-blue-400 border-blue-500/50"
                            style={{ backgroundColor: "#5068c9/20" }}
                          >
                            {aiAnalysis.hasHumanComments ? "True" : "False"}
                          </Badge>
                        </div>
                        <div
                          className="flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:scale-105"
                          style={{ backgroundColor: "#090e27" }}
                        >
                          <span className="text-sm text-slate-300">Random Variable Names</span>
                          <Badge
                            variant="secondary"
                            className="text-blue-400 border-blue-500/50"
                            style={{ backgroundColor: "#5068c9/20" }}
                          >
                            {aiAnalysis.hasRandomVariableNames ? "True" : "False"}
                          </Badge>
                        </div>
                        <div
                          className="flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:scale-105"
                          style={{ backgroundColor: "#090e27" }}
                        >
                          <span className="text-sm text-slate-300">Large Duplicated Blocks</span>
                          <Badge
                            variant="secondary"
                            className="text-blue-400 border-blue-500/50"
                            style={{ backgroundColor: "#5068c9/20" }}
                          >
                            {aiAnalysis.hasLargeDuplicatedBlocks ? "True" : "False"}
                          </Badge>
                        </div>
                        <div
                          className="flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:scale-105"
                          style={{ backgroundColor: "#090e27" }}
                        >
                          <span className="text-sm text-slate-300">Identical Dependency List</span>
                          <Badge
                            variant="secondary"
                            className="text-blue-400 border-blue-500/50"
                            style={{ backgroundColor: "#5068c9/20" }}
                          >
                            {aiAnalysis.hasIdenticalDependencyList ? "True" : "False"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3 text-slate-300">Code Summary</h4>
                      <div
                        className="p-4 rounded-lg border border-slate-600/50 transition-all duration-200"
                        style={{ backgroundColor: "#090e27" }}
                      >
                        <p className="text-sm text-slate-400">{aiAnalysis.codeSummary || "No summary available."}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="readme" className="space-y-6 animate-in fade-in duration-500">
              <Card
                className="backdrop-blur-sm border-slate-600/30 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
                style={{ backgroundColor: "#0d0e16" }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <FileText className="h-5 w-5 animate-pulse" style={{ color: "#5068c9" }} />
                    README Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-4 text-slate-300">README Metrics</h4>
                      <div className="space-y-4">
                        <div className="hover:translate-x-2 transition-transform duration-200">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-slate-300">README Score</span>
                            <span className="text-sm font-medium text-orange-400">{100 - aiAnalysis.ReadmeScore}</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-1000"
                              style={{
                                width: `${aiAnalysis?.ReadmeScore || 0}%`,
                                backgroundColor: "#5068c9",
                              }}
                            ></div>
                          </div>
                        </div>
                        <div
                          className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:scale-105"
                          style={{ backgroundColor: "#5068c9/20" }}
                        >
                          <CheckCircle className="h-5 w-5 animate-pulse" style={{ color: "#5068c9" }} />
                          <div>
                            <span className="text-sm font-medium text-slate-300">Idea Uniqueness</span>
                            <Badge
                              variant="secondary"
                              className="ml-2 text-green-400 border-green-500/50"
                              style={{ backgroundColor: "#5068c9/20" }}
                            >
                              {aiAnalysis.IdeaUniqueness}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-4 text-slate-300">Content Analysis</h4>
                      <div className="space-y-4">
                        <div>
                          <h5 className="text-sm font-medium mb-2 text-slate-300">README Summary</h5>
                          <div
                            className="p-3 rounded-lg border border-slate-600/50 transition-all duration-200"
                            style={{ backgroundColor: "#090e27" }}
                          >
                            <p className="text-sm text-slate-400">
                              {aiAnalysis.readmeSummary || "No summary available."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}


