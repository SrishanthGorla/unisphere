export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Terms of Service
        </h1>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 space-y-6">
          <div className="text-sm text-gray-400 mb-6">
            Last updated: April 7, 2026
          </div>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">1. Acceptance of Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              By accessing and using UniSphere, you accept and agree to be bound by the terms and provision of this agreement.
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">2. Use License</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Permission is granted to temporarily use UniSphere for personal, non-commercial transitory viewing only.
              This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="text-gray-300 space-y-2 ml-6">
              <li>• Modify or copy the materials</li>
              <li>• Use the materials for any commercial purpose or for any public display</li>
              <li>• Attempt to decompile or reverse engineer any software contained on UniSphere</li>
              <li>• Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">3. Event Registration</h2>
            <p className="text-gray-300 leading-relaxed">
              When registering for events through UniSphere, you agree to provide accurate information and abide by
              the specific terms and conditions of each event. Event organizers reserve the right to refuse registration
              or remove participants who violate event rules or these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">4. User Responsibilities</h2>
            <p className="text-gray-300 leading-relaxed mb-3">You are responsible for:</p>
            <ul className="text-gray-300 space-y-2 ml-6">
              <li>• Maintaining the confidentiality of your account credentials</li>
              <li>• All activities that occur under your account</li>
              <li>• Providing accurate and up-to-date information</li>
              <li>• Complying with all applicable laws and regulations</li>
              <li>• Respecting other users and event organizers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">5. Payment Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              For paid events, all payments are processed securely through our payment partners. Refunds are subject
              to the specific refund policy of each event. UniSphere is not responsible for payment processing disputes
              but will assist in facilitating resolutions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">6. Content Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              Users may not post content that is illegal, harmful, threatening, abusive, harassing, defamatory,
              vulgar, obscene, invasive of another's privacy, or otherwise objectionable. UniSphere reserves the
              right to remove such content and terminate accounts that violate this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">7. Limitation of Liability</h2>
            <p className="text-gray-300 leading-relaxed">
              In no event shall UniSphere or its suppliers be liable for any damages (including, without limitation,
              damages for loss of data or profit, or due to business interruption) arising out of the use or inability
              to use UniSphere, even if UniSphere or a UniSphere authorized representative has been notified orally
              or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">8. Termination</h2>
            <p className="text-gray-300 leading-relaxed">
              We may terminate or suspend your account and bar access to the service immediately, without prior notice
              or liability, under our sole discretion, for any reason whatsoever and without limitation, including but
              not limited to a breach of the Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">9. Governing Law</h2>
            <p className="text-gray-300 leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of India and
              you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">10. Changes to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision
              is material, we will provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </section>

          <div className="border-t border-white/10 pt-6 mt-8">
            <p className="text-gray-400 text-sm">
              If you have any questions about these Terms of Service, please contact us at unisphere@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}