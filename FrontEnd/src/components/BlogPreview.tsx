"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { TransitionLink } from "@/components/TransitionLink"

gsap.registerPlugin(ScrollTrigger)

const blogPosts = [
  {
    id: 1,
    title: "The Future of Web Design",
    excerpt: "Exploring emerging trends and technologies shaping the digital landscape.",
    date: "2024-01-15",
    slug: "future-of-web-design",
  },
  {
    id: 2,
    title: "Creative Coding Techniques",
    excerpt: "Pushing the boundaries of what's possible with code and creativity.",
    date: "2024-01-10",
    slug: "creative-coding-techniques",
  },
  {
    id: 3,
    title: "User Experience Revolution",
    excerpt: "How modern UX principles are transforming digital interactions.",
    date: "2024-01-05",
    slug: "user-experience-revolution",
  },
]

export function BlogPreview() {
  const containerRef = useRef(null)

  useGSAP(
    () => {
      const posts = gsap.utils.toArray(".blog-post")

      gsap.fromTo(
        ".blog-title",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        },
      )

      gsap.fromTo(
        posts,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          },
        },
      )
    },
    { scope: containerRef },
  )

  return (
    <section ref={containerRef} className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="blog-title text-4xl md:text-5xl font-bold text-white mb-12 text-center">Latest Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="blog-post group">
              <TransitionLink href={`/blog/${post.slug}`}>
                <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-lg p-6 h-full transition-all duration-300 group-hover:bg-neutral-800/50 group-hover:border-neutral-700">
                  <div className="mb-4">
                    <time className="text-sm text-neutral-400">{post.date}</time>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-neutral-300 text-sm leading-relaxed">{post.excerpt}</p>
                </div>
              </TransitionLink>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
