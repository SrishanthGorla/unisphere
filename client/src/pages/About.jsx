export default function About() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          About UniSphere
        </h1>

        <div className="space-y-8">
          {/* Mission Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">🎯 Our Mission</h2>
            <p className="text-gray-300 leading-relaxed">
              UniSphere is dedicated to connecting students with transformative events and opportunities at SR University.
              We believe that every student deserves access to enriching experiences that foster growth, learning, and
              community building. Our platform serves as a bridge between event organizers and enthusiastic participants,
              creating memorable moments that shape futures.
            </p>
          </div>

          {/* What We Do */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">🚀 What We Do</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">For Students</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Discover exciting events across all categories</li>
                  <li>• Easy registration and event management</li>
                  <li>• Track your event participation history</li>
                  <li>• Connect with like-minded peers</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">For Organizers</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Streamlined event creation and management</li>
                  <li>• Real-time registration tracking</li>
                  <li>• Comprehensive analytics and insights</li>
                  <li>• Community engagement tools</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Our Story */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">📖 Our Story</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Founded in 2026, UniSphere emerged from a simple observation: students were missing out on incredible
              opportunities because they didn't know where to look. Our founders, a group of passionate students and
              faculty members, recognized the need for a centralized platform that could bring together the vibrant
              event ecosystem of SR University.
            </p>
            <p className="text-gray-300 leading-relaxed">
              What started as a small project has grown into a comprehensive platform that serves thousands of students
              and supports hundreds of events annually. We're proud to be part of the SR University community and
              committed to continuously improving our platform to better serve our users.
            </p>
          </div>

          {/* Team Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold mb-6 text-purple-400">👥 Our Team</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">👨‍💻</span>
                </div>
                <h3 className="font-semibold">Sanjay Karupothula</h3>
                <p className="text-gray-400 text-sm">Lead Developer</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">👩‍🎨</span>
                </div>
                <h3 className="font-semibold">Dharmatej</h3>
                <p className="text-gray-400 text-sm">UI/UX Designer</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">👨‍🏫</span>
                </div>
                <h3 className="font-semibold">B. Naveen Kumar</h3>
                <p className="text-gray-400 text-sm">Project Manager</p>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-2xl p-8 border border-purple-500/30 text-center">
            <h2 className="text-2xl font-bold mb-4">Get In Touch</h2>
            <p className="text-gray-300 mb-6">
              Have questions or suggestions? We'd love to hear from you!
            </p>
            <button
              onClick={() => window.location.hash = '#contact'}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}