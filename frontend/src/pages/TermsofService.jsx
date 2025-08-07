import React from "react";

export default function TermsOfService() {
  return (
    <div className="bg-black text-white min-h-screen py-12 px-6 md:px-16">
      <h1 className="text-3xl md:text-5xl font-bold text-center text-[#FFD770] mb-10">
        Terms of Service
      </h1>

      <div className="max-w-4xl mx-auto space-y-8 text-gray-300">
        <section>
          <h2 className="text-2xl font-semibold text-[#FFD770] mb-4">
            Acceptance of Terms
          </h2>
          <p>
            By accessing or using UKF-Outfits, you agree to be bound by these
            Terms of Service. If you do not agree, please refrain from using our
            platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#FFD770] mb-4">
            Account Registration
          </h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activities that occur under your
            account.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#FFD770] mb-4">
            Product Information & Pricing
          </h2>
          <p>
            We strive to ensure accurate product descriptions and pricing. In
            case of errors, we reserve the right to correct them and cancel
            affected orders.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#FFD770] mb-4">
            Shipping & Delivery
          </h2>
          <p>
            Orders are processed within 1–2 business days. Delivery timelines
            vary based on location and courier availability. Free shipping is
            available on qualifying orders.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#FFD770] mb-4">
            Intellectual Property
          </h2>
          <p>
            All content on UKF-Outfits, including images, logos, and text, is
            protected by copyright and may not be used without permission.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#FFD770] mb-4">
            Limitation of Liability
          </h2>
          <p>
            UKF-Outfits is not liable for any indirect or consequential damages
            arising from the use of our platform or products.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#FFD770] mb-4">
            Changes to Terms
          </h2>
          <p>
            We may update these Terms of Service at any time. Continued use of
            the platform implies acceptance of the revised terms.
          </p>
        </section>

        <p className="text-sm text-gray-400 mt-10 text-center">
          Last updated: August 2025. For questions, contact{" "}
          <span className="text-[#FFD770]">support@ukf-outfits.com</span>
        </p>
      </div>
    </div>
  );
}
