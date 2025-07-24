import React from 'react';

const ContactUs = () => {
  return (
    <div className="mb-4">
      {/* 🖤 Header Section */}
      <header className="bg-black text-[#FFD700] text-center py-10 px-4">
        <h1 className="text-3xl font-semibold mb-2">Contact UKF-Outfits</h1>
        <p className="max-w-2xl mx-auto text-sm">
          Got questions about our fashion collections? Whether you're curious about sizes, shipping, or partnerships—reach out to us. We're here to help!
        </p>
      </header>

      {/* 📍 Info Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <div className="bg-black text-[#FFD700] rounded-lg shadow-md p-4">
          <h2 className="text-lg font-bold mb-2">📍 Our Location</h2>
          <p>UKF-Outfits HQ<br/>Mall Road, Kotdwara, Uttarakhand – 246149</p>
        </div>
        <div className="bg-black text-[#FFD700] rounded-lg shadow-md p-4">
          <h2 className="text-lg font-bold mb-2">📞 Call Us</h2>
          <p>Customer Care: +91-1234567890<br/>Email: support@ukfoutfits.com</p>
        </div>
        <div className="bg-black text-[#FFD700] rounded-lg shadow-md p-4">
          <h2 className="text-lg font-bold mb-2">📨 Collaborations</h2>
          <p>For business queries, email:<br/>partnerships@ukfoutfits.com</p>
        </div>
      </section>

      {/* 📝 Contact Form */}
      <section className="bg-black shadow-2xl max-w-3xl mx-auto rounded-xl p-6 my-6">
        <h2 className="text-xl font-bold mb-4 text-[#FFD700]">📝 Drop Us a Message</h2>
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Name"
            className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-gray-700 text-[#FFD700]"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-gray-700 text-[#FFD700]"
            required
          />
          <input
            type="text"
            placeholder="Subject"
            className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-gray-700 text-[#FFD700]"
            required
          />
          <textarea
            placeholder="Your Message"
            className="border rounded-md p-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-gray-700 text-[#FFD700]"
            required
          />
          <button
            type="submit"
            className="bg-gray-900 text-[#FFD700] py-3 rounded-md hover:bg-gray-700 transition duration-200"
          >
            Send Message
          </button>
        </form>
      </section >

      
    </div>
  );
};

export default ContactUs;
