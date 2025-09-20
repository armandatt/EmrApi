// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Search, Shield, Code, FileText, CheckCircle, AlertTriangle, XCircle, GitBranch, Loader2 } from "lucide-react"
// import axios from "axios"
// import { BACKEND_URL } from "@/config"

// const scanSteps = [
//   { id: 1, title: "Cloning repository...", description: "Fetching repository data" },
//   { id: 2, title: "Analyzing code structure...", description: "Examining file patterns" },
//   { id: 3, title: "Detecting similarities...", description: "Comparing with database" },
//   { id: 4, title: "Processing README...", description: "Evaluating documentation" },
//   { id: 5, title: "Calculating scores...", description: "Generating analysis report" },
//   { id: 6, title: "Finalizing results...", description: "Preparing dashboard" },
//   { id: 7, title: "Scan complete!", description: "Analysis ready for review" },
// ]

// export default function RepoAnalysisPage() {
//   const [repoUrl, setRepoUrl] = useState("")
//   const [isScanned, setIsScanned] = useState(false)
//   const [isScanning, setIsScanning] = useState(false)
//   const [currentStep, setCurrentStep] = useState(0)
//   const [progress, setProgress] = useState(0)
//   const [aiAnalysis, setAiAnalysis] = useState<any>(null)

//   const handleScan = async () => {
//     setIsScanning(true)
//     setIsScanned(false)
//     setCurrentStep(0)
//     setProgress(0)

//     const token = localStorage.getItem("token");

//     try {
//       const response = await axios.post(
//         `${BACKEND_URL}/api/v1/verify/verifyWebsite`,
//         { repoUrl },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       console.log("Response from backend:", response.data);

//       setAiAnalysis(response.data.PlagiarismAnalysis);

//       for (let i = 0; i < scanSteps.length; i++) {
//         setCurrentStep(i);
//         // Increase step duration slightly to extend total animation time
//         const stepDuration = i === scanSteps.length - 1 ? 500 : 1700 + Math.random() * 1100;
//         const stepProgress = ((i + 1) / scanSteps.length) * 100;

//         await new Promise((resolve) => {
//           const startTime = Date.now();
//           const animate = () => {
//             const elapsed = Date.now() - startTime;
//             const currentProgress = Math.min(stepProgress, (elapsed / stepDuration) * stepProgress);
//             setProgress(currentProgress);

//             if (elapsed < stepDuration) {
//               requestAnimationFrame(animate);
//             } else {
//               resolve(void 0);
//             }
//           };
//           animate();
//         });
//       }

