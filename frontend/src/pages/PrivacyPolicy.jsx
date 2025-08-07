import React from "react";

export default function Policy() {
  return (
    <div className="bg-black text-white min-h-screen py-12 px-6 md:px-16">
      <h1 className="text-3xl md:text-5xl font-bold text-center text-[#FFD770] mb-10">
        Privacy Policy & Terms of Service
      </h1>

      <div className="max-w-4xl mx-auto space-y-10 text-gray-300">
        {/* Privacy Policy Section */}
        <section>
          <h2 className="text-2xl font-semibold text-[#FFD770] mb-4">
            Privacy Policy
          </h2>
          <p className="mb-4">
            At UKF-Outfits, your privacy is our priority. We collect only the
            necessary personal information to process orders, improve your
            shopping experience, and communicate updates.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Data Collection:</strong> Name, email, phone number,
              shipping address, and payment details.
            </li>
            <li>
              <strong>Usage:</strong> To fulfill orders, send updates, and
              personalize recommendations.
            </li>
            <li>
              <strong>Security:</strong> We use SSL encryption and secure
              servers to protect your data.
            </li>
            <li>
              <strong>Third Parties:</strong> We never sell your data. We only
              share it with trusted logistics and payment partners.
            </li>
          </ul>
        </section>

        {/* Terms of Service Section */}
    

        {/* Footer Note */}
        <p className="text-sm text-gray-400 mt-10 text-center">
          Last updated: August 2025. For questions, contact us at{" "}
          <span className="text-[#FFD770]">support@ukf-outfits.com</span>
        </p>
      </div>
    </div>
  );
}
