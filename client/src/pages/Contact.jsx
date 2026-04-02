export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      
      <h1 className="text-3xl md:text-4xl mb-6">
        Contact Us 📞
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* CONTACT INFO */}
        <div className="bg-white/10 p-6 rounded-2xl">
          <h2 className="text-xl mb-4">Get in Touch</h2>

          <p className="mb-2">📧 Email: unisphere@gmail.com</p>
          <p className="mb-2">📞 Phone: +91 9876543210</p>
          <p className="mb-2">📍 Location: SR University Campus</p>

          <p className="mt-4 text-gray-400">
            For any queries related to events, registration or support, feel free to contact us.
          </p>
        </div>

        {/* CONTACT FORM */}
        <div className="bg-white/10 p-6 rounded-2xl">
          <h2 className="text-xl mb-4">Send Message</h2>

          <input
            type="text"
            placeholder="Your Name"
            className="w-full mb-3 p-2 rounded bg-gray-800 text-white"
          />

          <input
            type="email"
            placeholder="Your Email"
            className="w-full mb-3 p-2 rounded bg-gray-800 text-white"
          />

          <textarea
            placeholder="Your Message"
            className="w-full mb-4 p-2 rounded bg-gray-800 text-white"
          />

          <button
            onClick={() => alert("Message sent! (Demo)")}
            className="w-full bg-purple-600 py-2 rounded"
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}