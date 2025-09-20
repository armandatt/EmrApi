"use client"

import { motion } from "framer-motion"
import { Link } from "react-router-dom"


const projects = [
  {
    title: "Smart Patient Records",
    description: "A secure, centralized way to manage patient data and history effortlessly..",
    imgSrc: "/CreationImages/Healthcare1.jpg",
    href: "/portfolio/project-cyberscape",
  },
  {
    title: "AI-Powered Medical Coding",
    description: "Automated ICD-11 & Namaste code generation to save time and reduce errors.",
    imgSrc: "/CreationImages/HealthCare2.jpg",
    href: "/portfolio/ethereal-threads",
  },
  {
    title: "Seamless Hospital Workflows",
    description: "Integrated task and workflow management for doctors and staff.",
    imgSrc: "/CreationImages/Healthcare3.jpg",
    href: "/portfolio/quantum-leap",
  },
]

export function Portfolio() {
  return (
    <section id="portfolio" className="relative py-20 px-4 sm:px-6 lg:px-8">
    {/* <div id="portfolio" className="relative py-20 px-4 sm:px-6 lg:px-8"> */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Our Creations</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-400">
          A selection of Areas that We Explore For Our Api 
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Link to={project.href}>
              <div className="group relative block w-full h-[450px] overflow-hidden rounded-lg shadow-lg">
                <img
                  src={project.imgSrc || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Gradient always visible */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 transition-all duration-500">
                  <h3 className="text-2xl font-bold mb-2 text-white">{project.title}</h3>
                  <p className="text-neutral-300">{project.description}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    {/* </div> */}
  </section>
  )
}

