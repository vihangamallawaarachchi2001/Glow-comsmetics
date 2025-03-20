import CategoriesBanner from "../components/CategoriesBanner";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Newsletter from "../components/Newsletter";
import Recommendations from "../components/Recommendations";
import Testimonials from "../components/Testimonials";
import TopSellingItems from "../components/TopSellingItems";
import TrendingItems from "../components/TrendingItems";


import { useState, useEffect } from "react";

const VAPID_PUBLIC_KEY =
  "BDB1nMpC5HNjE87IY0Hm99QE_jsju4dkPjU7wX6qBA05PblvXRDZIaWr58RMvBtyo2onkd-hVeOAkNdK5aOZBU4";

async function requestPermission() {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    registerServiceWorker();
  } else {
    console.error("Notification permission denied.");
  }
}

async function registerServiceWorker() {
  try {
    const registration = await navigator.serviceWorker.register("/sw.js"); // Ensure correct path
    console.log("✅ Service Worker Registered:", registration);

    // Request push subscription
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    console.log("✅ Push Subscription:", subscription);

    // Send subscription to backend
    const response = await fetch("http://localhost:3000/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "67d9ca42fd7c17321afe0a41",
        subscription,
      }),
    });

    if (!response.ok) throw new Error("Failed to subscribe on the backend");
    console.log("✅ Subscribed to push notifications!");
  } catch (error) {
    console.error("❌ Service Worker Registration Failed:", error);
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
async function unsubscribeNotification() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      console.log("✅ Successfully unsubscribed from notifications.");
    } else {
      console.log("No subscription found.");
    }
  } catch (error) {
    console.error("❌ Failed to unsubscribe:", error);
  }
}

function Landing() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkUserStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await fetch("http://localhost:3000/api/users", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // Token invalid, remove it
            localStorage.removeItem("token");
          }
        }
      } catch (error) {
        console.error("Error checking user status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  useEffect(() => {
    //unsubscribeNotification();
    requestPermission();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar user={user} setUser={setUser} loading={loading} />
      <main>
        <Hero />
        {/* <TrendingItems /> */}
        <TopSellingItems />
        <CategoriesBanner />
        {user && <Recommendations user={user} />}
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}

export default Landing;
