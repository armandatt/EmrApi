import Navbar from "../components/SSBlocks/NavBar"
import Footer from "../components/SSBlocks/Footer"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Shield, CheckCircle, Users, Award, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

export default function AboutUsPage() {
  return (
    <>
      <Navbar />
      <div className="container py-16 md:py-24">
        {/* Hero Section */}
        <div className="mx-auto max-w-[58rem] text-center mb-16">
          <div className="flex justify-center mb-6">
            <Shield className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">About SecureSight</h1>
          <p className="text-xl text-muted-foreground">The verification platform founded by Arman Datt</p>
        </div>

        {/* Our Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-lg text-muted-foreground mb-4">
              SecureSight is launched with a mission to create a comprehensive verification
              platform that addresses the growing challenges of digital content authenticity.
            </p>
            <p className="text-lg text-muted-foreground mb-4">
              What started as a tool to detect plagiarism has evolved into a suite of powerful verification solutions
              that help businesses, educational institutions, and individuals ensure the authenticity and security of
              their digital content.
            </p>
          </div>
          <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg p-8 h-full flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Our Mission</h3>
              <p className="text-lg">
                To provide accessible, accurate, and comprehensive verification tools that empower users to protect
                their digital assets and ensure content authenticity in an increasingly complex digital landscape.
              </p>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold mb-10 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-background/60 backdrop-blur border border-border/40">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Accuracy</h3>
                <p className="text-muted-foreground">
                  We're committed to providing the most accurate verification tools on the market, constantly refining
                  our algorithms to stay ahead of emerging threats.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background/60 backdrop-blur border border-border/40">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Accessibility</h3>
                <p className="text-muted-foreground">
                  We believe verification tools should be accessible to everyone, from individual creators to large
                  enterprises, with intuitive interfaces and clear results.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background/60 backdrop-blur border border-border/40">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <Award className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Innovation</h3>
                <p className="text-muted-foreground">
                  We continuously innovate to address emerging verification challenges, particularly in the rapidly
                  evolving landscape of AI-generated content.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Founder */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold mb-10 text-center">Our Founder</h2>
          <div className="flex flex-col md:flex-row gap-8 items-center bg-background/60 backdrop-blur border border-border/40 rounded-lg p-8">
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
              <span className="text-4xl font-bold">AD</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Arman Datt</h3>
              <p className="text-lg text-muted-foreground mb-4">Founder & CEO</p>
              <p className="text-muted-foreground mb-4">
                I am a second-year Computer Science undergraduate with a strong interest in artificial intelligence, full-stack development, and cybersecurity. Currently exploring real-world applications through hands-on projects and open-source contributions.
              </p>
              <p className="text-muted-foreground">
                My vision for SecureSight stems from recognizing the growing need for comprehensive verification tools
                in an era of increasing digital content manipulation and sophisticated phishing attempts.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to experience SecureSight?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of users who trust SecureSight for their verification needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/solutions">
                Explore Our Solutions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
