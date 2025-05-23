import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const Cart = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cartItems, setCartItems] = useState([])
  const [products, setProducts] = useState({})
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [couponError, setCouponError] = useState("")
  const [couponSuccess, setCouponSuccess] = useState("")

  const navigate = useNavigate()

  // Load user status
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

    // Load cart items from localStorage
    const loadCartItems = async () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || []

      if (cart.length === 0) {
        setCartItems([])
        setLoading(false)
        return
      }

      try {
        // Fetch all products used in the cart
        const productPromises = cart.map(async (item) => {
          const res = await fetch(`http://localhost:3000/api/product/${item.id}`)
          if (!res.ok) throw new Error("Failed to load product")
          return await res.json()
        })

        const productData = await Promise.all(productPromises)

        // Map product data with quantities from cart
        const itemsWithDetails = cart.map((item) => {
          const product = productData.find((p) => p._id === item.id)
          return {
            id: item.id,
            productId: item.id,
            name: product?.name || "Unknown Product",
            price: parseFloat(product?.price).toFixed(2),
            quantity: item.quantity,
            image: product?.image || "/placeholder.svg",
            stock: product?.stock || 0,
          }
        })

        setCartItems(itemsWithDetails)
      } catch (err) {
        console.error("Failed to load cart products:", err)
        setCartItems([])
      } finally {
        setLoading(false)
      }
    }

    window.scrollTo(0, 0)
    checkUserStatus()
    loadCartItems()
  }, [])

  // Update quantity
  const handleQuantityChange = (id, change) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change)
        return { ...item, quantity: newQuantity }
      }
      return item
    })

    setCartItems(updatedCart)
    saveCartToLocalStorage(updatedCart)
  }

  // Remove item
  const handleRemoveItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id)
    setCartItems(updatedCart)
    saveCartToLocalStorage(updatedCart)
  }

  // Save cart to localStorage
  const saveCartToLocalStorage = (cart) => {
    const cartForStorage = cart.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }))
    localStorage.setItem("cart", JSON.stringify(cartForStorage))
  }

  // Apply coupon
  const handleApplyCoupon = () => {
    setCouponError("")
    setCouponSuccess("")

    if (couponCode.toLowerCase() === "welcome10") {
      setDiscount(10)
      setCouponSuccess("Coupon applied successfully!")
    } else if (couponCode.toLowerCase() === "save20") {
      setDiscount(20)
      setCouponSuccess("Coupon applied successfully!")
    } else {
      setCouponError("Invalid coupon code. Please try again.")
    }
  }

  // Navigate to checkout
  const handleCheckout = () => {
    navigate("/checkout")
  }

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  )

  const discountAmount = (subtotal * discount) / 100
  const shippingCost = subtotal >= 50 ? 0 : 5.99
  const total = subtotal - discountAmount + shippingCost

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
            <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-32 bg-neutral-100 rounded mb-4"></div>
              <div className="h-32 bg-neutral-100 rounded mb-4"></div>
              <div className="h-32 bg-neutral-100 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar user={user} setUser={setUser} loading={false} />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-neutral-300 mb-4" />
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Your cart is empty</h2>
            <p className="text-neutral-600 mb-6">Looks like you haven't added any products yet.</p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Start Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar user={user} setUser={setUser} loading={false} />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Your Cart</h1>
          <p className="text-neutral-600 mb-8">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <ul className="divide-y divide-neutral-200">
                  {cartItems.map((item) => (
                    <li key={item.id} className="p-6">
                      <div className="flex flex-col sm:flex-row">
                        <div className="flex-shrink-0 sm:w-24 sm:h-24 mb-4 sm:mb-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1 sm:ml-6">
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <div>
                              <Link
                                to={`/products/${item.productId}`}
                                className="text-lg font-medium text-neutral-900 hover:text-primary"
                              >
                                {item.name}
                              </Link>
                            </div>
                            <div className="mt-2 sm:mt-0 text-right">
                              <p className="text-lg font-bold text-neutral-900">${item.price}</p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center">
                              <button
                                onClick={() => handleQuantityChange(item.id, -1)}
                                disabled={item.quantity <= 1}
                                className="p-1 border border-neutral-300 rounded-l-md text-neutral-700 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <div className="w-10 text-center py-1 border-t border-b border-neutral-300">
                                {item.quantity}
                              </div>
                              <button
                                onClick={() => handleQuantityChange(item.id, 1)}
                                disabled={item.quantity >= item.stock}
                                className="p-1 border border-neutral-300 rounded-r-md text-neutral-700 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-neutral-500 hover:text-red-500 flex items-center"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              <span className="text-sm">Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Coupon & Continue Shopping */}
              <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon code"
                      className="block w-full rounded-md border border-neutral-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="absolute right-0 top-0 h-full px-4 text-primary font-medium hover:text-primary/80"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="mt-2 text-sm text-red-600">{couponError}</p>}
                  {couponSuccess && <p className="mt-2 text-sm text-green-600">{couponSuccess}</p>}
                </div>
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-4 py-3 text-base font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-bold mb-6">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({discount}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Shipping</span>
                    <span>{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="border-t border-neutral-200 pt-4 flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-xl">${total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-8">
                  <button
                    onClick={handleCheckout}
                    className="block w-full rounded-md bg-primary px-6 py-3 text-center font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    Proceed to Checkout
                  </button>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-sm text-neutral-500">We accept:</p>
                  <div className="flex justify-center space-x-2 mt-2">
                    <img src="/visa.png" alt="Visa" className="h-8" />
                    <img src="/mastercard.png" alt="Mastercard" className="h-8" />
                    <img src="/paypal.png" alt="PayPal" className="h-8" />
                    <img src="/applepay.png" alt="Apple Pay" className="h-8" />
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

export default Cart