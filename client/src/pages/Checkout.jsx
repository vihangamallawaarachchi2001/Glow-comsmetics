import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ChevronRight, Building, Shield, User, MapPin, Mail, Phone } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const Checkout = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cartItems, setCartItems] = useState([])
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  })
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [saveAddress, setSaveAddress] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const navigate = useNavigate()

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
            // Pre-fill form with user data if available
            if (userData) {
              setShippingAddress({
                firstName: userData.firstName || "",
                lastName: userData.lastName || "",
                email: userData.email || "",
                phone: userData.phone || "",
                address: userData.address || "",
                city: userData.city || "",
                state: userData.state || "",
                zipCode: userData.zipCode || "",
                country: userData.country || "United States",
              })
            }
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

    // Fetch cart items
    const fetchCartItems = () => {
      // In a real app, this would be a fetch call to your API
      // Simulating API call with timeout
      setTimeout(() => {
        // Mock cart data
        const mockCartItems = [
          {
            id: 1,
            productId: 101,
            name: "Hydrating Facial Serum",
            variant: "30ml",
            price: 39.99,
            quantity: 2,
            image: "/placeholder.svg?height=300&width=300",
          },
          {
            id: 2,
            productId: 205,
            name: "Vitamin C Brightening Cream",
            variant: "50g",
            price: 49.99,
            quantity: 1,
            image: "/placeholder.svg?height=300&width=300",
          },
          {
            id: 3,
            productId: 312,
            name: "Exfoliating Face Scrub",
            variant: "100ml",
            price: 19.99,
            quantity: 1,
            image: "/placeholder.svg?height=300&width=300",
          },
        ]
        setCartItems(mockCartItems)
      }, 800)
    }

    window.scrollTo(0, 0)
    checkUserStatus()
    fetchCartItems()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    const errors = {}
    const requiredFields = ["firstName", "lastName", "email", "phone", "address", "city", "state", "zipCode", "country"]

    requiredFields.forEach((field) => {
      if (!shippingAddress[field]) {
        errors[field] = "This field is required"
      }
    })

    // Email validation
    if (shippingAddress.email && !/\S+@\S+\.\S+/.test(shippingAddress.email)) {
      errors.email = "Please enter a valid email address"
    }

    // Phone validation (simple validation)
    if (shippingAddress.phone && !/^\d{10,}$/.test(shippingAddress.phone.replace(/[^0-9]/g, ""))) {
      errors.phone = "Please enter a valid phone number"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      // In a real app, you would send the shipping address and method to your API
      console.log("Shipping address:", shippingAddress)
      console.log("Shipping method:", shippingMethod)
      console.log("Save address:", saveAddress)

      // Redirect to payment page
      navigate("/payment")
    } else {
      // Scroll to the first error
      const firstError = document.querySelector(".text-red-600")
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }

  // Calculate order summary
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = 0 // No discount in checkout phase for simplicity
  let shippingCost = 0

  switch (shippingMethod) {
    case "standard":
      shippingCost = subtotal >= 50 ? 0 : 5.99
      break
    case "express":
      shippingCost = 12.99
      break
    case "overnight":
      shippingCost = 24.99
      break
    default:
      shippingCost = subtotal >= 50 ? 0 : 5.99
  }

  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal - discountAmount + shippingCost + tax

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar user={user} setUser={setUser} loading={loading} />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse bg-white rounded-lg shadow-sm p-6 max-w-6xl mx-auto">
            <div className="h-8 bg-neutral-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                <div className="h-10 bg-neutral-200 rounded"></div>
                <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                <div className="h-10 bg-neutral-200 rounded"></div>
              </div>
              <div className="h-64 bg-neutral-200 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Your cart is empty</h2>
            <p className="text-neutral-600 mb-6">You need to add products to your cart before checkout.</p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
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
                <Link to="/cart" className="text-neutral-500 hover:text-primary">
                  Cart
                </Link>
              </li>
              <ChevronRight className="mx-2 h-4 w-4 text-neutral-400" />
              <li className="text-neutral-900 font-medium">Checkout</li>
            </ol>
          </nav>

          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Shipping Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-primary" />
                  Shipping Information
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-1">
                        First Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-neutral-400" />
                        </div>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={shippingAddress.firstName}
                          onChange={handleChange}
                          className={`block w-full pl-10 rounded-md border ${
                            formErrors.firstName ? "border-red-300" : "border-neutral-300"
                          } py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary`}
                        />
                      </div>
                      {formErrors.firstName && <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>}
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={shippingAddress.lastName}
                        onChange={handleChange}
                        className={`block w-full rounded-md border ${
                          formErrors.lastName ? "border-red-300" : "border-neutral-300"
                        } py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary`}
                      />
                      {formErrors.lastName && <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                        Email *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-neutral-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={shippingAddress.email}
                          onChange={handleChange}
                          className={`block w-full pl-10 rounded-md border ${
                            formErrors.email ? "border-red-300" : "border-neutral-300"
                          } py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary`}
                        />
                      </div>
                      {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                        Phone *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-neutral-400" />
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={shippingAddress.phone}
                          onChange={handleChange}
                          className={`block w-full pl-10 rounded-md border ${
                            formErrors.phone ? "border-red-300" : "border-neutral-300"
                          } py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary`}
                        />
                      </div>
                      {formErrors.phone && <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-1">
                      Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building className="h-5 w-5 text-neutral-400" />
                      </div>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={shippingAddress.address}
                        onChange={handleChange}
                        className={`block w-full pl-10 rounded-md border ${
                          formErrors.address ? "border-red-300" : "border-neutral-300"
                        } py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary`}
                      />
                    </div>
                    {formErrors.address && <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleChange}
                        className={`block w-full rounded-md border ${
                          formErrors.city ? "border-red-300" : "border-neutral-300"
                        } py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary`}
                      />
                      {formErrors.city && <p className="mt-1 text-sm text-red-600">{formErrors.city}</p>}
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-neutral-700 mb-1">
                        State / Province *
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleChange}
                        className={`block w-full rounded-md border ${
                          formErrors.state ? "border-red-300" : "border-neutral-300"
                        } py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary`}
                      />
                      {formErrors.state && <p className="mt-1 text-sm text-red-600">{formErrors.state}</p>}
                    </div>

                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-neutral-700 mb-1">
                        ZIP / Postal Code *
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={shippingAddress.zipCode}
                        onChange={handleChange}
                        className={`block w-full rounded-md border ${
                          formErrors.zipCode ? "border-red-300" : "border-neutral-300"
                        } py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary`}
                      />
                      {formErrors.zipCode && <p className="mt-1 text-sm text-red-600">{formErrors.zipCode}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-neutral-700 mb-1">
                      Country *
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleChange}
                      className={`block w-full rounded-md border ${
                        formErrors.country ? "border-red-300" : "border-neutral-300"
                      } py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary`}
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Japan">Japan</option>
                    </select>
                    {formErrors.country && <p className="mt-1 text-sm text-red-600">{formErrors.country}</p>}
                  </div>

                  <div className="flex items-center">
                    <input
                      id="saveAddress"
                      name="saveAddress"
                      type="checkbox"
                      checked={saveAddress}
                      onChange={() => setSaveAddress(!saveAddress)}
                      className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="saveAddress" className="ml-2 block text-sm text-neutral-700">
                      Save this address for future orders
                    </label>
                  </div>

                  <h3 className="text-lg font-medium mt-8 mb-4">Shipping Method</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id="shipping-standard"
                        name="shippingMethod"
                        type="radio"
                        checked={shippingMethod === "standard"}
                        onChange={() => setShippingMethod("standard")}
                        className="h-4 w-4 border-neutral-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="shipping-standard" className="ml-3 block text-sm font-medium text-neutral-700">
                        <div className="flex justify-between w-full">
                          <span>Standard Shipping (3-5 business days)</span>
                          <span>{subtotal >= 50 ? "Free" : "$5.99"}</span>
                        </div>
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="shipping-express"
                        name="shippingMethod"
                        type="radio"
                        checked={shippingMethod === "express"}
                        onChange={() => setShippingMethod("express")}
                        className="h-4 w-4 border-neutral-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="shipping-express" className="ml-3 block text-sm font-medium text-neutral-700">
                        <div className="flex justify-between w-full">
                          <span>Express Shipping (2-3 business days)</span>
                          <span>$12.99</span>
                        </div>
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="shipping-overnight"
                        name="shippingMethod"
                        type="radio"
                        checked={shippingMethod === "overnight"}
                        onChange={() => setShippingMethod("overnight")}
                        className="h-4 w-4 border-neutral-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="shipping-overnight" className="ml-3 block text-sm font-medium text-neutral-700">
                        <div className="flex justify-between w-full">
                          <span>Overnight Shipping (1 business day)</span>
                          <span>$24.99</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-between">
                    <Link
                      to="/cart"
                      className="inline-flex items-center px-4 py-2 border border-neutral-300 shadow-sm text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      Back to Cart
                    </Link>
                    <button
                      type="submit"
                      className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                <div className="divide-y divide-neutral-200">
                  {cartItems.map((item) => (
                    <div key={item.id} className="py-4 flex">
                      <div className="flex-shrink-0 w-16 h-16 mr-4">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full rounded-md object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-neutral-900">{item.name}</h3>
                        <p className="text-sm text-neutral-500">
                          {item.variant} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-neutral-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 mt-6">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Shipping</span>
                    <span className="font-medium">
                      {shippingMethod === "standard" && subtotal >= 50 ? "Free" : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Tax (8%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-neutral-200 pt-4 flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-xl">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 bg-neutral-50 p-4 rounded-md border border-neutral-200">
                  <h3 className="text-sm font-medium text-neutral-900 flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-primary" />
                    Secure Checkout
                  </h3>
                  <p className="mt-1 text-xs text-neutral-600">
                    Your personal data is protected with SSL encryption. We do not store your credit card information.
                  </p>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium text-neutral-900 mb-2">We Accept</h3>
                  <div className="flex space-x-2">
                    <img src="/placeholder.svg?height=30&width=50" alt="Visa" className="h-8" />
                    <img src="/placeholder.svg?height=30&width=50" alt="Mastercard" className="h-8" />
                    <img src="/placeholder.svg?height=30&width=50" alt="PayPal" className="h-8" />
                    <img src="/placeholder.svg?height=30&width=50" alt="Apple Pay" className="h-8" />
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

export default Checkout

