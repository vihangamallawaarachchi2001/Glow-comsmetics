
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ChevronRight, CreditCard, Calendar, Lock, User, Shield, Check, MapPin, CreditCardIcon } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const Payment = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cartItems, setCartItems] = useState([])
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })
  const [billingAddress, setBillingAddress] = useState({
    sameAsShipping: true,
  })
  const [formErrors, setFormErrors] = useState({})
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [processing, setProcessing] = useState(false)
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

    // Fetch cart items and shipping info (would come from previous checkout step in a real app)
    const fetchCartAndShippingInfo = () => {
      // In a real app, this would be a fetch call to your API or from state management
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
    fetchCartAndShippingInfo()
  }, [])

  const handleCardChange = (e) => {
    const { name, value } = e.target
    setCardDetails((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const formatCardNumber = (value) => {
    return value
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim()
  }

  const formatExpiryDate = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .substr(0, 5)
  }

  const validateForm = () => {
    const errors = {}

    if (paymentMethod === "credit-card") {
      // Credit card validation
      if (!cardDetails.cardNumber.trim()) {
        errors.cardNumber = "Card number is required"
      } else if (cardDetails.cardNumber.replace(/\s/g, "").length < 16) {
        errors.cardNumber = "Please enter a valid card number"
      }

      if (!cardDetails.cardName.trim()) {
        errors.cardName = "Name on card is required"
      }

      if (!cardDetails.expiryDate.trim()) {
        errors.expiryDate = "Expiry date is required"
      } else if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
        errors.expiryDate = "Please enter a valid expiry date (MM/YY)"
      }

      if (!cardDetails.cvv.trim()) {
        errors.cvv = "CVV is required"
      } else if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
        errors.cvv = "Please enter a valid CVV"
      }
    }

    if (!agreeTerms) {
      errors.agreeTerms = "You must agree to the terms and conditions"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      setProcessing(true)

      // Simulate payment processing
      setTimeout(() => {
        // In a real app, you would send payment details to your payment processor
        console.log("Payment method:", paymentMethod)
        console.log("Card details:", cardDetails)
        console.log("Billing address:", billingAddress)

        // Redirect to success page after payment is processed
        navigate("/order-success")
      }, 2000)
    }
  }

  // Calculate order summary
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingCost = subtotal >= 50 ? 0 : 5.99
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shippingCost + tax

  // Mock shipping address (would come from previous step in a real app)
  const shippingAddress = {
    name: "John Doe",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
  }

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
              <li>
                <Link to="/checkout" className="text-neutral-500 hover:text-primary">
                  Checkout
                </Link>
              </li>
              <ChevronRight className="mx-2 h-4 w-4 text-neutral-400" />
              <li className="text-neutral-900 font-medium">Payment</li>
            </ol>
          </nav>

          <h1 className="text-3xl font-bold mb-8">Payment</h1>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <CreditCardIcon className="mr-2 h-5 w-5 text-primary" />
                  Payment Method
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id="credit-card"
                        name="paymentMethod"
                        type="radio"
                        checked={paymentMethod === "credit-card"}
                        onChange={() => setPaymentMethod("credit-card")}
                        className="h-4 w-4 border-neutral-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="credit-card" className="ml-3 block text-sm font-medium text-neutral-700">
                        Credit / Debit Card
                      </label>
                      <div className="ml-auto flex space-x-2">
                        <img src="/placeholder.svg?height=30&width=50" alt="Visa" className="h-8" />
                        <img src="/placeholder.svg?height=30&width=50" alt="Mastercard" className="h-8" />
                        <img src="/placeholder.svg?height=30&width=50" alt="Amex" className="h-8" />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="paypal"
                        name="paymentMethod"
                        type="radio"
                        checked={paymentMethod === "paypal"}
                        onChange={() => setPaymentMethod("paypal")}
                        className="h-4 w-4 border-neutral-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-neutral-700">
                        PayPal
                      </label>
                      <img src="/placeholder.svg?height=30&width=50" alt="PayPal" className="h-8 ml-auto" />
                    </div>

                    <div className="flex items-center">
                      <input
                        id="apple-pay"
                        name="paymentMethod"
                        type="radio"
                        checked={paymentMethod === "apple-pay"}
                        onChange={() => setPaymentMethod("apple-pay")}
                        className="h-4 w-4 border-neutral-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="apple-pay" className="ml-3 block text-sm font-medium text-neutral-700">
                        Apple Pay
                      </label>
                      <img src="/placeholder.svg?height=30&width=50" alt="Apple Pay" className="h-8 ml-auto" />
                    </div>
                  </div>

                  {paymentMethod === "credit-card" && (
                    <div className="space-y-6 pt-4">
                      <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-neutral-700 mb-1">
                          Card Number *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CreditCard className="h-5 w-5 text-neutral-400" />
                          </div>
                          <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={cardDetails.cardNumber}
                            onChange={(e) => {
                              const formattedValue = formatCardNumber(e.target.value)
                              setCardDetails({ ...cardDetails, cardNumber: formattedValue })
                            }}
                            maxLength={19}
                            className={`block w-full pl-10 rounded-md border ${
                              formErrors.cardNumber ? "border-red-300" : "border-neutral-300"
                            } py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary`}
                          />
                        </div>
                        {formErrors.cardNumber && <p className="mt-1 text-sm text-red-600">{formErrors.cardNumber}</p>}
                      </div>

                      <div>
                        <label htmlFor="cardName" className="block text-sm font-medium text-neutral-700 mb-1">
                          Name on Card *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-neutral-400" />
                          </div>
                          <input
                            type="text"
                            id="cardName"
                            name="cardName"
                            placeholder="John Doe"
                            value={cardDetails.cardName}
                            onChange={handleCardChange}
                            className={`block w-full pl-10 rounded-md border ${
                              formErrors.cardName ? "border-red-300" : "border-neutral-300"
                            } py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary`}
                          />
                        </div>
                        {formErrors.cardName && <p className="mt-1 text-sm text-red-600">{formErrors.cardName}</p>}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="expiryDate" className="block text-sm font-medium text-neutral-700 mb-1">
                            Expiry Date *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Calendar className="h-5 w-5 text-neutral-400" />
                            </div>
                            <input
                              type="text"
                              id="expiryDate"
                              name="expiryDate"
                              placeholder="MM/YY"
                              value={cardDetails.expiryDate}
                              onChange={(e) => {
                                const formattedValue = formatExpiryDate(e.target.value)
                                setCardDetails({ ...cardDetails, expiryDate: formattedValue })
                              }}
                              maxLength={5}
                              className={`block w-full pl-10 rounded-md border ${
                                formErrors.expiryDate ? "border-red-300" : "border-neutral-300"
                              } py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary`}
                            />
                          </div>
                          {formErrors.expiryDate && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.expiryDate}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="cvv" className="block text-sm font-medium text-neutral-700 mb-1">
                            CVV *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="h-5 w-5 text-neutral-400" />
                            </div>
                            <input
                              type="text"
                              id="cvv"
                              name="cvv"
                              placeholder="123"
                              value={cardDetails.cvv}
                              onChange={handleCardChange}
                              maxLength={4}
                              className={`block w-full pl-10 rounded-md border ${
                                formErrors.cvv ? "border-red-300" : "border-neutral-300"
                              } py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary`}
                            />
                          </div>
                          {formErrors.cvv && <p className="mt-1 text-sm text-red-600">{formErrors.cvv}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-6 border-t border-neutral-200">
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <MapPin className="mr-2 h-5 w-5 text-primary" />
                      Billing Address
                    </h3>

                    <div className="flex items-center mb-4">
                      <input
                        id="sameAsShipping"
                        name="sameAsShipping"
                        type="checkbox"
                        checked={billingAddress.sameAsShipping}
                        onChange={() =>
                          setBillingAddress((prev) => ({ ...prev, sameAsShipping: !prev.sameAsShipping }))
                        }
                        className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="sameAsShipping" className="ml-2 block text-sm text-neutral-700">
                        Same as shipping address
                      </label>
                    </div>

                    {billingAddress.sameAsShipping && (
                      <div className="bg-neutral-50 p-4 rounded-md mt-2">
                        <p className="font-medium">{shippingAddress.name}</p>
                        <p className="text-neutral-600">{shippingAddress.address}</p>
                        <p className="text-neutral-600">
                          {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                        </p>
                        <p className="text-neutral-600">{shippingAddress.country}</p>
                      </div>
                    )}

                    {/* Add billing address form here if !billingAddress.sameAsShipping */}
                  </div>

                  <div className="flex items-start pt-6">
                    <div className="flex items-center h-5">
                      <input
                        id="agreeTerms"
                        name="agreeTerms"
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={() => setAgreeTerms(!agreeTerms)}
                        className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="agreeTerms" className="font-medium text-neutral-700">
                        I agree to the{" "}
                        <Link to="/terms" className="text-primary hover:text-primary/80">
                          Terms and Conditions
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-primary hover:text-primary/80">
                          Privacy Policy
                        </Link>
                      </label>
                      {formErrors.agreeTerms && <p className="mt-1 text-sm text-red-600">{formErrors.agreeTerms}</p>}
                    </div>
                  </div>

                  <div className="pt-6 flex justify-between">
                    <Link
                      to="/checkout"
                      className="inline-flex items-center px-4 py-2 border border-neutral-300 shadow-sm text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      Back to Shipping
                    </Link>
                    <button
                      type="submit"
                      disabled={processing}
                      className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {processing ? (
                        <>
                          <div className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                          Processing...
                        </>
                      ) : (
                        "Complete Order"
                      )}
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
                    <span className="font-medium">{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
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

                <div className="mt-6 space-y-4">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium">Your order qualifies for free standard shipping</h3>
                      <p className="text-xs text-neutral-500">Delivery estimate: 3-5 business days</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium">Secure payment</h3>
                      <p className="text-xs text-neutral-500">Your payment information is encrypted</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-neutral-50 p-4 rounded-md border border-neutral-200">
                  <h3 className="text-sm font-medium text-neutral-900 mb-2">Need Help?</h3>
                  <p className="text-xs text-neutral-600 mb-1">Call our customer service team at (555) 123-4567</p>
                  <p className="text-xs text-neutral-600">
                    Email us at{" "}
                    <a href="mailto:support@glowcosmetics.com" className="text-primary">
                      support@glowcosmetics.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Payment

