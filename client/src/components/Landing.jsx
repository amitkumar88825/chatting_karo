import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserShield,
  FaVideo,
  FaComments,
  FaGlobe,
  FaRocket,
  FaLock,
  FaUsers,
  FaMobileAlt,
  FaHeadset,
  FaCloudUploadAlt,
  FaRegSmile,
  FaRegHeart,
  FaRegStar,
  FaShieldAlt,
  FaChartLine,
  FaDatabase,
  FaRegClock,
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaEnvelope,
  FaArrowRight,
  FaCheckCircle,
  FaServer,
  FaCodeBranch,
  FaRobot,
} from "react-icons/fa";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-6 md:px-16 lg:px-24 py-5 border-b border-gray-800 sticky top-0 bg-gray-950/95 backdrop-blur-sm z-50">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            ChattingKaro
          </h1>
          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">BETA</span>
        </div>

        <div className="hidden md:flex space-x-8 text-gray-300">
          <a href="#features" className="hover:text-blue-400 transition">Features</a>
          <a href="#how-it-works" className="hover:text-blue-400 transition">How It Works</a>
          <a href="#pricing" className="hover:text-blue-400 transition">Pricing</a>
          <a href="#testimonials" className="hover:text-blue-400 transition">Testimonials</a>
        </div>

        <div className="space-x-3">
          <button onClick={() => navigate("/login")} className="text-gray-300 hover:text-white px-4 py-2">
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/25"
          >
            Sign Up Free
          </button>
        </div>
      </nav>

      {/* HERO - ENHANCED */}
      <section className="relative px-6 md:px-16 lg:px-24 py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-gray-700">
            <FaRocket className="text-blue-400 text-sm" />
            <span className="text-sm text-gray-300">⭐ Join 1M+ users worldwide</span>
          </div>
          
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
            Connect Instantly <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">
              Across the World
            </span>
          </h2>

          <p className="mt-6 text-gray-400 max-w-2xl mx-auto text-lg">
            A modern real-time chat platform designed for fast, secure and seamless
            conversations with people worldwide. Experience communication like never before.
          </p>

          <div className="mt-10 flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 font-semibold text-lg shadow-xl shadow-blue-500/30 flex items-center gap-2 transition-all"
            >
              Get Started Free <FaArrowRight />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-4 border border-gray-700 rounded-lg hover:bg-gray-800 font-semibold text-lg"
            >
              Watch Demo
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mt-6">No credit card required • Free forever plan</p>
        </div>
      </section>

      {/* TRUST / STATS - ENHANCED */}
      <section className="grid md:grid-cols-4 text-center gap-8 px-6 md:px-16 lg:px-24 py-16 border-y border-gray-800">
        <div className="group hover:scale-105 transition">
          <h3 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">1M+</h3>
          <p className="text-gray-400 mt-2">Active Users</p>
        </div>
        <div className="group hover:scale-105 transition">
          <h3 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">500K+</h3>
          <p className="text-gray-400 mt-2">Daily Chats</p>
        </div>
        <div className="group hover:scale-105 transition">
          <h3 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">150+</h3>
          <p className="text-gray-400 mt-2">Countries</p>
        </div>
        <div className="group hover:scale-105 transition">
          <h3 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">99.9%</h3>
          <p className="text-gray-400 mt-2">Uptime SLA</p>
        </div>
      </section>

      {/* FEATURES - ENHANCED (2 ROWS) */}
      <section id="features" className="px-6 md:px-16 lg:px-24 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Everything you need for seamless communication in one platform</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-gray-900 to-gray-900/50 p-8 rounded-2xl hover:scale-105 transition-all duration-300 border border-gray-800 hover:border-blue-500/50 group">
            <FaComments className="text-4xl text-blue-500 mb-4 group-hover:scale-110 transition" />
            <h3 className="text-xl font-semibold">Real-Time Chat</h3>
            <p className="text-gray-400 mt-2">Instant messaging powered by modern real-time technologies with typing indicators and read receipts.</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-900/50 p-8 rounded-2xl hover:scale-105 transition-all duration-300 border border-gray-800 hover:border-blue-500/50 group">
            <FaVideo className="text-4xl text-blue-500 mb-4 group-hover:scale-110 transition" />
            <h3 className="text-xl font-semibold">HD Video Calling</h3>
            <p className="text-gray-400 mt-2">High-quality video interactions with low latency, screen sharing, and background blur features.</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-900/50 p-8 rounded-2xl hover:scale-105 transition-all duration-300 border border-gray-800 hover:border-blue-500/50 group">
            <FaLock className="text-4xl text-blue-500 mb-4 group-hover:scale-110 transition" />
            <h3 className="text-xl font-semibold">End-to-End Encryption</h3>
            <p className="text-gray-400 mt-2">Military-grade encryption ensures your conversations stay private and secure.</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-900/50 p-8 rounded-2xl hover:scale-105 transition-all duration-300 border border-gray-800 hover:border-blue-500/50 group">
            <FaMobileAlt className="text-4xl text-blue-500 mb-4 group-hover:scale-110 transition" />
            <h3 className="text-xl font-semibold">Cross-Platform Sync</h3>
            <p className="text-gray-400 mt-2">Seamlessly switch between desktop, mobile, and web without missing a message.</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-900/50 p-8 rounded-2xl hover:scale-105 transition-all duration-300 border border-gray-800 hover:border-blue-500/50 group">
            <FaCloudUploadAlt className="text-4xl text-blue-500 mb-4 group-hover:scale-110 transition" />
            <h3 className="text-xl font-semibold">Cloud Storage</h3>
            <p className="text-gray-400 mt-2">Share files up to 100MB with unlimited cloud storage for all your media.</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-900/50 p-8 rounded-2xl hover:scale-105 transition-all duration-300 border border-gray-800 hover:border-blue-500/50 group">
            <FaRegSmile className="text-4xl text-blue-500 mb-4 group-hover:scale-110 transition" />
            <h3 className="text-xl font-semibold">Rich Emojis & GIFs</h3>
            <p className="text-gray-400 mt-2">Express yourself with thousands of emojis, GIFs, and custom stickers.</p>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US - ENHANCED */}
      <section className="px-6 md:px-16 lg:px-24 py-24 bg-gradient-to-b from-gray-900/50 to-transparent">
        <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose <span className="text-blue-500">ChattingKaro</span>?
            </h2>
            <p className="text-gray-400 mb-8 text-lg">
              We provide a seamless experience for connecting with people globally.
              Built with scalability, security, and performance in mind.
            </p>

            <div className="space-y-6">
              {[
                { icon: FaGlobe, text: "Global Connectivity", desc: "Connect with users from 150+ countries" },
                { icon: FaRocket, text: "Ultra Fast Performance", desc: "<50ms latency for real-time messaging" },
                { icon: FaUserShield, text: "Privacy Protection", desc: "GDPR compliant with data encryption" },
                { icon: FaServer, text: "99.9% Uptime Guarantee", desc: "Enterprise-grade infrastructure" },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className="text-blue-500 text-2xl group-hover:scale-110 transition">
                    <item.icon />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{item.text}</h4>
                    <p className="text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-700">
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <FaChartLine className="text-blue-500" /> Platform Highlights
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                <span>Message Delivery Speed</span>
                <span className="text-blue-400 font-semibold">&lt;50ms</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                <span>Active Servers</span>
                <span className="text-blue-400 font-semibold">25+ Worldwide</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                <span>Daily Active Users</span>
                <span className="text-blue-400 font-semibold">500K+</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                <span>Customer Satisfaction</span>
                <span className="text-blue-400 font-semibold">98.5%</span>
              </div>
            </div>
            <p className="text-gray-400 mt-6 text-sm">
              Built using modern technologies like WebSockets, scalable backend systems,
              and responsive frontend frameworks to deliver best-in-class experience.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - ENHANCED */}
      <section id="how-it-works" className="px-6 md:px-16 lg:px-24 py-24">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">How It Works</h2>
        <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">Get started in just 3 simple steps</p>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 group-hover:scale-110 transition shadow-lg shadow-blue-500/25">1</div>
            <h3 className="text-xl font-semibold mb-3">Create Account</h3>
            <p className="text-gray-400">Sign up in 30 seconds with email or social media. No credit card required.</p>
          </div>

          <div className="text-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 group-hover:scale-110 transition shadow-lg shadow-blue-500/25">2</div>
            <h3 className="text-xl font-semibold mb-3">Find Friends</h3>
            <p className="text-gray-400">Search for friends by username or connect with people worldwide.</p>
          </div>

          <div className="text-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 group-hover:scale-110 transition shadow-lg shadow-blue-500/25">3</div>
            <h3 className="text-xl font-semibold mb-3">Start Talking</h3>
            <p className="text-gray-400">Chat, share files, make voice/video calls in real-time.</p>
          </div>
        </div>
      </section>

      {/* PRICING SECTION - NEW */}
      <section id="pricing" className="px-6 md:px-16 lg:px-24 py-24 bg-gradient-to-b from-gray-900/50 to-transparent">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">Simple, Transparent Pricing</h2>
        <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">Choose the plan that works best for you</p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-blue-500/50 transition">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <p className="text-gray-400 mb-4">Perfect for getting started</p>
            <div className="text-4xl font-bold mb-6">$0<span className="text-lg text-gray-400">/month</span></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2"><FaCheckCircle className="text-green-500" /> 100 messages/day</li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-green-500" /> Basic chat features</li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-green-500" /> 1-on-1 messaging</li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-green-500" /> 5GB cloud storage</li>
            </ul>
            <button className="w-full py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition">Get Started</button>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-blue-900/20 rounded-2xl p-8 border-2 border-blue-500 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 px-3 py-1 rounded-full text-sm">Popular</div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <p className="text-gray-400 mb-4">For power users</p>
            <div className="text-4xl font-bold mb-6">$9.99<span className="text-lg text-gray-400">/month</span></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2"><FaCheckCircle className="text-green-500" /> Unlimited messages</li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-green-500" /> HD video calling</li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-green-500" /> Group chats (up to 50)</li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-green-500" /> 100GB cloud storage</li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-green-500" /> Priority support</li>
            </ul>
            <button className="w-full py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition">Upgrade to Pro</button>
          </div>

          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-blue-500/50 transition">
            <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
            <p className="text-gray-400 mb-4">For large organizations</p>
            <div className="text-4xl font-bold mb-6">Custom</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2"><FaCheckCircle className="text-green-500" /> Everything in Pro</li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-green-500" /> Custom integrations</li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-green-500" /> Dedicated support</li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-green-500" /> SSO & advanced security</li>
            </ul>
            <button className="w-full py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition">Contact Sales</button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION - NEW */}
      <section id="testimonials" className="px-6 md:px-16 lg:px-24 py-24">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">Loved by Users Worldwide</h2>
        <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">Join thousands of satisfied users who trust ChattingKaro</p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="flex gap-1 text-yellow-400 mb-4">★★★★★</div>
            <p className="text-gray-300 mb-4">"Best chat platform I've ever used! The video quality is amazing and it's super fast."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">JD</div>
              <div>
                <h4 className="font-semibold">John Doe</h4>
                <p className="text-gray-500 text-sm">Product Manager</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="flex gap-1 text-yellow-400 mb-4">★★★★★</div>
            <p className="text-gray-300 mb-4">"The encryption gives me peace of mind. Finally a secure platform for sensitive conversations."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">SM</div>
              <div>
                <h4 className="font-semibold">Sarah Miller</h4>
                <p className="text-gray-500 text-sm">Security Analyst</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="flex gap-1 text-yellow-400 mb-4">★★★★★</div>
            <p className="text-gray-300 mb-4">"Cross-platform sync works flawlessly. I can switch between devices without missing a beat."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">AK</div>
              <div>
                <h4 className="font-semibold">Alex Kumar</h4>
                <p className="text-gray-500 text-sm">Freelance Designer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION - ENHANCED */}
      <section className="relative px-6 md:px-16 lg:px-24 py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl"></div>
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 text-center max-w-4xl mx-auto border border-gray-700">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to Experience Real-Time Communication?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Join over 1 million users already using ChattingKaro for their daily conversations.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 font-semibold text-lg shadow-xl shadow-blue-500/30 flex items-center gap-2"
            >
              Create Free Account <FaArrowRight />
            </button>
            <button className="px-8 py-4 border border-gray-700 rounded-lg hover:bg-gray-800 font-semibold text-lg">
              Contact Sales
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-6">No credit card required • Free forever plan</p>
        </div>
      </section>

      {/* FOOTER - ENHANCED */}
      <footer className="border-t border-gray-800 py-12 px-6 md:px-16 lg:px-24">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">ChattingKaro</h3>
            <p className="text-gray-500 text-sm">Connecting people worldwide through seamless real-time communication.</p>
            <div className="flex gap-4 mt-4">
              <FaGithub className="text-gray-500 hover:text-white cursor-pointer transition" />
              <FaTwitter className="text-gray-500 hover:text-white cursor-pointer transition" />
              <FaLinkedin className="text-gray-500 hover:text-white cursor-pointer transition" />
              <FaEnvelope className="text-gray-500 hover:text-white cursor-pointer transition" />
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-500 text-sm">
              <li className="hover:text-white cursor-pointer">Features</li>
              <li className="hover:text-white cursor-pointer">Pricing</li>
              <li className="hover:text-white cursor-pointer">Security</li>
              <li className="hover:text-white cursor-pointer">Enterprise</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-500 text-sm">
              <li className="hover:text-white cursor-pointer">About Us</li>
              <li className="hover:text-white cursor-pointer">Blog</li>
              <li className="hover:text-white cursor-pointer">Careers</li>
              <li className="hover:text-white cursor-pointer">Press</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-500 text-sm">
              <li className="hover:text-white cursor-pointer">Help Center</li>
              <li className="hover:text-white cursor-pointer">Community</li>
              <li className="hover:text-white cursor-pointer">Status</li>
              <li className="hover:text-white cursor-pointer">Contact Us</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} ChattingKaro. All rights reserved.</p>
          <p className="mt-2">Made with <FaRegHeart className="inline text-red-500" /> for better communication</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;