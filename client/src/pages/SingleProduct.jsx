import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import {
  Star,
  ShoppingBag,
  Heart,
  ChevronRight,
  Minus,
  Plus,
  Truck,
  RefreshCw,
  Shield,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const SingleProduct = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [user, setUser] = useState(null)

  // Base image URL if needed
  const BASE_IMAGE_URL = ""

  // Check user status
  useEffect(() => {
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
            localStorage.removeItem("token")
          }
        }
      } catch (error) {
        console.error("Error checking user status:", error)
      }
    }

    // Fetch product from backend
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/product/${id}`)
        if (!res.ok) throw new Error("Failed to load product")
        const data = await res.json()

        // Format product data
        const formattedProduct = {
          id: data._id,
          name: data.name,
          description: `A premium quality ${data.category} item designed for best results.`,
          price: parseFloat(data.price).toFixed(2),
          rating: 4.8,
          reviews: data.salesCount,
          category: data.category,
          stock: data.stock,
          images: [data.image].flat(),
          features: [
            `${data.category} product`,
            `${data.views} views`,
            `Added to cart ${data.cartAdditions} times`,
          ],
          instructions: "Apply as directed.",
          ingredients: "Natural and safe ingredients.",
          isSale: false,
          discount: 0,
        }

        setProduct(formattedProduct)
      } catch (err) {
        console.error(err)
        setError("Failed to load product details.")
      } finally {
        setLoading(false)
      }
    }

    window.scrollTo(0, 0)
    checkUserStatus()
    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || []

    const existingItemIndex = cart.findIndex((item) => item.id === id)

    if (existingItemIndex > -1) {
      // Update quantity if already exists
      cart[existingItemIndex].quantity += quantity
    } else {
      // Add new item
      cart.push({ id, quantity })
    }

    // Save back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart))
    alert(`${quantity} x "${product.name}" added to cart!`)
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const getDiscountedPrice = (price) => {
    return price
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="aspect-square bg-neutral-100 rounded-lg animate-pulse"></div>
              <div className="space-y-4">
                <div className="h-8 bg-neutral-100 rounded w-3/4 animate-pulse"></div>
                <div className="h-6 bg-neutral-100 rounded w-1/4 animate-pulse"></div>
                <div className="h-4 bg-neutral-100 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-neutral-100 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-neutral-100 rounded w-3/4 animate-pulse"></div>
                <div className="h-10 bg-neutral-100 rounded w-full mt-6 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar user={user} setUser={setUser} loading={false} />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-6 text-center">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Oops! Something went wrong.</h2>
            <p className="text-neutral-600 mb-6">{error}</p>
            <Link
              to="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Return to Products
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="min-h-screen bg-neutral-50">

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-8">
          <ol className="flex items-center text-sm">
            <li>
              <Link to="/" className="text-neutral-500 hover:text-primary">
                Home
              </Link>
            </li>
            <ChevronRight className="mx-2 h-4 w-4 text-neutral-400" />
            <li>
              <Link to="/products" className="text-neutral-500 hover:text-primary">
                Products
              </Link>
            </li>
            <ChevronRight className="mx-2 h-4 w-4 text-neutral-400" />
            <li>
              <Link to={`/category/${product.category}`} className="text-neutral-500 hover:text-primary">
                {product.category}
              </Link>
            </li>
            <ChevronRight className="mx-2 h-4 w-4 text-neutral-400" />
            <li className="text-neutral-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-neutral-100">
                <img
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`aspect-square rounded-md overflow-hidden border-2 ${
                      selectedImage === index ? "border-primary" : "border-transparent"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">{product.name}</h1>
                <div className="flex items-center mt-2 mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-current" : "text-neutral-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-neutral-600 ml-2">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-3xl font-bold">${getDiscountedPrice(product.price)}</span>
                </div>
              </div>
              <p className="text-neutral-600">{product.description}</p>

              {/* Quantity Selector */}
              <div>
                <h3 className="font-medium text-neutral-900 mb-2">Quantity</h3>
                <div className="flex items-center">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="p-2 border border-neutral-300 rounded-l-md text-neutral-700 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="w-12 text-center py-2 border-t border-b border-neutral-300">{quantity}</div>
                  <button
                    onClick={increaseQuantity}
                    disabled={quantity >= product.stock}
                    className="p-2 border border-neutral-300 rounded-r-md text-neutral-700 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <span className="ml-4 text-sm text-neutral-500">{product.stock} available</span>
                </div>
              </div>

              {/* Add to Cart & Wishlist */}
              <div className="flex flex-col sm:flex-row text-black gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary cursor-pointer text-black font-medium py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center"
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Add to Cart
                </button>
                {/* <button className="flex items-center justify-center py-3 px-6 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors">
                  <Heart className="mr-2 h-5 w-5" />
                  Add to Wishlist
                </button> */}
              </div>

              {/* Shipping and Returns */}
              <div className="border-t border-neutral-200 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <Truck className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Free Shipping</h4>
                    <p className="text-xs text-neutral-500">On orders over $50</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <RefreshCw className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">30 Day Returns</h4>
                    <p className="text-xs text-neutral-500">Hassle-free returns</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Secure Checkout</h4>
                    <p className="text-xs text-neutral-500">SSL/TLS encryption</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <RefreshCw className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Satisfaction Guaranteed</h4>
                    <p className="text-xs text-neutral-500">Love it or your money back</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleProduct