"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Mail, ArrowLeft,  AlertTriangle, Shield, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from "axios"
import { BACKEND_URL } from "@/config"

const PhishingEmails = () => {
  const [emailContent, setEmailContent] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailContent) return

    setIsScanning(true)
    setScanComplete(false)
    setScanProgress(0)

    const token = localStorage.getItem("token");

    const response = await axios.post(`${BACKEND_URL}/api/v1/verify/verifyEmail`, { emailContent } ,{ headers : { Authorization: `${token}` }} )
    setAiAnalysis(response.data.phishingAnalysis)

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          setScanComplete(true)
          return 100
        }
        return prev + 10
      })
    }, 100)
  }


  const renderActions = () => {
    if (!aiAnalysis?.riskScore || aiAnalysis.riskScore === "N/A") return null
    const score = aiAnalysis.riskScore

    if (score <= 40) {
      return (
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-start gap-2">
            <Shield className="mt-0.5 h-4 w-4 text-green-500" />
            <div>
              <span className="font-medium text-white">Mark as Safe</span>
              <p className="text-sm text-gray-400">This email appears to be safe. No immediate action required.</p>
            </div>
          </li>
        </ul>
      )
    } else if (score > 40 && score <= 70) {
      return (
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-start gap-2">
            <Shield className="mt-0.5 h-4 w-4 text-yellow-500" />
            <div>
              <span className="font-medium text-white">Review Carefully</span>
              <p className="text-sm text-gray-400">The email contains potential risks. Proceed with caution.</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <Shield className="mt-0.5 h-4 w-4 text-yellow-500" />
            <div>
              <span className="font-medium text-white">Report Suspicious</span>
              <p className="text-sm text-gray-400">If anything seems unusual, report it to your IT team.</p>
            </div>
          </li>
        </ul>
      )
    } else {
      return (
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-start gap-2">
            <Shield className="mt-0.5 h-4 w-4 text-red-500" />
            <div>
              <span className="font-medium text-white">Do Not Respond</span>
              <p className="text-sm text-gray-400">Do not reply or interact with this email.</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <Shield className="mt-0.5 h-4 w-4 text-red-500" />
            <div>
              <span className="font-medium text-white">Report Phishing</span>
              <p className="text-sm text-gray-400">Report this email to your security team immediately.</p>
            </div>
          </li>
        </ul>
      )
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0c0e16]">
      <header className="border-b border-gray-800 bg-[#0c0e16]">
        <div className="flex h-16 items-center px-6 md:px-10">
          <Button asChild variant="ghost" className="mr-4 text-gray-300 hover:text-white">
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-red-500" />
            <h1 className="text-xl font-bold text-white">Phishing Emails</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-8 md:px-10">
        <Card className="mx-auto max-w-3xl bg-[#13151f] text-white">
          <CardHeader>
            <CardTitle>Phishing Email Detector</CardTitle>
            <CardDescription className="text-gray-400">
              Analyze emails to detect phishing attempts and security threats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleScan} className="space-y-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="email-content" className="text-sm font-medium text-gray-300">
                  Paste Email Content
                </label>
                <Textarea
                  id="email-content"
                  placeholder="Paste the full email content including headers..."
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  rows={8}
                  className="border-gray-700 bg-[#1c1f2e] text-white"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  type="submit"
                  disabled={isScanning || !emailContent}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  {isScanning ? "Analyzing..." : "Analyze Email"}
                </Button>
                {/* <Button
                  type="button"
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-[#1c1f2e] hover:text-white"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Email File
                </Button> */}
              </div>
            </form>

            {isScanning && (
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Analyzing email content...</span>
                  <span>{scanProgress}%</span>
                </div>
                <Progress value={scanProgress} className="h-2 bg-gray-700" indicatorClassName="bg-red-500" />
              </div>
            )}

            {scanComplete && aiAnalysis && (
              <div className="mt-6 space-y-4">
                <Alert className="border-red-500/20 bg-red-500/10">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <AlertTitle className="text-red-500">Phishing Detected</AlertTitle>
                  <AlertDescription className="text-gray-300">
                    This email contains multiple indicators of a phishing attempt.
                  </AlertDescription>
                </Alert>

                <Tabs defaultValue="threats" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-[#1c1f2e]">
                    <TabsTrigger value="threats">Threats</TabsTrigger>
                    <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    <TabsTrigger value="actions">Actions</TabsTrigger>
                  </TabsList>

                  <TabsContent value="threats" className="mt-4 space-y-4">
                    <div className="rounded-lg bg-[#1c1f2e] p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-medium">Threat Assessment</h3>
                        <div className="flex items-center gap-2 rounded-full bg-red-500/20 px-3 py-1 text-sm text-red-500">
                          <span>
                            {aiAnalysis.riskScore !== "N/A" && parseInt(aiAnalysis.riskScore) > 70
                              ? "High Risk"
                              : parseInt(aiAnalysis.riskScore) > 40
                              ? "Medium Risk"
                              : "Low Risk"}
                          </span>
                          <span className="font-bold">
                            {aiAnalysis.riskScore !== "N/A" ? `${aiAnalysis.riskScore}%` : "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className="h-4 rounded-full bg-gray-700">
                        <div
                          className="h-4 rounded-full bg-red-500"
                          style={{ width: aiAnalysis.riskScore !== "N/A" ? `${aiAnalysis.riskScore}%` : "0%" }}
                        ></div>
                      </div>
                    </div>

                    <div className="rounded-lg bg-[#1c1f2e] p-4">
                      <h3 className="mb-3 text-lg font-medium">Detected Threats</h3>
                      <ul className="space-y-3 text-gray-300">
                        {aiAnalysis.detectedThreats.split("*").map((threat: string, index: number) =>
                          threat.trim() ? (
                            <li key={index} className="flex items-start gap-2">
                              <X className="mt-0.5 h-4 w-4 text-red-500" />
                              <div className="text-sm text-gray-300">{threat.trim()}</div>
                            </li>
                          ) : null
                        )}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="analysis" className="mt-4">
                    <div className="rounded-lg bg-[#1c1f2e] p-4">
                      <h3 className="mb-3 text-lg font-medium">Link Analysis</h3>
                      <p className="text-sm text-gray-300">{aiAnalysis.linkAnalysis}</p>
                    </div>
                  </TabsContent>

                  

                  <TabsContent value="actions" className="mt-4">
                    <div className="rounded-lg bg-[#1c1f2e] p-4">
                      <h3 className="mb-3 text-lg font-medium">Recommended Actions</h3>
                      {renderActions()}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-start border-t border-gray-800 text-sm text-gray-400">
            <p>
              Our phishing detection engine uses advanced AI to identify even the most sophisticated phishing attempts.
            </p>
            <p className="mt-2">
              For website security checks, try our {" "}
              <Link to="/verify-websites" className="text-blue-400 hover:underline">
                Website Verification
              </Link>{" "}
              tool.
            </p>
          </CardFooter>
        </Card>
      </main>

      <footer className="border-t border-gray-800 py-6 text-center text-sm text-gray-400">
        <p>© 2025 SecureSight. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default PhishingEmails


