import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react"

const Contact = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: "",
  })

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
            // Pre-fill form with user data
            setFormData((prev) => ({
              ...prev,
              name: `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
              email: userData.email || "",
            }))
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setFormStatus({
      submitted: true,
      success: false,
      message: "Sending your message...",
    })

    // Simulate API call
    setTimeout(() => {
      setFormStatus({
        submitted: true,
        success: true,
        message: "Thank you for your message! We will get back to you soon.",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    }, 1500)
  }

  const faqs = [
    {
      question: "What are your shipping options?",
      answer:
        "We offer standard shipping (3-5 business days), express shipping (1-2 business days), and free shipping on orders over $50. International shipping is available to select countries.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We accept returns within 30 days of purchase. Products must be unused and in their original packaging. Please contact our customer service team to initiate a return.",
    },
    {
      question: "Are your products cruelty-free?",
      answer:
        "Yes, all of our products are cruelty-free and never tested on animals. We are certified by Leaping Bunny and PETA.",
    },
    {
      question: "Do you offer samples?",
      answer:
        "Yes, you can add up to 3 free samples to your order at checkout. We also offer a sample kit for purchase that includes our bestselling products.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order ships, you will receive a confirmation email with a tracking number. You can also track your order in your account dashboard.",
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar user={user} setUser={setUser} loading={loading} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-50 to-purple-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">Get in Touch</h1>
            <p className="mt-4 text-xl text-neutral-600">
              We'd love to hear from you. Our team is always here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-neutral-50 p-6 rounded-xl text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Phone</h3>
              <p className="text-neutral-600 mb-2">Mon-Fri from 8am to 5pm</p>
              <a href="tel:+15551234567" className="text-primary font-medium hover:text-primary/80">
                +1 (555) 123-4567
              </a>
            </div>

            <div className="bg-neutral-50 p-6 rounded-xl text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Email</h3>
              <p className="text-neutral-600 mb-2">We'll respond as soon as possible</p>
              <a href="mailto:support@glowcosmetics.com" className="text-primary font-medium hover:text-primary/80">
                support@glowcosmetics.com
              </a>
            </div>

            <div className="bg-neutral-50 p-6 rounded-xl text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Office</h3>
              <p className="text-neutral-600 mb-2">Come say hello</p>
              <p className="text-neutral-800">
                123 Beauty Lane
                <br />
                Cosmetic City, CC 12345
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form and Map */}
      <section className="py-12 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <MessageSquare className="h-6 w-6 mr-2 text-primary" />
                Send Us a Message
              </h2>

              {formStatus.submitted && formStatus.success ? (
                <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6">
                  <p className="font-medium">{formStatus.message}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                        Your Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={formStatus.submitted && !formStatus.success}
                      className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {formStatus.submitted && !formStatus.success ? (
                        <>
                          <div className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Map */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <MapPin className="h-6 w-6 mr-2 text-primary" />
                Find Us
              </h2>

              <div className="aspect-video bg-neutral-200 rounded-lg overflow-hidden">
                {/* Replace with actual map embed */}
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-neutral-500">Map Embed Placeholder</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-bold text-lg mb-2">GLOW Headquarters</h3>
                <p className="text-neutral-600 mb-4">
                  123 Beauty Lane
                  <br />
                  Cosmetic City, CC 12345
                  <br />
                  United States
                </p>

                <h4 className="font-medium text-neutral-800 mb-1">Hours of Operation:</h4>
                <ul className="text-neutral-600 space-y-1">
                  <li>Monday - Friday: 9:00 AM - 6:00 PM</li>
                  <li>Saturday: 10:00 AM - 4:00 PM</li>
                  <li>Sunday: Closed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-neutral-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                  <p className="text-neutral-600">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-neutral-600 mb-4">Can't find the answer you're looking for?</p>
              <a
                href="mailto:support@glowcosmetics.com"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
              >
                <Mail className="mr-2 h-4 w-4" />
                Email Our Support Team
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Contact

