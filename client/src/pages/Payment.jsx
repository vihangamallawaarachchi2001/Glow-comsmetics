import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const Payment = () => {
  const [user] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [billingAddress, setBillingAddress] = useState({
    sameAsShipping: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  // Load cart items and shipping info from session or localStorage
  useEffect(() => {
    const loadCartAndShippingInfo = async () => {
      try {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        if (!storedCart.length) {
          navigate("/checkout");
          return;
        }

        const productPromises = storedCart.map(async (item) => {
          const res = await fetch(
            `http://localhost:3000/api/product/${item.id}`
          );
          if (!res.ok) throw new Error("Failed to load product");

          const productData = await res.json();

          return {
            id: item.id,
            productId: productData._id,
            name: productData.name,
            price: parseFloat(productData.price).toFixed(2),
            quantity: item.quantity,
            image: productData.image.startsWith("http")
              ? productData.image
              : `https://picsum.photos/id/${Math.floor(
                  Math.random() * 100
                )}/300/300`,
          };
        });

        const products = await Promise.all(productPromises);
        setCartItems(products);
      } catch (err) {
        console.error("Failed to load cart:", err);
        navigate("/cart");
      } finally {
        setLoading(false);
      }
    };

    const checkUserStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await fetch("http://localhost:3000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          localStorage.removeItem("token");
        }
      }
    };

    window.scrollTo(0, 0);
    checkUserStatus();
    loadCartAndShippingInfo();
  }, [navigate]);

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4}/g);
    const match = matches ? matches.join(" ") : "";
    return match;
  };

  const validateForm = () => {
    const errors = {};

    if (!agreeTerms) {
      errors.terms = "You must agree to the terms and conditions.";
    }

    if (paymentMethod === "credit-card") {
      if (
        !cardDetails.cardNumber ||
        cardDetails.cardNumber.replace(/\s+/g, "").length !== 16
      ) {
        errors.cardNumber = "Please enter a valid 16-digit card number.";
      }
      if (
        !cardDetails.expiry ||
        !/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiry)
      ) {
        errors.expiry = "Please enter a valid expiry date (MM/YY).";
      }
      if (
        !cardDetails.cvv ||
        cardDetails.cvv.length < 3 ||
        cardDetails.cvv.length > 4
      ) {
        errors.cvv = "CVV must be 3 or 4 digits.";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setProcessing(true);

    let userId = localStorage.getItem("id").toString(); // fallback as per your sample


    // Build order payload
    const items = cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    const subtotal = cartItems.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    );

    const shippingCost = subtotal >= 50 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const totalAmount = subtotal + shippingCost + tax;

    const orderPayload = {
      userId,
      items,
      totalAmount: totalAmount.toFixed(2),
    };

    try {
      const res = await axios.post("http://localhost:3000/api/order", orderPayload);

      if (res.status !== 201) {
        throw new Error("Failed to place order");
      }

      // Clear cart
      localStorage.removeItem("cart");

      // Generate PDF
      generateOrderPDF(orderPayload, subtotal, shippingCost, tax);

      // Redirect to success
      setTimeout(() => {
        navigate("/order-success");
      }, 1000);
    } catch (err) {
      alert("Something went wrong while placing your order.");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const generateOrderPDF = (order, subtotal, shipping, tax) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Order Confirmation", 14, 22);

    doc.setFontSize(12);
    doc.text(`Order ID: ${Date.now()}`, 14, 32);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 40);
    doc.text(`Customer ID: ${order.userId}`, 14, 48);
    doc.text(`Payment Method: Credit Card`, 14, 56);

    doc.setFontSize(14);
    doc.text("Products Purchased", 14, 70);

    let y = 80;
    order.items.forEach((item, index) => {
      doc.setFontSize(12);
      doc.text(`${index + 1}. ${item.productId} x${item.quantity}`, 14, y);
      y += 10;
    });

    y += 10;
    doc.line(14, y, 190, y);
    y += 10;
    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 140, y);
    y += 10;
    doc.text(`Shipping: $${shipping.toFixed(2)}`, 140, y);
    y += 10;
    doc.text(`Tax (8%): $${tax.toFixed(2)}`, 140, y);
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text(`Total: $${(subtotal + shipping + tax).toFixed(2)}`, 140, y);

    doc.save("Order-Confirmation.pdf");
  };

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );
  const shippingCost = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar user={user} setUser={() => {}} loading={true} />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <h1 className="text-2xl font-bold mb-6">Payment</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-10 bg-neutral-200 rounded"></div>
                <div className="h-10 bg-neutral-200 rounded"></div>
                <div className="h-10 bg-neutral-200 rounded w-1/2"></div>
              </div>
              <div className="h-64 bg-neutral-200 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar user={user} setUser={() => {}} loading={false} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Payment</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">Payment Method</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="flex items-center">
                    <input
                      id="credit-card"
                      name="paymentMethod"
                      type="radio"
                      checked={paymentMethod === "credit-card"}
                      onChange={() => setPaymentMethod("credit-card")}
                      className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor="credit-card"
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      Credit Card
                    </label>
                  </div>

                  {paymentMethod === "credit-card" && (
                    <div className="space-y-4 pl-7">
                      <div>
                        <label
                          htmlFor="cardNumber"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Card Number
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          value={cardDetails.cardNumber || ""}
                          onChange={handleCardChange}
                          placeholder="1234 5678 9012 3456"
                          className={`block w-full rounded-md border ${
                            formErrors.cardNumber
                              ? "border-red-300"
                              : "border-gray-300"
                          } py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary`}
                        />
                        {formErrors.cardNumber && (
                          <p className="mt-1 text-sm text-red-600">
                            {formErrors.cardNumber}
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="expiry"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Expiration Date
                          </label>
                          <input
                            type="text"
                            id="expiry"
                            name="expiry"
                            value={cardDetails.expiry}
                            onChange={handleCardChange}
                            placeholder="MM/YY"
                            className={`block w-full rounded-md border ${
                              formErrors.expiry
                                ? "border-red-300"
                                : "border-gray-300"
                            } py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary`}
                          />
                          {formErrors.expiry && (
                            <p className="mt-1 text-sm text-red-600">
                              {formErrors.expiry}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="cvv"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            CVV
                          </label>
                          <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            value={cardDetails.cvv}
                            onChange={handleCardChange}
                            placeholder="123"
                            className={`block w-full rounded-md border ${
                              formErrors.cvv
                                ? "border-red-300"
                                : "border-gray-300"
                            } py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary`}
                          />
                          {formErrors.cvv && (
                            <p className="mt-1 text-sm text-red-600">
                              {formErrors.cvv}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={() => setAgreeTerms(!agreeTerms)}
                      className="h-4 w-4 mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor="terms"
                      className="ml-3 block text-sm text-gray-600"
                    >
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="underline text-primary hover:text-primary/80"
                      >
                        terms and conditions
                      </Link>
                      .
                    </label>
                  </div>
                  {formErrors.terms && (
                    <p className="text-sm text-red-600 -mt-3 ml-7">
                      {formErrors.terms}
                    </p>
                  )}

                  <div className="pt-6 flex justify-between">
                    <button
                      onClick={() => navigate("/checkout")}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Back to Shipping
                    </button>
                    <button
                      type="submit"
                      disabled={processing}
                      className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {processing ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V4m0 0l-4 4m4-4l4 4M20 12a8 8 0 00-8-8v4a4 4 0 014 4H4m9 11l3-3m-3 3v-6m-3 6h6"
                            ></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        "Complete Order"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-4 flex items-start">
                    <div className="w-16 h-16 mr-4 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mt-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shippingCost === 0
                      ? "Free"
                      : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-xl">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 bg-gray-50 p-4 rounded-md border border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 flex items-center">
                  <span>Secure Checkout</span>
                </h3>
                <p className="mt-1 text-xs text-gray-600">
                  Your personal data is protected with SSL encryption.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
