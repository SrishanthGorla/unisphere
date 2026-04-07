export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Privacy Policy
        </h1>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 space-y-6">
          <div className="text-sm text-gray-400 mb-6">
            Last updated: April 7, 2026
          </div>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">1. Information We Collect</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              We collect information you provide directly to us, such as when you:
            </p>
            <ul className="text-gray-300 space-y-2 ml-6">
              <li>• Create an account or register for events</li>
              <li>• Update your profile information</li>
              <li>• Contact us for support</li>
              <li>• Participate in surveys or promotions</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-3">
              This may include your name, email address, phone number, college information, and event preferences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">2. How We Use Your Information</h2>
            <p className="text-gray-300 leading-relaxed mb-3">We use the information we collect to:</p>
            <ul className="text-gray-300 space-y-2 ml-6">
              <li>• Provide, maintain, and improve our services</li>
              <li>• Process event registrations and send confirmations</li>
              <li>• Send you technical notices and support messages</li>
              <li>• Communicate with you about events and updates</li>
              <li>• Monitor and analyze usage patterns and trends</li>
              <li>• Detect, investigate, and prevent fraudulent transactions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">3. Information Sharing</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy:
            </p>
            <ul className="text-gray-300 space-y-2 ml-6">
              <li>• <strong>Event Organizers:</strong> Basic registration information may be shared with event organizers</li>
              <li>• <strong>Service Providers:</strong> We may share information with trusted third parties who assist us in operating our platform</li>
              <li>• <strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights</li>
              <li>• <strong>Business Transfers:</strong> In the event of a merger or acquisition, user information may be transferred</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">4. Data Security</h2>
            <p className="text-gray-300 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information against
              unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the
              internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">5. Cookies and Tracking</h2>
            <p className="text-gray-300 leading-relaxed">
              We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide
              personalized content. You can control cookie settings through your browser, but disabling cookies may
              limit some functionality of our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">6. Your Rights</h2>
            <p className="text-gray-300 leading-relaxed mb-3">You have the right to:</p>
            <ul className="text-gray-300 space-y-2 ml-6">
              <li>• Access and update your personal information</li>
              <li>• Request deletion of your account and associated data</li>
              <li>• Opt out of marketing communications</li>
              <li>• Request data portability</li>
              <li>• Object to certain data processing activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">7. Data Retention</h2>
            <p className="text-gray-300 leading-relaxed">
              We retain your personal information for as long as necessary to provide our services and fulfill the
              purposes outlined in this policy, unless a longer retention period is required by law. When we no longer
              need your information, we will securely delete or anonymize it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">8. Third-Party Links</h2>
            <p className="text-gray-300 leading-relaxed">
              Our platform may contain links to third-party websites or services. We are not responsible for the
              privacy practices or content of these external sites. We encourage you to review the privacy policies
              of any third-party services you use.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">9. Children's Privacy</h2>
            <p className="text-gray-300 leading-relaxed">
              Our services are intended for users who are at least 13 years old. We do not knowingly collect personal
              information from children under 13. If we become aware that we have collected personal information from
              a child under 13, we will take steps to delete such information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">10. Changes to This Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
              new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this
              Privacy Policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">11. Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="bg-white/5 rounded-lg p-4 mt-3">
              <p className="text-gray-300">📧 Email: privacy@unisphere.com</p>
              <p className="text-gray-300">📞 Phone: +91 9876543210</p>
              <p className="text-gray-300">📍 Address: SR University Campus</p>
            </div>
          </section>

          <div className="border-t border-white/10 pt-6 mt-8">
            <p className="text-gray-400 text-sm">
              By using UniSphere, you acknowledge that you have read and understood this Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}