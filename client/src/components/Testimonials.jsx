const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Beauty Enthusiast",
      content:
        "I've tried countless skincare products, but nothing compares to the results I've seen with GLOW's Vitamin C serum. My skin looks brighter and more even-toned than ever!",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Makeup Artist",
      content:
        "As a professional makeup artist, I need products that perform consistently. GLOW's foundation line provides flawless coverage that lasts all day, even under harsh lighting.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Skincare Blogger",
      content:
        "The attention to detail in GLOW's formulations is impressive. Their products are not only effective but also ethically sourced and environmentally conscious.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
  ]
  
  const Testimonials = () => {
    return (
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-neutral-600">
              Discover why thousands of beauty enthusiasts trust our products for their daily routines.
            </p>
          </div>
  
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-neutral-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-medium">{testimonial.name}</h3>
                    <p className="text-sm text-neutral-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-neutral-700 italic">"{testimonial.content}"</p>
                <div className="mt-4 flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  
  export default Testimonials
  
  