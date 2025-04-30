import "./App.css";

import React from "react";
import { Routes, Route, BrowserRouter as Router, useLocation } from "react-router-dom";
import { SnackbarProvider } from "notistack";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Landing from "./pages/Landing";
import About from "./pages/About";
import Contact from "./pages/Contactus";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Products from "./pages/Products";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import SingleProduct from "./pages/SingleProduct";
import Payment from "./pages/Payment";
import OrderSuccess from "./pages/OrderSuccess";
import Test from "./pages/test";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";

// Reviews
import MainReview from "./pages/reviews/MainReview";
import CreateReview from "./pages/reviews/CreateReview";

// FAQs
import MainFAQ from "./pages/faqs/MainFAQ";
import CreateFAQ from "./pages/faqs/CreateFAQ";
import ManageReview from "./pages/reviews/ManageReview";
import EditReview from "./pages/reviews/EditReview";
import ManageFAQ from "./pages/faqs/ManageFAQ";
import EditFAQ from "./pages/faqs/EditFAQ";

const AppLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contactus" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<Products />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product" element={<SingleProduct />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/test" element={<Test />} />

        {/* Admin Route */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/manage-reviews" element={<ManageReview />} />
        <Route path='/admin/manage-faqs' element={<ManageFAQ />} />
        <Route path="/admin/answer-faq/:id" element={<EditFAQ />} />

        {/* Review Pages */}
        <Route path="/reviews" element={<MainReview />} />
        <Route path="/create-review" element={<CreateReview />} />
        <Route path="/admin/edit-review/:id" element={<EditReview />} />

        {/* FAQ Pages */}
        <Route path="/faqs" element={<MainFAQ />} />
        <Route path="/create-faq" element={<CreateFAQ />} />
      </Routes>

      {!isAdminRoute && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <SnackbarProvider>
      <Router>
        <AppLayout />
      </Router>
    </SnackbarProvider>
  );
};

export default App;



// const VAPID_PUBLIC_KEY =
//   "BDB1nMpC5HNjE87IY0Hm99QE_jsju4dkPjU7wX6qBA05PblvXRDZIaWr58RMvBtyo2onkd-hVeOAkNdK5aOZBU4";

// async function requestPermission() {
//   const permission = await Notification.requestPermission();
//   if (permission === "granted") {
//     registerServiceWorker();
//   } else {
//     console.error("Notification permission denied.");
//   }
// }

// async function registerServiceWorker() {
//   try {
//     const registration = await navigator.serviceWorker.register("/sw.js"); // Ensure correct path
//     console.log("✅ Service Worker Registered:", registration);

//     // Request push subscription
//     const subscription = await registration.pushManager.subscribe({
//       userVisibleOnly: true,
//       applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
//     });

//     console.log("✅ Push Subscription:", subscription);

//     // Send subscription to backend
//     const response = await fetch("http://localhost:3000/subscribe", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         userId: "67d9ca42fd7c17321afe0a41",
//         subscription,
//       }),
//     });

//     if (!response.ok) throw new Error("Failed to subscribe on the backend");
//     console.log("✅ Subscribed to push notifications!");
//   } catch (error) {
//     console.error("❌ Service Worker Registration Failed:", error);
//   }
// }

// function urlBase64ToUint8Array(base64String) {
//   const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
//   const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
//   const rawData = window.atob(base64);
//   const outputArray = new Uint8Array(rawData.length);
//   for (let i = 0; i < rawData.length; ++i) {
//     outputArray[i] = rawData.charCodeAt(i);
//   }
//   return outputArray;
// }
// async function unsubscribeNotification() {
//   try {
//     const registration = await navigator.serviceWorker.ready;
//     const subscription = await registration.pushManager.getSubscription();

//     if (subscription) {
//       await subscription.unsubscribe();
//       console.log("✅ Successfully unsubscribed from notifications.");
//     } else {
//       console.log("No subscription found.");
//     }
//   } catch (error) {
//     console.error("❌ Failed to unsubscribe:", error);
//   }
// }

//function App() {
  // const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
    // Check if user is logged in
  //   const checkUserStatus = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       if (token) {
  //         const response = await fetch("http://localhost:3000/api/users", {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         });

  //         if (response.ok) {
  //           const userData = await response.json();
  //           setUser(userData);
  //         } else {
  //           // Token invalid, remove it
  //           localStorage.removeItem("token");
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error checking user status:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   checkUserStatus();
  // }, []);

  // useEffect(() => {
  //   //unsubscribeNotification();
  //   requestPermission();
  // }, []);

  //return (
  //  <Router>
   //   <Routes>
   //     <Route element={<Landing />} path="/"/>
   //     <Route element={<About />} path="/about"/>
    //    <Route element={<Contact />} path="/contact"/>
    //    <Route element={<Login />} path="/login"/>
  //      <Route element={<Signup />} path="/signup"/>
  //      <Route element={<Products />} path="/products"/>
  //      <Route element={<Profile />} path="/profile"/>
 //       <Route element={<Cart />} path="/cart"/>
 //       <Route element={<Checkout />} path="/checkout"/>
  //      <Route element={<SingleProduct />} path="/product"/>
 //       <Route element={<Payment />} path="/payment"/>
 //       <Route element={<OrderSuccess />} path="/order-success"/>
 //       <Route element={<Dashboard />} path="/admin"/>
//        <Route element={<Test />} path="/test"/>
//      </Routes>
//    </Router>
//  );
//}

//export default App;
