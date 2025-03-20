import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-16 md:py-24 items-center">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 mb-6">
              <span className="block">Discover Your</span>
              <span className="block text-primary">Natural Beauty</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-600 mb-8">
              Elevate your beauty routine with our premium cosmetics. Ethically sourced, cruelty-free, and designed to
              enhance your natural radiance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-6 py-3 border border-black text-base font-medium rounded-md text-black  bg-primary hover:bg-primary/90 transition-colors"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-6 py-3 border border-neutral-300 text-base font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl transform transition-transform hover:scale-[1.02] duration-500">
              <img
                src="/heroImage.png"
                alt="Cosmetic products showcase"
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute top-1/4 -left-8 w-24 h-24 bg-pink-200 rounded-full opacity-60 blur-xl"></div>
            <div className="absolute bottom-1/3 -right-10 w-32 h-32 bg-purple-200 rounded-full opacity-60 blur-xl"></div>
          </div>
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
  )
}

export default Hero

