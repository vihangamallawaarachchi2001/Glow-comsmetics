import React, { useState } from 'react';

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Subscribing email:", email);
    setSubscribed(true);
    setEmail("");
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-r from-primary/10 to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Beauty Community</h2>
          <p className="text-neutral-600 mb-8">
            Subscribe to our newsletter for exclusive offers, beauty tips, and first access to new product launches.
          </p>

          {subscribed ? (
            <div className="bg-green-50 text-green-700 px-6 py-4 rounded-lg">
              <p className="font-medium">Thank you for subscribing!</p>
              <p className="text-sm">Check your inbox for a confirmation email and exciting offers.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}  className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
              <input className='w-full sm:flex-1 outline-none' type="email" placeholder='Enter Your Email Here!' required/>
              <button type='submit' className='bg-black text-white text-xs px-10 py-4'>Subscribe</button>
            </form>
          )}

          <p className="text-xs text-neutral-500 mt-4">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;