//       setIsScanning(false);
//       setIsScanned(true);
//     } catch (error) {
//       console.error("Error scanning repo:", error);
//       setIsScanning(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
//       {/* Header */}
//       <header className="border-b border-border bg-card/50 backdrop-blur-sm">
//         <div className="container mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <Shield className="h-8 w-8 text-primary transition-transform hover:scale-110 duration-300" />
//               <h1 className="text-2xl font-bold text-foreground">SecureSight</h1>
//               <Badge variant="secondary" className="bg-primary/20 text-primary animate-pulse">
//                 Premium
//               </Badge>
//             </div>
//             <div className="flex items-center gap-4">
//               <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform duration-200">
//                 <Search className="h-4 w-4" />
//               </Button>
//               <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center hover:scale-110 transition-transform duration-200 cursor-pointer">
//                 <span className="text-sm font-medium text-primary-foreground">R</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="container mx-auto px-6 py-8">
//         {/* Repository Input */}
//         <Card className="mb-8 bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <GitBranch className="h-5 w-5 animate-pulse" />
//               Enter GitHub Repository Link
//               <Badge variant="destructive" className="ml-2 animate-bounce">
//                 README required
//               </Badge>
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex gap-4">
//               <Input
//                 value={repoUrl}
//                 onChange={(e) => setRepoUrl(e.target.value)}
//                 placeholder="https://github.com/username/repository"
//                 className="flex-1 bg-input border-border transition-all duration-200 focus:scale-[1.02]"
//                 disabled={isScanning}
//               />
//               <Button
//                 onClick={handleScan}
//                 disabled={isScanning}
//                 className="bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-200 disabled:opacity-50"
//               >
//                 {isScanning ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
//                 {isScanning ? "Scanning..." : "Scan"}
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         {isScanning && (
//           <Card className="mb-8 bg-gradient-to-r from-primary/20 to-primary/10 border-primary/30 animate-in slide-in-from-top duration-500">
//             <CardContent className="p-6">
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="relative">
//                       <GitBranch className="h-6 w-6 text-primary animate-pulse" />
//                       <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-ping"></div>
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-primary">{scanSteps[currentStep]?.title}</h3>
//                       <p className="text-sm text-muted-foreground">{scanSteps[currentStep]?.description}</p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-2xl font-bold text-primary">{Math.round(progress)}%</div>
//                     <div className="text-sm text-muted-foreground">
//                       Step {currentStep + 1} of {scanSteps.length}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Progress value={progress} className="h-3 transition-all duration-300" />
//                   <div className="flex justify-between text-xs text-muted-foreground">
//                     <span>0%</span>
//                     <span className="animate-pulse">Processing...</span>
//                     <span>100%</span>
//                   </div>
//                 </div>

//                 {/* Step indicators */}
//                 <div className="flex justify-between items-center pt-2">
//                   {scanSteps.map((step, index) => (
//                     <div
//                       key={step.id}
//                       className={`flex flex-col items-center transition-all duration-300 ${index <= currentStep ? "text-primary" : "text-muted-foreground"
//                         }`}
//                     >
//                       <div
//                         className={`w-3 h-3 rounded-full transition-all duration-300 ${index < currentStep
//                           ? "bg-primary scale-110"
//                           : index === currentStep
//                             ? "bg-primary animate-pulse scale-125"
//                             : "bg-muted"
//                           }`}
//                       />
//                       <span className="text-xs mt-1 hidden sm:block">{step.id}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Scan Status */}
//         {isScanned && !isScanning && (
//           <Card className="mb-8 bg-gradient-to-r from-chart-3/20 to-chart-3/10 border-chart-3/30 animate-in slide-in-from-top duration-500">
//             <CardContent className="p-6">
//               <div className="flex items-center gap-3">
//                 <CheckCircle className="h-6 w-6 text-chart-3 animate-pulse" />
//                 <div>
//                   <h3 className="font-semibold text-chart-3">Scan Complete</h3>
//                   <p className="text-sm text-muted-foreground">We've analyzed the repository content for plagiarism.</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Analysis Tabs - Only show when scan is complete */}
//         {isScanned && !isScanning && (
//           <Tabs defaultValue="summary" className="space-y-6">
//             <TabsList className="grid w-full grid-cols-3 bg-card/50 border border-border">
//               <TabsTrigger
//                 value="summary"
//                 className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200 hover:scale-105"
//               >
//                 Summary
//               </TabsTrigger>
//               <TabsTrigger
//                 value="code"
//                 className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200 hover:scale-105"
//               >
//                 Code
//               </TabsTrigger>
//               <TabsTrigger
//                 value="readme"
//                 className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200 hover:scale-105"
//               >
//                 README
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="summary" className="space-y-6 animate-in fade-in duration-500">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Overall Plagiarism */}
//                 <Card className="bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
//                   <CardHeader>
//                     <CardTitle>Overall Plagiarism</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-6">
//                     <div className="relative">
//                       <div className="flex items-center justify-center">
//                         <div className="relative w-32 h-32">
//                           <svg
//                             className="w-32 h-32 transform -rotate-90 transition-transform duration-1000 hover:rotate-0"
//                             viewBox="0 0 36 36"
//                           >
//                             <path
//                               d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//                               fill="none"
//                               stroke="currentColor"
//                               strokeWidth="2"
//                               className="text-muted"
//                             />
//                             <path
//                               d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//                               fill="none"
//                               stroke="currentColor"
//                               strokeWidth="2"
//                               strokeDasharray="58, 100"
//                               className="text-chart-5 animate-pulse"
//                             />
//                           </svg>
//                           <div className="absolute inset-0 flex items-center justify-center">
//                             <span className="text-3xl font-bold hover:scale-110 transition-transform duration-200">
//                               {aiAnalysis ? `${aiAnalysis.overallPlagiarism}%` : "N/A"}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                       <p className="text-center text-sm text-muted-foreground mt-2">
//                         Based on code similarity detection
//                       </p>
//                     </div>
//                     <div className="space-y-3">
//                       <div className="flex items-center gap-2 hover:translate-x-2 transition-transform duration-200">
//                         <div className="w-3 h-3 rounded-full bg-chart-3 animate-pulse"></div>
//                         <Badge
//                           variant="secondary"
//                           className="bg-chart-3/20 text-chart-3 hover:scale-105 transition-transform duration-200"
//                         >
//                           {aiAnalysis ? (aiAnalysis.IdeaUniqueness) : "N/A"}
//                         </Badge>
//                         <span className="text-sm">Idea Uniqueness</span>
//                       </div>
//                       <div className="flex items-center gap-2 hover:translate-x-2 transition-transform duration-200">
//                         <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
//                         <span className="text-sm text-muted-foreground">Human-like comments: {aiAnalysis.hasHumanComments}</span>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 {/* Code Analysis */}
//                 <Card className="bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Code className="h-5 w-5 animate-pulse" />
//                       Code Analysis
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div>
//                       <div className="flex justify-between items-center mb-2">
//                         <span className="text-sm font-medium">Original Code Score</span>
//                         <span className="text-chart-3 font-bold hover:scale-110 transition-transform duration-200">
//                           {aiAnalysis ? `${aiAnalysis.AdjustedCodeScore}%` : "N/A"}
//                         </span>
//                       </div>
//                       <Progress value={aiAnalysis.AdjustedCodeScore} className="h-2 transition-all duration-1000 hover:h-3" />
//                       <div className="flex justify-between text-xs text-muted-foreground mt-1">
//                         <span>0%</span>
//                         <span>50%</span>
//                         <span>100%</span>
//                       </div>
//                     </div>

//                     <div className="pt-4 border-t border-border">
//                       <div className="flex items-center gap-2 mb-3">
//                         <FileText className="h-4 w-4 text-chart-3 animate-pulse" />
//                         <span className="font-medium">README Analysis</span>
//                       </div>
//                       <div className="flex justify-between items-center mb-2">
//                         <span className="text-sm">Idea Originality Score</span>
//                         <Badge variant="destructive" className="animate-bounce">
//                           {aiAnalysis ? `${aiAnalysis.ReadmeScore}%` : "N/A"}
//                         </Badge>
//                       </div>
//                       <Progress value={aiAnalysis.ReadmeScore} className="h-2 transition-all duration-1000 hover:h-3" />
//                       <div className="flex justify-between text-xs text-muted-foreground mt-1">
//                         <span>0%</span>
//                         <span>50%</span>
//                         <span>100%</span>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* Bottom Stats */}
//               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//                 <Card className="bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300 hover:scale-105">
//                   <CardContent className="p-4">
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 rounded-lg bg-chart-1/20 hover:bg-chart-1/30 transition-colors duration-200">
//                         <GitBranch className="h-4 w-4 text-chart-1" />
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium">Fork Status</p>
//                         <Badge
//                           variant="secondary"
//                           className="bg-muted text-muted-foreground hover:scale-105 transition-transform duration-200"
//                         >
//                           {aiAnalysis.isForked ? "Forked" : "Original"}
//                         </Badge>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card className="bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300 hover:scale-105">
//                   <CardContent className="p-4">
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 rounded-lg bg-chart-4/20 hover:bg-chart-4/30 transition-colors duration-200">
//                         <FileText className="h-4 w-4 text-chart-4" />
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium">Human Comments</p>
//                         <Badge variant="destructive" className="animate-pulse">
//                           {aiAnalysis.hasHumanComments ? "Present" : "Absent"}
//                         </Badge>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card className="bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300 hover:scale-105">
//                   <CardContent className="p-4">
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 rounded-lg bg-chart-5/20 hover:bg-chart-5/30 transition-colors duration-200">
//                         <Code className="h-4 w-4 text-chart-5" />
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium">Random Variables</p>
//                         <Badge
//                           variant="secondary"
//                           className="bg-muted text-muted-foreground hover:scale-105 transition-transform duration-200"
//                         >
//                           {aiAnalysis.hasRandomVariableNames ? "Yes" : "No"}
//                         </Badge>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card className="bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300 hover:scale-105">
//                   <CardContent className="p-4">
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 rounded-lg bg-chart-4/20 hover:bg-chart-4/30 transition-colors duration-200">
//                         <AlertTriangle className="h-4 w-4 text-chart-4" />
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium">Structural Match</p>
//                         <Badge variant="destructive" className="animate-pulse">
//                           {aiAnalysis.hasHighStructuralMatch ? "Yes" : "No"}
//                         </Badge>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </TabsContent>

//             <TabsContent value="code" className="space-y-6 animate-in fade-in duration-500">
//               <Card className="bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Code className="h-5 w-5 animate-pulse" />
//                     Code Analysis
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <h4 className="font-semibold mb-3">Code Scores</h4>
//                       <div className="space-y-4">
//                         <div className="hover:translate-x-2 transition-transform duration-200">
//                           <div className="flex justify-between mb-2">
//                             <span className="text-sm">Original Code Score</span>
//                             <span className="text-sm font-medium text-chart-3">{100 - aiAnalysis.AdjustedCodeScore}</span>
//                           </div>
//                           <Progress value={100 - aiAnalysis.OriginalCodeScore} className="h-2 transition-all duration-1000 hover:h-3" />
//                         </div>
//                         <div className="hover:translate-x-2 transition-transform duration-200">
//                           <div className="flex justify-between mb-2">
//                             <span className="text-sm">Adjusted Code Score</span>
//                             <span className="text-sm font-medium text-chart-3">{100 - aiAnalysis.AdjustedCodeScore}</span>
//                           </div>
//                           <Progress value={100 - aiAnalysis.AdjustedCodeScore} className="h-2 transition-all duration-1000 hover:h-3" />
//                         </div>
//                         {/* <div className="hover:translate-x-2 transition-transform duration-200">
//                           <div className="flex justify-between mb-2">
//                             <span className="text-sm">Original Code Risk</span>
//                             <span className="text-sm font-medium text-chart-3">5/10</span>
//                           </div>
//                           <Progress value={50} className="h-2 transition-all duration-1000 hover:h-3" />
//                         </div> */}
//                         {/* <div className="hover:translate-x-2 transition-transform duration-200">
//                           <div className="flex justify-between mb-2">
//                             <span className="text-sm">Adjusted Code Risk</span>
//                             <span className="text-sm font-medium text-chart-3">5/10</span>
//                           </div>
//                           <Progress value={50} className="h-2 transition-all duration-1000 hover:h-3" />
//                         </div> */}
//                       </div>
//                     </div>
//                     <div>
//                       <h4 className="font-semibold mb-3">Code Analysis Flags</h4>
//                       <div className="space-y-3">
//                         <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-all duration-200 hover:scale-105">
//                           <span className="text-sm">Is Fork</span>
//                           <Badge variant="secondary" className="bg-chart-3/20 text-chart-3">
//                             {aiAnalysis.isForked ? "True" : "False"}
//                           </Badge>
//                         </div>
//                         <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-all duration-200 hover:scale-105">
//                           <span className="text-sm">High Structural Match</span>
//                           <Badge variant="secondary" className="bg-chart-3/20 text-chart-3">
//                             {aiAnalysis.hasHighStructuralMatch ? "True" : "False"}
//                           </Badge>
//                         </div>
//                         <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-all duration-200 hover:scale-105">
//                           <span className="text-sm">Human Comments</span>
//                           <Badge variant="secondary" className="bg-chart-3/20 text-chart-3">
//                             {aiAnalysis.hasHumanComments ? "True" : "False"}
//                           </Badge>
//                         </div>
//                         <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-all duration-200 hover:scale-105">
//                           <span className="text-sm">Random Variable Names</span>
//                           <Badge variant="secondary" className="bg-chart-3/20 text-chart-3">
//                             {aiAnalysis.hasRandomVariableNames ? "True" : "False"}
//                           </Badge>
//                         </div>
//                         <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-all duration-200 hover:scale-105">
//                           <span className="text-sm">Large Duplicated Blocks</span>
//                           <Badge variant="secondary" className="bg-chart-3/20 text-chart-3">
//                             {aiAnalysis.hasLargeDuplicatedBlocks ? "True" : "False"}
//                           </Badge>
//                         </div>
//                         <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-all duration-200 hover:scale-105">
//                           <span className="text-sm">Identical Dependency List</span>
//                           <Badge variant="secondary" className="bg-chart-3/20 text-chart-3">
//                             {aiAnalysis.hasIdenticalDependencyList ? "True" : "False"}
//                           </Badge>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="space-y-4">
//                     {/* <div>
//                       <h4 className="font-semibold mb-3">Matched Code Analysis</h4>
//                       <div className="p-4 rounded-lg bg-muted/10 border border-border hover:bg-muted/20 transition-all duration-200">
//                         <p className="text-sm text-muted-foreground">
//                           No meaningful code matches found. The user code appears to be empty or minimal, while the
//                           similar code contains GitHub Actions workflow configuration, maintainer lists, and Next.js
//                           React component structure.
//                         </p>
//                       </div>
//                     </div> */}

//                     <div>
//                       <h4 className="font-semibold mb-3">Code Summary</h4>
//                       <div className="p-4 rounded-lg bg-muted/10 border border-border hover:bg-muted/20 transition-all duration-200">
//                         <p className="text-sm text-muted-foreground">
//                           {aiAnalysis.CodeSummary || "No summary available."}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="readme" className="space-y-6 animate-in fade-in duration-500">
//               <Card className="bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <FileText className="h-5 w-5 animate-pulse" />
//                     README Analysis
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <h4 className="font-semibold mb-4">README Metrics</h4>
//                       <div className="space-y-4">
//                         <div className="hover:translate-x-2 transition-transform duration-200">
//                           <div className="flex justify-between mb-2">
//                             <span className="text-sm">README Score</span>
//                             <span className="text-sm font-medium text-chart-3">{100 - aiAnalysis.ReadmeScore}</span>
//                           </div>
//                           <Progress value={100 - aiAnalysis.ReadmeScore} className="h-2 transition-all duration-1000 hover:h-3" />
//                         </div>

//                         <div className="flex items-center gap-3 p-3 rounded-lg bg-chart-3/10 hover:bg-chart-3/20 transition-all duration-200 hover:scale-105">
//                           <CheckCircle className="h-5 w-5 text-chart-3 animate-pulse" />
//                           <div>
//                             <span className="text-sm font-medium">Idea Uniqueness</span>
//                             <Badge variant="secondary" className="ml-2 bg-chart-3/20 text-chart-3">
//                               {aiAnalysis.IdeaUniqueness}
//                             </Badge>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div>
//                       <h4 className="font-semibold mb-4">Content Analysis</h4>
//                       <div className="space-y-4">
//                         {/* <div>
//                           <h5 className="text-sm font-medium mb-2">Matched README Content</h5>
//                           <div className="p-3 rounded-lg bg-muted/10 border border-border hover:bg-muted/20 transition-all duration-200">
//                             <p className="text-sm text-muted-foreground">
//                               * None (only "# React" vs "# React Release Scripts")
//                             </p>
//                           </div>
//                         </div> */}

//                         <div>
//                           <h5 className="text-sm font-medium mb-2">README Summary</h5>
//                           <div className="p-3 rounded-lg bg-muted/10 border border-border hover:bg-muted/20 transition-all duration-200">
//                             <p className="text-sm text-muted-foreground">
//                               {aiAnalysis.ReadmeSummary || "No summary available."}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         )}
//       </div>
//     </div>
//   )
// }
