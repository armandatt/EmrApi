import { Card } from "../components/ui/card"

const blogPosts = [
  {
    id: 1,
    title: "The Future of Web Design",
    excerpt: "Exploring emerging trends and technologies shaping the digital landscape.",
    date: "March 15, 2024",
    slug: "future-of-web-design",
    image: "/futuristic-digital-cyberscape.jpg",
  },
  {
    id: 2,
    title: "Creative Process Behind Award-Winning Sites",
    excerpt: "A deep dive into our design methodology and creative workflow.",
    date: "March 10, 2024",
    slug: "creative-process",
    image: "/ethereal-threads-abstract-art.jpg",
  },
  {
    id: 3,
    title: "Performance Optimization for Modern Web Apps",
    excerpt: "Best practices for building fast, responsive web applications.",
    date: "March 5, 2024",
    slug: "performance-optimization",
    image: "/quantum-leap-space-time.jpg",
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Our Blog
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Insights, tutorials, and thoughts on design, development, and digital creativity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card
                key={post.id}
                className="bg-gray-900/50 border-gray-800 overflow-hidden hover:border-purple-500/50 transition-colors"
              >
                <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-600/20 relative overflow-hidden">
                  <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-400 mb-2">{post.date}</p>
                  <h3 className="text-xl font-semibold mb-3 hover:text-purple-400 transition-colors">
                    <a href={`/blog/${post.slug}`}>{post.title}</a>
                  </h3>
                  <p className="text-gray-400 mb-4">{post.excerpt}</p>
                  <a
                    href={`/blog/${post.slug}`}
                    className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
                  >
                    Read More →
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
