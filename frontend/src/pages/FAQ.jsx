import React from "react";

const faqs = [
  {
    question: "What products does UKF-Outfits offer?",
    answer:
      "We specialize in trendy clothing, premium perfumes, and elegant wallets — curated for style-conscious individuals.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order is shipped, you'll receive a tracking link via email and SMS. You can also track it from your account dashboard.",
  },
  {
    question: "Do you offer free shipping?",
    answer:
      "Yes, we provide free shipping on orders above ₹999 across India. Express delivery options are also available at checkout.",
  },
  {
    question: "Are your perfumes authentic?",
    answer:
      "Absolutely. All our perfumes are 100% original and sourced directly from verified distributors and brands.",
  },
  {
    question: "Can I cancel or modify my order?",
    answer:
      "Orders can be modified or canceled after placement. After that, they are processed for dispatch.",
  },
];

export default function Faq() {
  return (
    <div className="bg-white text-gray-800 min-h-screen py-12 px-6 md:px-16">
      <h1 className="text-3xl md:text-5xl font-bold text-center text-[#ecba49] mb-10">
        Frequently Asked Questions
      </h1>

      <div className="max-w-4xl mx-auto space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-[#f9f9f9] border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold text-[#ecba49] mb-2">
              {faq.question}
            </h2>
            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}