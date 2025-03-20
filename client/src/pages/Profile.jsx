import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { User, Package, CreditCard, Settings, LogOut, Camera, Edit2 } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import axios from "axios"

const Profile = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("profile")
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  })

  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          navigate("/login")
          return
        }

        const response = await axios.get(`http://localhost:3000/api/users/${localStorage.getItem('id')}`)

        if (response.status !== 200) {
          if (response.status === 401) {
            localStorage.removeItem("token")
            navigate("/login")
            return
          }
          throw new Error("Failed to fetch user profile")
        }

        const userData = await response.data
        setUser(userData)

        // Initialize form data with user data
        setFormData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address: userData.address || "",
          city: userData.city || "",
          state: userData.state || "",
          zipCode: userData.zipCode || "",
          country: userData.country || "",
        })
      } catch (error) {
        console.error("Error fetching user profile:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:3000/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const updatedUser = await response.json()
      setUser(updatedUser)
      setEditMode(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      setError(error.message)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar user={user} setUser={setUser} loading={loading} />
        <div className="container mx-auto px-4 py-12 flex justify-center items-center">
          <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
        <Footer />
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Personal Information</h3>
              <button
                onClick={() => setEditMode(!editMode)}
                className="flex items-center text-sm font-medium text-primary hover:text-primary/80"
              >
                {editMode ? (
                  "Cancel"
                ) : (
                  <>
                    <Edit2 size={16} className="mr-1" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>

            {editMode ? (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700">
                      First name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700">
                      Last name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-neutral-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-neutral-700">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-neutral-700">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-neutral-700">
                      State / Province
                    </label>
                    <input
                      type="text"
                      name="state"
                      id="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-neutral-700">
                      ZIP / Postal code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-neutral-700">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      id="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="mr-3 rounded-md border border-neutral-300 bg-white py-2 px-4 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    Save
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row">
                  <div className="mb-6 sm:mb-0 sm:mr-8 flex flex-col items-center">
                    <div className="relative">
                      <div className="h-32 w-32 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
                        {user.profileImage ? (
                          <img
                            src={user.profileImage || "/placeholder.svg"}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="text-4xl text-neutral-400 font-bold">
                            {user.firstName && user.lastName
                              ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
                              : "U"}
                          </div>
                        )}
                      </div>
                      <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-sm hover:bg-primary/90">
                        <Camera size={16} />
                      </button>
                    </div>
                    <h3 className="mt-4 text-lg font-medium">{`${user.firstName || ""} ${user.lastName || ""}`}</h3>
                    <p className="text-sm text-neutral-500">{user.email}</p>
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500">Full name</h4>
                      <p>{`${user.firstName || "N/A"} ${user.lastName || ""}`}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500">Email address</h4>
                      <p>{user.email || "N/A"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500">Phone number</h4>
                      <p>{user.phone || "N/A"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500">Address</h4>
                      <p>{user.address || "N/A"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500">City</h4>
                      <p>{user.city || "N/A"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500">State / Province</h4>
                      <p>{user.state || "N/A"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500">ZIP / Postal code</h4>
                      <p>{user.zipCode || "N/A"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500">Country</h4>
                      <p>{user.country || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      case "orders":
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold mb-6">Order History</h3>

            {user.orders && user.orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {user.orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                          #{order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              order.status === "Delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "Processing"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.status === "Shipped"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-neutral-100 text-neutral-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <a href={`/orders/${order.id}`} className="text-primary hover:text-primary/80">
                            View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-neutral-400" />
                <h3 className="mt-2 text-sm font-medium text-neutral-900">No orders yet</h3>
                <p className="mt-1 text-sm text-neutral-500">Get started by exploring our products.</p>
                <div className="mt-6">
                  <a
                    href="/products"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Browse products
                  </a>
                </div>
              </div>
            )}
          </div>
        )
      case "payment":
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold mb-6">Payment Methods</h3>

            {user.paymentMethods && user.paymentMethods.length > 0 ? (
              <div className="space-y-4">
                {user.paymentMethods.map((method) => (
                  <div key={method.id} className="border rounded-lg p-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="mr-4">
                        {method.type === "visa" ? (
                          <img src="/placeholder.svg?height=30&width=50" alt="Visa" className="h-8" />
                        ) : method.type === "mastercard" ? (
                          <img src="/placeholder.svg?height=30&width=50" alt="Mastercard" className="h-8" />
                        ) : (
                          <CreditCard className="h-8 w-8 text-neutral-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-neutral-500">**** **** **** {method.last4}</p>
                        <p className="text-xs text-neutral-400">
                          Expires {method.expMonth}/{method.expYear}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-sm text-primary hover:text-primary/80">Edit</button>
                      <button className="text-sm text-red-600 hover:text-red-500">Remove</button>
                    </div>
                  </div>
                ))}

                <button className="mt-4 inline-flex items-center px-4 py-2 border border-neutral-300 shadow-sm text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  Add payment method
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <CreditCard className="mx-auto h-12 w-12 text-neutral-400" />
                <h3 className="mt-2 text-sm font-medium text-neutral-900">No payment methods</h3>
                <p className="mt-1 text-sm text-neutral-500">Add a payment method to make checkout faster.</p>
                <div className="mt-6">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    Add payment method
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      case "settings":
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold mb-6">Account Settings</h3>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium mb-4">Email Notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="order-updates"
                        name="order-updates"
                        type="checkbox"
                        defaultChecked={true}
                        className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="order-updates" className="font-medium text-neutral-700">
                        Order updates
                      </label>
                      <p className="text-neutral-500">Get notified when your order status changes</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="promotions"
                        name="promotions"
                        type="checkbox"
                        defaultChecked={true}
                        className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="promotions" className="font-medium text-neutral-700">
                        Promotions and sales
                      </label>
                      <p className="text-neutral-500">Receive emails about new promotions and sales</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="new-products"
                        name="new-products"
                        type="checkbox"
                        defaultChecked={false}
                        className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="new-products" className="font-medium text-neutral-700">
                        New product announcements
                      </label>
                      <p className="text-neutral-500">Be the first to know about new products</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-200">
                <h4 className="text-lg font-medium mb-4">Password</h4>
                <button className="inline-flex items-center px-4 py-2 border border-neutral-300 shadow-sm text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  Change password
                </button>
              </div>

              <div className="pt-6 border-t border-neutral-200">
                <h4 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h4>
                <button className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  Delete account
                </button>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar user={user} setUser={setUser} loading={false} />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
          {/* Sidebar */}
          <div className="bg-white rounded-lg shadow-sm p-4 h-fit">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                  activeTab === "profile" ? "bg-primary/10 text-primary" : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <User className="mr-3 h-5 w-5" />
                Profile
              </button>

              <button
                onClick={() => setActiveTab("orders")}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                  activeTab === "orders" ? "bg-primary/10 text-primary" : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <Package className="mr-3 h-5 w-5" />
                Orders
              </button>

              <button
                onClick={() => setActiveTab("payment")}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                  activeTab === "payment" ? "bg-primary/10 text-primary" : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <CreditCard className="mr-3 h-5 w-5" />
                Payment Methods
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                  activeTab === "settings" ? "bg-primary/10 text-primary" : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-red-700 hover:bg-red-50"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </button>
            </nav>
          </div>

          {/* Main content */}
          <div>
            {error && <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md text-sm">{error}</div>}

            {renderTabContent()}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Profile

