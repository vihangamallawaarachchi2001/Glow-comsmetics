
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import {
  Star,
  ShoppingBag,
  Heart,
  Share2,
  ChevronRight,
  Minus,
  Plus,
  Truck,
  RefreshCw,
  Shield,
  ThumbsUp,
  MessageCircle,
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
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [user, setUser] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [reviews, setReviews] = useState([])
  const [activeTab, setActiveTab] = useState("description")

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
      }
    }

    const fetchProduct = async () => {
      try {
        // In a real app, this would be a fetch call to your API
        // Simulating API call with timeout
        setTimeout(() => {
          // Mock product data
          const mockProduct = {
            id: Number.parseInt(id),
            name: "Hydrating Facial Serum",
            description:
              "Our bestselling facial serum is packed with hyaluronic acid and vitamin C to hydrate and brighten your skin. This lightweight formula absorbs quickly, leaving your skin feeling refreshed and looking radiant.",
            price: 39.99,
            rating: 4.8,
            reviews: 124,
            category: "Skincare",
            stock: 25,
            images: [
              "/placeholder.svg?height=600&width=600",
              "/placeholder.svg?height=600&width=600",
              "/placeholder.svg?height=600&width=600",
              "/placeholder.svg?height=600&width=600",
            ],
            variants: [
              {
                id: 1,
                name: "30ml",
                price: 39.99,
              },
              {
                id: 2,
                name: "50ml",
                price: 59.99,
              },
              {
                id: 3,
                name: "Travel Size (15ml)",
                price: 19.99,
              },
            ],
            features: [
              "Deeply hydrates and plumps skin",
              "Brightens dull complexion",
              "Reduces the appearance of fine lines",
              "Suitable for all skin types",
              "Dermatologist tested",
              "Fragrance-free",
            ],
            instructions: "Apply 2-3 drops to clean, damp skin morning and night. Follow with moisturizer.",
            ingredients:
              "Water, Glycerin, Propanediol, Sodium Hyaluronate, Ascorbic Acid (Vitamin C), Panthenol, Niacinamide, Tocopherol (Vitamin E), Citric Acid, Phenoxyethanol, Ethylhexylglycerin.",
            isSale: true,
            discount: 15,
          }

          setProduct(mockProduct)
          setSelectedVariant(mockProduct.variants[0])

          // Mock reviews
          const mockReviews = [
            {
              id: 1,
              user: "Sarah J.",
              rating: 5,
              date: "2023-10-15",
              title: "Amazing product!",
              content:
                "I've been using this serum for a month now and my skin has never looked better. It's hydrating without being greasy and has really improved my skin texture.",
              avatar: "/placeholder.svg?height=50&width=50",
            },
            {
              id: 2,
              user: "Michael T.",
              rating: 4,
              date: "2023-09-28",
              title: "Good but pricey",
              content:
                "This is a great serum and I've seen good results, but I think it's a bit expensive for the size. Still, the quality is there so I'll probably repurchase.",
              avatar: "/placeholder.svg?height=50&width=50",
            },
            {
              id: 3,
              user: "Emily R.",
              rating: 5,
              date: "2023-09-10",
              title: "Holy grail product",
              content:
                "I have dry, sensitive skin and this serum has been a game changer for me. It's gentle yet effective, and layers beautifully under my other products.",
              avatar: "/placeholder.svg?height=50&width=50",
            },
          ]
          setReviews(mockReviews)

          // Mock related products
          const mockRelatedProducts = [
            {
              id: 101,
              name: "Moisturizing Face Cream",
              price: 45.99,
              image: "/placeholder.svg?height=300&width=300",
              rating: 4.6,
            },
            {
              id: 102,
              name: "Brightening Eye Cream",
              price: 29.99,
              image: "/placeholder.svg?height=300&width=300",
              rating: 4.7,
            },
            {
              id: 103,
              name: "Gentle Facial Cleanser",
              price: 24.99,
              image: "/placeholder.svg?height=300&width=300",
              rating: 4.9,
            },
            {
              id: 104,
              name: "Exfoliating Face Scrub",
              price: 19.99,
              image: "/placeholder.svg?height=300&width=300",
              rating: 4.5,
            },
          ]
          setRelatedProducts(mockRelatedProducts)

          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching product:", error)
        setError("Failed to load product details. Please try again later.")
        setLoading(false)
      }
    }

    window.scrollTo(0, 0)
    checkUserStatus()
    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    // In a real app, this would send the data to your cart API
    console.log("Adding to cart:", {
      productId: product.id,
      variantId: selectedVariant?.id,
      quantity: quantity,
    })

    // Show a success toast/notification
    alert(`${quantity} x ${product.name} (${selectedVariant?.name}) added to cart!`)
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
    if (product.isSale && product.discount) {
      return (price * (1 - product.discount / 100)).toFixed(2)
    }
    return price.toFixed(2)
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
      <Navbar user={user} setUser={setUser} loading={false} />

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

            {/* Product Details */}
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
                  {product.isSale ? (
                    <>
                      <span className="text-3xl font-bold text-primary">
                        ${getDiscountedPrice(selectedVariant ? selectedVariant.price : product.price)}
                      </span>
                      <span className="text-xl text-neutral-500 line-through ml-3">
                        ${(selectedVariant ? selectedVariant.price : product.price).toFixed(2)}
                      </span>
                      <span className="ml-3 bg-rose-100 text-rose-800 text-sm font-medium px-2 py-1 rounded">
                        {product.discount}% OFF
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold">
                      ${(selectedVariant ? selectedVariant.price : product.price).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-neutral-600">{product.description}</p>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div>
                  <h3 className="font-medium text-neutral-900 mb-2">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        className={`px-4 py-2 rounded-md border ${
                          selectedVariant?.id === variant.id
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-neutral-300 text-neutral-700 hover:border-primary"
                        }`}
                        onClick={() => setSelectedVariant(variant)}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
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
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary text-white font-medium py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center"
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Add to Cart
                </button>
                <button className="flex items-center justify-center py-3 px-6 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors">
                  <Heart className="mr-2 h-5 w-5" />
                  Add to Wishlist
                </button>
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
                  <ThumbsUp className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Satisfaction Guaranteed</h4>
                    <p className="text-xs text-neutral-500">Love it or your money back</p>
                  </div>
                </div>
              </div>

              {/* Share */}
              <div className="flex items-center border-t border-neutral-200 pt-6">
                <span className="text-sm font-medium text-neutral-700 mr-4">Share:</span>
                <div className="flex space-x-2">
                  <button className="p-2 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs: Description, Features, Reviews */}
          <div className="border-t border-neutral-200">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab("description")}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === "description"
                    ? "border-b-2 border-primary text-primary"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("features")}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === "features"
                    ? "border-b-2 border-primary text-primary"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Features
              </button>
              <button
                onClick={() => setActiveTab("howToUse")}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === "howToUse"
                    ? "border-b-2 border-primary text-primary"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                How to Use
              </button>
              <button
                onClick={() => setActiveTab("ingredients")}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === "ingredients"
                    ? "border-b-2 border-primary text-primary"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Ingredients
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === "reviews"
                    ? "border-b-2 border-primary text-primary"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Reviews ({reviews.length})
              </button>
            </div>

            <div className="p-6">
              {activeTab === "description" && (
                <div className="prose max-w-none">
                  <p>{product.description}</p>
                  <p>
                    Our Hydrating Facial Serum is packed with powerful ingredients that work together to transform your
                    skin. The hyaluronic acid attracts and retains moisture, plumping the skin and reducing the
                    appearance of fine lines. Vitamin C brightens and evens skin tone while providing antioxidant
                    protection against environmental stressors.
                  </p>
                  <p>
                    This lightweight formula absorbs quickly without feeling sticky or heavy, making it perfect for
                    layering under other skincare products. It's suitable for all skin types, including sensitive skin,
                    and can be used both morning and night.
                  </p>
                </div>
              )}

              {activeTab === "features" && (
                <div>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="text-primary mr-2">•</div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "howToUse" && (
                <div className="prose max-w-none">
                  <p>{product.instructions}</p>
                  <ol className="list-decimal pl-5 space-y-2 mt-4">
                    <li>Cleanse your face and pat dry.</li>
                    <li>If using toner, apply it before the serum.</li>
                    <li>
                      Dispense 2-3 drops of serum onto your fingertips and gently press into your skin, avoiding the eye
                      area.
                    </li>
                    <li>Allow to absorb for 30 seconds.</li>
                    <li>Follow with moisturizer and SPF (for morning routine).</li>
                  </ol>
                  <p className="mt-4">
                    <strong>Pro tip:</strong> For deeper hydration, apply to slightly damp skin.
                  </p>
                </div>
              )}

              {activeTab === "ingredients" && (
                <div className="prose max-w-none">
                  <p>{product.ingredients}</p>
                  <div className="mt-4">
                    <h4 className="font-medium">Key Ingredients:</h4>
                    <ul className="mt-2 space-y-2">
                      <li>
                        <strong>Hyaluronic Acid:</strong> Attracts and holds up to 1000x its weight in water, hydrating
                        and plumping the skin.
                      </li>
                      <li>
                        <strong>Vitamin C:</strong> A powerful antioxidant that brightens skin and protects against
                        environmental damage.
                      </li>
                      <li>
                        <strong>Niacinamide:</strong> Improves skin texture, minimizes pores, and strengthens the skin
                        barrier.
                      </li>
                      <li>
                        <strong>Vitamin E:</strong> Provides additional antioxidant protection and helps soothe the
                        skin.
                      </li>
                    </ul>
                  </div>
                  <p className="mt-4 text-sm text-neutral-500">
                    Free from parabens, sulfates, phthalates, and artificial fragrances. Not tested on animals.
                  </p>
                </div>
              )}

              {activeTab === "reviews" && (
                <div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold">Customer Reviews</h3>
                      <div className="flex items-center mt-1">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-current" : "text-neutral-300"}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-neutral-600 ml-2">Based on {product.reviews} reviews</span>
                      </div>
                    </div>
                    <button className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Write a Review
                    </button>
                  </div>

                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-neutral-200 pb-6">
                        <div className="flex items-start">
                          <img
                            src={review.avatar || "/placeholder.svg"}
                            alt={review.user}
                            className="h-10 w-10 rounded-full mr-4 object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{review.user}</h4>
                              <span className="text-sm text-neutral-500">{review.date}</span>
                            </div>
                            <div className="flex text-amber-400 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-neutral-300"}`}
                                />
                              ))}
                            </div>
                            <h5 className="font-medium mt-2">{review.title}</h5>
                            <p className="text-neutral-600 mt-1">{review.content}</p>
                            <div className="flex items-center mt-3">
                              <button className="text-sm text-neutral-500 hover:text-primary flex items-center">
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                Helpful
                              </button>
                              <span className="mx-2 text-neutral-300">|</span>
                              <button className="text-sm text-neutral-500 hover:text-primary">Report</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <Link to={`/products/${product.id}`} className="block aspect-square overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                <div className="p-4">
                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-medium text-lg mb-2 hover:text-primary transition-colors">{product.name}</h3>
                  </Link>

                  <div className="flex items-center mb-3">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-current" : "text-neutral-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-neutral-500 ml-1">{product.rating}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                    <button className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
                      <ShoppingBag size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

    </div>
  )
}

export default SingleProduct

