import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Filter, Search, ShoppingBag, Heart, ChevronDown, X, Sliders } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const Products = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 })
  const [sortBy, setSortBy] = useState("featured")
  const [searchQuery, setSearchQuery] = useState("")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 12

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

    // Fetch products (mock data for now)
    const mockProducts = Array(40)
      .fill()
      .map((_, index) => ({
        id: index + 1,
        name: `Product ${index + 1}`,
        category: ["Skincare", "Makeup", "Haircare", "Fragrance", "Bath & Body"][Math.floor(Math.random() * 5)],
        price: Math.floor(Math.random() * 80) + 10,
        rating: (Math.random() * 2 + 3).toFixed(1),
        image: `/placeholder.svg?height=300&width=300`,
        isNew: Math.random() > 0.8,
        isSale: Math.random() > 0.8,
        discount: Math.random() > 0.8 ? Math.floor(Math.random() * 30) + 10 : 0,
      }))

    setProducts(mockProducts)
    setFilteredProducts(mockProducts)

    // Extract unique categories
    const uniqueCategories = [...new Set(mockProducts.map((product) => product.category))]
    setCategories(uniqueCategories)
  }, [])

  useEffect(() => {
    // Apply filters and search
    let result = [...products]

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((product) => product.category === selectedCategory)
    }

    // Price range filter
    result = result.filter((product) => product.price >= priceRange.min && product.price <= priceRange.max)

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (product) => product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query),
      )
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        result.sort((a, b) => b.id - a.id)
        break
      default:
        // 'featured' - no specific sorting
        break
    }

    setFilteredProducts(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [products, selectedCategory, priceRange, sortBy, searchQuery])

  // Get current products for pagination
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  const handlePriceChange = (e, type) => {
    const value = Number.parseInt(e.target.value)
    setPriceRange((prev) => ({
      ...prev,
      [type]: value,
    }))
  }

  const resetFilters = () => {
    setSelectedCategory("all")
    setPriceRange({ min: 0, max: 100 })
    setSortBy("featured")
    setSearchQuery("")
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar user={user} setUser={setUser} loading={loading} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-50 to-purple-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">Our Products</h1>
            <p className="mt-4 text-xl text-neutral-600">
              Discover our range of premium cosmetics designed to enhance your natural beauty.
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="w-full md:w-auto flex items-center">
              <div className="relative flex-1 md:w-80">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="ml-2 p-2 border border-neutral-300 rounded-md md:hidden"
              >
                <Filter size={20} />
              </button>
            </div>

            <div className="w-full md:w-auto flex items-center gap-4">
              <div className="flex items-center">
                <label htmlFor="sort" className="text-sm font-medium text-neutral-700 mr-2">
                  Sort by:
                </label>
                <div className="relative">
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-1.5 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest</option>
                  </select>
                  <ChevronDown
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>

              <div className="text-sm text-neutral-500">Showing {filteredProducts.length} products</div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className={`md:w-64 flex-shrink-0 ${filtersOpen ? "block" : "hidden md:block"}`}>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold flex items-center">
                    <Sliders className="mr-2 h-5 w-5 text-primary" />
                    Filters
                  </h2>
                  <button onClick={resetFilters} className="text-sm text-primary hover:text-primary/80">
                    Reset
                  </button>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="category-all"
                        name="category"
                        checked={selectedCategory === "all"}
                        onChange={() => setSelectedCategory("all")}
                        className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="category-all" className="ml-2 text-sm text-neutral-700">
                        All Categories
                      </label>
                    </div>

                    {categories.map((category, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="radio"
                          id={`category-${index}`}
                          name="category"
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                          className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor={`category-${index}`} className="ml-2 text-sm text-neutral-700">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="min-price" className="block text-sm text-neutral-600 mb-1">
                        Min Price: ${priceRange.min}
                      </label>
                      <input
                        type="range"
                        id="min-price"
                        min="0"
                        max="100"
                        value={priceRange.min}
                        onChange={(e) => handlePriceChange(e, "min")}
                        className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <label htmlFor="max-price" className="block text-sm text-neutral-600 mb-1">
                        Max Price: ${priceRange.max}
                      </label>
                      <input
                        type="range"
                        id="max-price"
                        min="0"
                        max="100"
                        value={priceRange.max}
                        onChange={(e) => handlePriceChange(e, "max")}
                        className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Other filters can be added here */}
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {filteredProducts.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No products found</h3>
                  <p className="text-neutral-600 mb-4">Try adjusting your filters or search query.</p>
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {currentProducts.map((product) => (
                      <div
                        key={product.id}
                        className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="relative">
                          <Link to={`/products/${product.id}`}>
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </Link>

                          {product.isNew && (
                            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                              NEW
                            </div>
                          )}

                          {product.isSale && (
                            <div className="absolute top-2 right-2 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                              SALE
                            </div>
                          )}

                          <button className="absolute bottom-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white text-neutral-500 hover:text-rose-500 transition-colors">
                            <Heart size={18} />
                          </button>
                        </div>

                        <div className="p-4">
                          <span className="text-sm text-neutral-500">{product.category}</span>
                          <Link to={`/products/${product.id}`}>
                            <h3 className="font-medium text-lg mt-1 mb-2 hover:text-primary transition-colors">
                              {product.name}
                            </h3>
                          </Link>

                          <div className="flex items-center mb-3">
                            <div className="flex text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-current" : "text-neutral-300"}`}
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-sm text-neutral-500 ml-1">{product.rating}</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <div>
                              {product.discount > 0 ? (
                                <>
                                  <span className="font-bold text-lg text-primary">
                                    ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                                  </span>
                                  <span className="text-sm text-neutral-500 line-through ml-2">
                                    ${product.price.toFixed(2)}
                                  </span>
                                </>
                              ) : (
                                <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                              )}
                            </div>

                            <button className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
                              <ShoppingBag size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                      <nav className="flex items-center space-x-2">
                        <button
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1 rounded-md border border-neutral-300 text-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>

                        {[...Array(totalPages)].map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`px-3 py-1 rounded-md ${
                              currentPage === index + 1
                                ? "bg-primary text-white"
                                : "border border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                            }`}
                          >
                            {index + 1}
                          </button>
                        ))}

                        <button
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 rounded-md border border-neutral-300 text-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Products

