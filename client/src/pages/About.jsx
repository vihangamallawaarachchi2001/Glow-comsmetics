import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useState, useEffect } from "react"
import { CheckCircle, Users, Heart, Leaf } from "lucide-react"

const About = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const checkUserStatus = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          const response = await fetch("http://localhost:3000/api/user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const userData = await response.json()
            setUser(userData)
          } else {
            // Token invalid, remove it
            localStorage.removeItem("token")
          }
        }
      } catch (error) {
        console.error("Error checking user status:", error)
      } finally {
        setLoading(false)
      }
    }

    checkUserStatus()
  }, [])

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      bio: "With over 15 years in the beauty industry, Sarah founded GLOW with a mission to create effective, ethical cosmetics for everyone.",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Michael Chen",
      role: "Chief Product Officer",
      bio: "Michael leads our product development team, bringing his expertise in cosmetic chemistry to create innovative formulations.",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Emily Rodriguez",
      role: "Creative Director",
      bio: "Emily oversees our brand identity and creative vision, ensuring that GLOW's aesthetic is as beautiful as our products.",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "David Kim",
      role: "Head of Sustainability",
      bio: "David ensures that our commitment to environmental responsibility is reflected in every aspect of our business.",
      image: "/placeholder.svg?height=300&width=300",
    },
  ]

  const values = [
    {
      title: "Quality",
      description: "We never compromise on the quality of our ingredients or formulations.",
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
    },
    {
      title: "Inclusivity",
      description: "Our products are designed for all skin types, tones, and beauty preferences.",
      icon: <Users className="h-8 w-8 text-primary" />,
    },
    {
      title: "Compassion",
      description: "We are committed to cruelty-free practices and never test on animals.",
      icon: <Heart className="h-8 w-8 text-primary" />,
    },
    {
      title: "Sustainability",
      description: "We strive to minimize our environmental impact through responsible sourcing and packaging.",
      icon: <Leaf className="h-8 w-8 text-primary" />,
    },
  ]

  const timeline = [
    {
      year: "2015",
      title: "The Beginning",
      description: "GLOW was founded with a simple mission: to create effective, ethical cosmetics for everyone.",
    },
    {
      year: "2017",
      title: "Expanding Our Range",
      description:
        "We launched our first complete skincare line, focusing on natural ingredients and sustainable packaging.",
    },
    {
      year: "2019",
      title: "Going Global",
      description: "GLOW expanded to international markets, bringing our products to beauty enthusiasts worldwide.",
    },
    {
      year: "2021",
      title: "Sustainability Pledge",
      description: "We committed to becoming carbon-neutral by 2025 and introduced our refillable packaging program.",
    },
    {
      year: "2023",
      title: "Innovation Focus",
      description: "Our new research lab opened, dedicated to developing the next generation of clean beauty products.",
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar user={user} setUser={setUser} loading={loading} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-50 to-purple-50 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl">Our Story</h1>
            <p className="mt-6 text-xl text-neutral-600">
              We believe that beauty should be a source of confidence, not anxiety. Our mission is to create products
              that enhance your natural beauty while being kind to your skin and the planet.
            </p>
          </div>
        </div>

        {/* Curved divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" className="w-full h-auto">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,32L80,42.7C160,53,320,75,480,74.7C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-6">Our Mission</h2>
              <p className="text-lg text-neutral-600 mb-6">
                At GLOW, we're on a mission to transform the beauty industry by creating products that are not only
                effective but also ethical and sustainable.
              </p>
              <p className="text-lg text-neutral-600 mb-6">
                We believe that everyone deserves to feel beautiful in their own skin, without compromising their values
                or the health of the planet.
              </p>
              <p className="text-lg text-neutral-600">
                Our team of experts works tirelessly to develop formulations that deliver real results, using
                ingredients that are ethically sourced and environmentally responsible.
              </p>
            </div>
            <div className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/placeholder.svg?height=600&width=600"
                  alt="Our laboratory"
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute top-1/4 -left-8 w-24 h-24 bg-pink-200 rounded-full opacity-60 blur-xl"></div>
              <div className="absolute bottom-1/3 -right-10 w-32 h-32 bg-purple-200 rounded-full opacity-60 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">Our Values</h2>
            <p className="text-lg text-neutral-600">
              These core principles guide everything we do, from product development to customer service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-neutral-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">Meet Our Team</h2>
            <p className="text-lg text-neutral-600">
              The passionate individuals behind GLOW who are dedicated to revolutionizing the beauty industry.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-neutral-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-neutral-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">Our Journey</h2>
            <p className="text-lg text-neutral-600">
              From humble beginnings to where we are today, this is the story of GLOW's evolution.
            </p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-neutral-200"></div>

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                >
                  <div className="flex-1"></div>

                  {/* Center dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center z-10">
                    <div className="w-4 h-4 rounded-full bg-white"></div>
                  </div>

                  <div className="flex-1 bg-white p-6 rounded-xl shadow-sm mx-4 md:mx-8 relative">
                    <span className="text-sm font-bold text-primary">{item.year}</span>
                    <h3 className="text-xl font-bold mt-1 mb-2">{item.title}</h3>
                    <p className="text-neutral-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">Join Our Beauty Revolution</h2>
            <p className="text-lg text-neutral-600 mb-8">
              Experience the difference that ethical, effective cosmetics can make in your beauty routine.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
              >
                Shop Our Products
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-neutral-300 text-base font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default About

