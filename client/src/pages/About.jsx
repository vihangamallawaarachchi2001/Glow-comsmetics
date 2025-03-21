import React from 'react';
import { motion } from 'framer-motion';
import { useState, useEffect } from "react"
import { CheckCircle, Users, Heart, Leaf } from "lucide-react"
import aboutusimg from '../assets/aboutus.jpeg';
import NewsLetter from '../components/Newsletter';
import Title from '../components/homecomp/Title';


const fadeInVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};


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
      bio: "With over 15 years in the beauty industry, Sarah founded Renora with a mission to create effective, ethical cosmetics for everyone.",
      image: "https://images.pexels.com/photos/31244120/pexels-photo-31244120/free-photo-of-confident-woman-in-professional-attire-outdoors.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      name: "Michael Chen",
      role: "Chief Product Officer",
      bio: "Michael leads our product development team, bringing his expertise in cosmetic chemistry to create innovative formulations.",
      image: "https://images.pexels.com/photos/2112723/pexels-photo-2112723.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      name: "Emily Rodriguez",
      role: "Creative Director",
      bio: "Emily oversees our brand identity and creative vision, ensuring that Renora's aesthetic is as beautiful as our products.",
      image: "https://images.pexels.com/photos/4467687/pexels-photo-4467687.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      name: "David Kim",
      role: "Head of Sustainability",
      bio: "David ensures that our commitment to environmental responsibility is reflected in every aspect of our business.",
      image: "https://images.pexels.com/photos/7460150/pexels-photo-7460150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
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
      description: "Renora was founded with a simple mission: to create effective, ethical cosmetics for everyone.",
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
      description: "Renora expanded to international markets, bringing our products to beauty enthusiasts worldwide.",
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
    <div>
      <motion.div 
        className='text-2xl pt-8' 
        initial='hidden' 
        whileInView='visible' 
        viewport={{ once: true }}
        variants={fadeInVariant}
      >
        <h2 className='text-4xl font-bold'>Welcome to Renora – Where Science Meets Beauty</h2>
      </motion.div>

      <motion.div 
        className='my-10 flex flex-col md:flex-row gap-16' 
        initial='hidden' 
        whileInView='visible' 
        viewport={{ once: true }}
        variants={fadeInVariant}
      >
        <img className='w-[500px] h-[600px]' src={aboutusimg} alt='' />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>Welcome to Renora, your destination for premium skincare that blends 
            science, nature, and innovation. We are committed to offering high-quality
            skincare solutions designed to nourish, protect, and enhance your natural 
            beauty. Rooted in the heart of Nugegoda, Renora has quickly become a trusted
            name for those seeking effective, dermatologist-approved products that cater 
            to every skin type and concern.
          </p>

          <p>At Renora, we believe that skincare is more than just a routine—it’s a 
            commitment to self-care and confidence. Our carefully crafted formulas 
            harness the power of natural extracts, clinically proven ingredients, and 
            cutting-edge skincare technology to deliver visible results. Whether you're 
            looking for deep hydration, anti-aging solutions, or daily protection, our 
            products are designed to bring out the best in your skin.
          </p>

          <b className='text-gray-800'>Our Mission</b>

          <p>At Renora, our mission is to empower individuals through skincare by offering 
            safe, effective, and innovative products that promote radiant and healthy skin. 
            We are dedicated to transparency, sustainability, and customer satisfaction, ensuring 
            that every product we create is backed by science and nature.
          </p>

          <p>Our goal is not just to meet expectations but to exceed them, providing skincare solutions 
            that are dermatologist-tested, cruelty-free, and free from harsh chemicals. Whether you're new 
            to skincare or a beauty enthusiast, Renora is here to help you achieve your glow with confidence.
          </p>
        </div>
      </motion.div>

      <motion.div 
        className='text-2xl py-4' 
        initial='hidden' 
        whileInView='visible' 
        viewport={{ once: true }}
        variants={fadeInVariant}
      >
        <Title text1={'THE'} text2={' RENORA PROMISE '} />
      </motion.div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        {[
          { title: '✨ Beyond Beauty', text: 'At Renora, we believe that skincare is more than just looking good—it’s about feeling confident, empowered, and radiant in your own skin. Our products are designed to restore, protect, and enhance your skin’s natural balance, ensuring long-term results, not just temporary fixes. Whether you are tackling dryness, acne, or signs of aging, Renora is here to support your skincare journey every step of the way.' },
          { title: '🌱 Pure Ingredients', text: 'We’re committed to clean beauty that delivers. Every Renora product is formulated using high-performance botanicals, dermatologist-approved actives, and cutting-edge skincare technology. Our ingredients are: Sustainably sourced and ethically harvested, Free from parabens, sulfates, and harsh chemicals, Clinically tested for safety and effectiveness.' },
          { title: '🌍 Brand That Puts You First', text: 'Your skincare should work for you, not against you. That’s why we provide: Personalized skincare solutions – products that cater to your unique skin type and concerns, Hassle-free shopping – fast delivery, flexible payments, and easy returns, Expert support – a team of skincare specialists ready to help you find your perfect match. At Renora, we don’t just sell skincare—we create a community of care, where beauty is personal, and everyone is welcome.' }
        ].map((item, index) => (
          <motion.div 
            key={index} 
            className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'
            initial='hidden' 
            whileInView='visible' 
            viewport={{ once: true }}
            variants={fadeInVariant}
          >
            <b className='text-2xl'>{item.title}</b>
            <p className='text-gray-600'>{item.text}</p>
          </motion.div>
        ))}
      </div>

      {/* Team Section */}
      <motion.div 
        className='my-10 flex flex-col md:flex-row gap-16' 
        initial='hidden' 
        whileInView='visible' 
        viewport={{ once: true }}
        variants={fadeInVariant}
      >
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">Meet Our Team</h2>
            <p className="text-lg text-neutral-600">
              The passionate individuals behind Renora who are dedicated to revolutionizing the beauty industry.
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
      </motion.div>

      {/* Timeline Section */}
      <motion.div 
        className='' 
        initial='hidden' 
        whileInView='visible' 
        viewport={{ once: true }}
        variants={fadeInVariant}
      >
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">Our Journey</h2>
            <p className="text-lg text-neutral-600">
              From humble beginnings to where we are today, this is the story of Renora's evolution.
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
      </motion.div>

      <motion.div 
        className='' 
        initial='hidden' 
        whileInView='visible' 
        viewport={{ once: true }}
        variants={fadeInVariant}
      >
        <NewsLetter />
      </motion.div>

    </div>
  )
}

export default About

