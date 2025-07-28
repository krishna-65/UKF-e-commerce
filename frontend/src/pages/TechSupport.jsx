import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Mail,
  Phone,
  Headphones,
  Zap,
  Shield,
  Clock,
  CheckCircle,
} from 'lucide-react';

export default function TechSupport() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const supportOptions = [
    {
      icon: MessageCircle,
      title: 'Chat with us ',
      description: 'Get instant support through WhatsApp.',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Mail,
      title: 'Send us an email',
      description: 'Detailed technical support via email. Perfect for complex issues.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Phone,
      title: 'Call our hotline',
      description: 'Speak directly with our technical experts for immediate assistance.',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  const features = [
    { icon: Clock, text: '24/7 Support Available' },
    { icon: Shield, text: 'Premium Security' },
    { icon: Zap, text: 'Lightning Fast Response' },
    { icon: CheckCircle, text: '100% Issue Resolution' },
  ];

  return (
    <div className="lg:w-[calc(100vw-256px)] w-full min-h-screen lg:h-[100vh] bg-black text-white px-4 relative overflow-y-scroll hidescroll">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10 z-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-400 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-300 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-500 rounded-full filter blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-30 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto py-12">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block p-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mb-6 animate-spin-slow">
            <Headphones className="w-12 h-12 text-black" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent animate-pulse">
            Welcome to TechBro24 Premium Support
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Our dedicated team is here to help you resolve any technical issue quickly and efficiently.
            Experience premium support like never before.
          </p>
        </div>

        {/* Features */}
        <div className={`flex justify-center flex-wrap gap-4 mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2 bg-gray-900 bg-opacity-50 backdrop-blur-sm px-4 py-2 rounded-full border border-yellow-400 border-opacity-30 hover:border-opacity-100 transition-all duration-300 hover:scale-105">
              <feature.icon className="w-5 h-5 text-yellow-400" />
              <span className="text-sm">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Cards */}
        <div className="flex flex-col items-center md:flex-row md:justify-center md:space-x-8 space-y-8 md:space-y-0">
          {supportOptions.map((option, index) => (
            <div
              key={index}
              className={`w-[280px] h-[420px] flex-shrink-0 group cursor-pointer transition-all duration-700 delay-${index * 200} ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
              }`}
              onMouseEnter={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-yellow-400 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-r ${option.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}></div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-0.5">
                  <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl"></div>
                </div>

                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div>
                    <div className={`w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-r ${option.color} flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12`}>
                      <option.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-center mb-3 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300">
                      {option.title}
                    </h3>
                    <p className="text-sm text-center text-gray-300 group-hover:text-white transition-colors duration-300 line-clamp-3">
                      {option.description}
                    </p>
                  </div>
                  <div className={`text-center mt-4 transition-all duration-500 ${activeCard === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-1.5 rounded-full text-sm font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105">
                      Get Started
                    </button>
                  </div>
                </div>

                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-yellow-400 to-transparent opacity-20 rounded-bl-full transform transition-all duration-500 group-hover:scale-150"></div>
              </div>
            </div>
          ))}
        </div>

   

{/* Bottom Section */}
<div className={`text-center mt-16 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
  <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-2xl border border-yellow-400 border-opacity-30 max-w-xl mx-auto">
    <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-2">Why Choose TechBro24?</h2>
    <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-4">
      We're not just another tech support service. We're your technology partners, committed to providing
      exceptional service with cutting-edge solutions and unmatched expertise.
    </p>
    <div className="flex justify-center flex-wrap gap-2">
      <span className="px-4 py-1 border-2 border-[#FFD700] bg-opacity-20 rounded-full text-yellow-400 text-sm font-medium">
        Expert Team
      </span>
      <span className="px-4 py-1 border-2 border-[#FFD700] bg-opacity-20 rounded-full text-yellow-400 text-sm font-medium">
        Fast Response
      </span>
      <span className="px-4 py-1 border-2 border-[#FFD700] bg-opacity-20 rounded-full text-yellow-400 text-sm font-medium">
        Premium Quality
      </span>
    </div>
  </div>
</div>

</div>

<style jsx>{`
  @keyframes spin-slow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .animate-spin-slow {
    animation: spin-slow 8s linear infinite;
  }
`}</style>
</div>
  );
}