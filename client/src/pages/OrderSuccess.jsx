import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { CheckCircle, Package, Calendar, ArrowRight, ChevronRight, Truck } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const OrderSuccess = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [orderDetails, setOrderDetails] = useState(null)

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

    // Generate mock order details
    const generateOrderDetails = () => {
      // In a real app, this would be fetched from your API
      setTimeout(() => {
        const currentDate = new Date()
        const deliveryDate = new Date(currentDate)
        deliveryDate.setDate(deliveryDate.getDate() + 5)

        const mockOrderDetails = {
          orderId: "ORD-" + Math.floor(100000 + Math.random() * 900000),
          orderDate: currentDate.toLocaleDateString(),
          estimatedDelivery: deliveryDate.toLocaleDateString(),
          total: 149.95,
          paymentMethod: "Credit Card (ending in 4242)",
          shippingAddress: {
            name: "John Doe",
            address: "123 Main St",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            country: "United States",
          },
          items: [
            {
              id: 1,
              name: "Hydrating Facial Serum",
              variant: "30ml",
              price: 39.99,
              quantity: 2,
              image: "/placeholder.svg?height=300&width=300",
            },
            {
              id: 2,
              name: "Vitamin C Brightening Cream",
              variant: "50g",
              price: 49.99,
              quantity: 1,
              image: "/placeholder.svg?height=300&width=300",
            },
            {
              id: 3,
              name: "Exfoliating Face Scrub",
              variant: "100ml",
              price: 19.99,
              quantity: 1,
              image: "/placeholder.svg?height=300&width=300",
            },
          ],
        }

        setOrderDetails(mockOrderDetails)
      }, 1000)
    }

    window.scrollTo(0, 0)
    checkUserStatus()
    generateOrderDetails()
  }, [])

  if (loading || !orderDetails) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse bg-white rounded-lg shadow-sm p-6 max-w-3xl mx-auto">
            <div className="h-8 bg-neutral-200 rounded w-1/2 mx-auto mb-6"></div>
            <div className="h-16 bg-green-100 rounded-lg mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-neutral-200 rounded w-full"></div>
              <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
              <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="mb-8">
            <ol className="flex items-center text-sm">
              <li>
                <Link to="/" className="text-neutral-500 hover:text-primary">
                  Home
                </Link>
              </li>
              <ChevronRight className="mx-2 h-4 w-4 text-neutral-400" />
              <li className="text-neutral-900 font-medium">Order Confirmation</li>
            </ol>
          </nav>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 text-center border-b border-neutral-200">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Order Confirmed!</h1>
              <p className="text-neutral-600">
                Thank you for your purchase. Your order has been received and is being processed.
              </p>
            </div>

            <div className="p-6">
              <div className="bg-green-50 rounded-lg p-4 mb-6 flex items-start">
                <div className="mr-4 mt-1">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h2 className="font-medium text-green-800">
                    Order #{orderDetails.orderId} - Placed on {orderDetails.orderDate}
                  </h2>
                  <p className="text-green-700 text-sm">A confirmation email has been sent to your email address.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    Estimated Delivery
                  </h3>
                  <p className="text-neutral-900">{orderDetails.estimatedDelivery}</p>
                </div>

                <div className="bg-neutral-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Truck className="h-4 w-4 mr-2 text-primary" />
                    Shipping Address
                  </h3>
                  <p className="text-neutral-900">{orderDetails.shippingAddress.name}</p>
                  <p className="text-neutral-700 text-sm">
                    {orderDetails.shippingAddress.address}, {orderDetails.shippingAddress.city},{" "}
                    {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zipCode}
                  </p>
                </div>

                <div className="bg-neutral-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                    Payment Method
                  </h3>
                  <p className="text-neutral-900">{orderDetails.paymentMethod}</p>
                </div>
              </div>

              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="divide-y divide-neutral-200 mb-6">
                {orderDetails.items.map((item) => (
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

              <div className="border-t border-neutral-200 pt-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-medium">
                    ${(orderDetails.total - 5.99 - orderDetails.total * 0.08).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-neutral-600">Shipping</span>
                  <span className="font-medium">$5.99</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-neutral-600">Tax</span>
                  <span className="font-medium">${(orderDetails.total * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${orderDetails.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center px-6 py-3 border border-neutral-300 rounded-md shadow-sm text-base font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Continue Shopping
                </Link>

                {user && (
                  <Link
                    to="/profile"
                    className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    View Your Orders
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default OrderSuccess

