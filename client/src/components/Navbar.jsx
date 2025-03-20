

import { useState } from "react"
import { ShoppingBag, User, Menu, X, Search } from "lucide-react"
import { Link } from "react-router-dom"

const Navbar = ({ user, setUser, loading }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
    setIsMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">GLOW</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-neutral-700 hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-neutral-700 hover:text-primary transition-colors">
              Products
            </Link>
            <Link to="/about" className="text-neutral-700 hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-neutral-700 hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-neutral-700 hover:text-primary transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {loading ? (
              <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            ) : user ? (
              <>
                <Link to="/cart" className="p-2 text-neutral-700 hover:text-primary transition-colors relative">
                  <ShoppingBag size={20} />
                  <span className="absolute top-0 right-0 h-4 w-4 text-xs flex items-center justify-center bg-primary text-white rounded-full">
                    3
                  </span>
                </Link>
                <div className="relative group">
                  <button className="p-2 text-neutral-700 hover:text-primary transition-colors">
                    <User size={20} />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
                      Profile
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
                      Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className=" py-2 text-sm font-medium text-[#faf5eb] hover:text-primary transition-colors bg-violet-200 px-5 rounded-md"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 text-sm font-medium text-violet-200 hover:bg-primary/90 rounded-md border border-violet-200 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            {!loading && user && (
              <Link to="/cart" className="p-2 mr-2 text-neutral-700 hover:text-primary transition-colors relative">
                <ShoppingBag size={20} />
                <span className="absolute top-0 right-0 h-4 w-4 text-xs flex items-center justify-center bg-primary text-white rounded-full">
                  3
                </span>
              </Link>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-neutral-700 hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="border-t border-neutral-200 py-3 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="relative max-w-3xl mx-auto">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full pl-4 pr-10 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-primary">
              <Search size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-neutral-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 text-base font-medium text-neutral-700 hover:bg-neutral-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="block px-3 py-2 text-base font-medium text-neutral-700 hover:bg-neutral-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-base font-medium text-neutral-700 hover:bg-neutral-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 text-base font-medium text-neutral-700 hover:bg-neutral-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>

            {loading ? (
              <div className="flex justify-center py-2">
                <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
              </div>
            ) : user ? (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 text-base font-medium text-neutral-700 hover:bg-neutral-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/orders"
                  className="block px-3 py-2 text-base font-medium text-neutral-700 hover:bg-neutral-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-neutral-700 hover:bg-neutral-100 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-base font-medium text-neutral-700 hover:bg-neutral-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 text-base font-medium text-primary hover:bg-neutral-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar

