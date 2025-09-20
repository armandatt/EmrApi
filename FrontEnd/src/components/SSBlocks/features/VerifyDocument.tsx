"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { FileText, ArrowLeft, Upload, CheckCircle, AlertTriangle, FileSearch, Percent } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const VerifyDocuments = () => {
  const [isScanning, setIsScanning] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [documentType, setDocumentType] = useState("academic")

  const handleScan = () => {
    setIsScanning(true)
    setScanComplete(false)
    setScanProgress(0)

    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          setScanComplete(true)
          return 100
        }
        return prev + 5
      })
    }, 300)
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
            <FileText className="h-5 w-5 text-green-500" />
            <h1 className="text-xl font-bold text-white">Verify Documents</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-8 md:px-10">

        <Alert className="mb-6 border-blue-500/20 bg-blue-500/10">
          <FileText className="h-4 w-4 text-blue-500" />
          <AlertTitle className="text-blue-500">Notice</AlertTitle>
          <AlertDescription className="text-gray-300">
            This feature is currently available only for educational institutions and enterprises with their own datasets.
            General users can use our{" "}
            <Link to="/ai-detection" className="text-blue-400 underline">
              AI Content Detection
            </Link>{" "}
            tool instead.
          </AlertDescription>
        </Alert>




        <Card className="mx-auto max-w-3xl bg-[#13151f] text-white">
          <CardHeader>
            <CardTitle>Document Plagiarism Checker</CardTitle>
            <CardDescription className="text-gray-400">
              Check academic papers, articles, and other documents for plagiarism
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isScanning && !scanComplete && (
              <div className="space-y-6">
                <div className="rounded-lg border border-dashed border-gray-700 bg-[#1c1f2e] p-10 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                    <Upload className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">Upload Document</h3>
                  <p className="mb-4 text-sm text-gray-400">Drag and drop your file here, or click to browse</p>
                  <p className="text-xs text-gray-500">Supports PDF, DOCX, TXT, RTF (Max 20MB)</p>
                  <Button className="mt-4 bg-green-500 text-white hover:bg-green-600" >Select File</Button>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="document-type" className="text-sm font-medium text-gray-300">
                      Document Type
                    </label>
                    <Select value={documentType} onValueChange={setDocumentType}>
                      <SelectTrigger className="border-gray-700 bg-[#1c1f2e] text-white">
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1c1f2e] text-white">
                        <SelectItem value="academic">Academic Paper</SelectItem>
                        <SelectItem value="article">Article/Blog Post</SelectItem>
                        <SelectItem value="report">Business Report</SelectItem>
                        <SelectItem value="creative">Creative Writing</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button disabled onClick={handleScan} className="w-full bg-green-500 text-white hover:bg-green-600">
                    Check for Plagiarism
                  </Button>
                </div>
              </div>
            )}

            {isScanning && (
              <div className="space-y-6 py-4">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20">
                      <FileSearch className="h-8 w-8 text-blue-500" />
                    </div>
                    <h3 className="mb-2 text-lg font-medium">Analyzing Document</h3>
                    <p className="text-sm text-gray-400">Comparing against our database of 10M+ academic sources</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Scanning document...</span>
                    <span>{scanProgress}%</span>
                  </div>
                  <Progress value={scanProgress} className="h-2 bg-gray-700" indicatorClassName="bg-green-500" />
                </div>

                <div className="space-y-2 rounded-lg bg-[#1c1f2e] p-4 text-sm">
                  <p className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Analyzing document structure...
                  </p>
                  <p className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Checking against academic databases...
                  </p>
                  <p className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Comparing with published journals...
                  </p>
                  {scanProgress > 50 && (
                    <p className="flex items-center gap-2 text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Scanning web content...
                    </p>
                  )}
                  {scanProgress > 75 && (
                    <p className="flex items-center gap-2 text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Generating final report...
                    </p>
                  )}
                </div>
              </div>
            )}

            {scanComplete && (
              <div className="space-y-6 py-4">
                <Alert className="border-yellow-500/20 bg-yellow-500/10">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <AlertTitle className="text-yellow-500">Potential Plagiarism Detected</AlertTitle>
                  <AlertDescription className="text-gray-300">
                    We've found some content that may be plagiarized. See the detailed report below.
                  </AlertDescription>
                </Alert>

                <Tabs defaultValue="summary" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-[#1c1f2e]">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="matches">Matches</TabsTrigger>
                    <TabsTrigger value="report">Report</TabsTrigger>
                  </TabsList>

                  <TabsContent value="summary" className="mt-4 space-y-4">
                    <div className="rounded-lg bg-[#1c1f2e] p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-medium">Plagiarism Score</h3>
                        <div className="flex items-center gap-2 rounded-full bg-yellow-500/20 px-3 py-1 text-sm text-yellow-500">
                          <span>Medium Risk</span>
                          <span className="font-bold">28%</span>
                        </div>
                      </div>
                      <div className="h-4 rounded-full bg-gray-700">
                        <div className="h-4 rounded-full bg-yellow-500" style={{ width: "28%" }}></div>
                      </div>
                      <div className="mt-2 flex justify-between text-xs text-gray-400">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg bg-[#1c1f2e] p-4">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-green-500/20 p-2">
                            <Percent className="h-4 w-4 text-green-500" />
                          </div>
                          <h3 className="font-medium">Original Content</h3>
                        </div>
                        <div className="mt-3 text-center">
                          <span className="text-3xl font-bold text-green-500">72%</span>
                          <p className="mt-1 text-sm text-gray-400">of your document is original</p>
                        </div>
                      </div>

                      <div className="rounded-lg bg-[#1c1f2e] p-4">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-yellow-500/20 p-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          </div>
                          <h3 className="font-medium">Matched Content</h3>
                        </div>
                        <div className="mt-3 text-center">
                          <span className="text-3xl font-bold text-yellow-500">28%</span>
                          <p className="mt-1 text-sm text-gray-400">matches other sources</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="matches" className="mt-4">
                    <div className="rounded-lg bg-[#1c1f2e] p-4">
                      <h3 className="mb-3 text-lg font-medium">Matched Content</h3>
                      <div className="space-y-4">
                        <div className="rounded border border-yellow-500/20 bg-yellow-500/10 p-3">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="font-medium text-white">Page 3 - Paragraph 2</span>
                            <span className="text-sm text-yellow-500">18% match</span>
                          </div>
                          <p className="text-sm text-gray-300">
                            "The implementation of machine learning algorithms has significantly improved the accuracy
                            of predictive models in various domains..."
                          </p>
                          <div className="mt-2">
                            <span className="text-xs text-gray-400">
                              Source: Journal of Machine Learning Research, Vol. 22, 2021
                            </span>
                          </div>
                        </div>

                        <div className="rounded border border-yellow-500/20 bg-yellow-500/10 p-3">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="font-medium text-white">Page 5 - Paragraph 4</span>
                            <span className="text-sm text-yellow-500">10% match</span>
                          </div>
                          <p className="text-sm text-gray-300">
                            "Data preprocessing is a crucial step in the machine learning pipeline as it directly
                            impacts the performance of the model..."
                          </p>
                          <div className="mt-2">
                            <span className="text-xs text-gray-400">
                              Source: Introduction to Data Science, Smith et al., 2020
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="report" className="mt-4">
                    <div className="rounded-lg bg-[#1c1f2e] p-4">
                      <h3 className="mb-3 text-lg font-medium">Detailed Report</h3>
                      <p className="mb-4 text-gray-300">
                        Download or share the complete plagiarism analysis report for this document.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Button className="bg-green-500 text-white hover:bg-green-600">Download PDF Report</Button>
                        <Button
                          variant="outline"
                          className="border-gray-700 text-gray-300 hover:bg-[#252a3d] hover:text-white"
                        >
                          Share Report
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-start border-t border-gray-800 text-sm text-gray-400">
            <p>Our document scanner checks content against academic journals, books, and billions of web pages.</p>
            <p className="mt-2">
              For AI-generated content detection, try our{" "}
              <Link to="/ai-detection" className="text-blue-400 hover:underline">
                AI Content Detection
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

export default VerifyDocuments

