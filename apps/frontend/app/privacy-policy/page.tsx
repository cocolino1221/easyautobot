'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">EasyAutoBot</span>
            </Link>
            <nav className="flex gap-2">
              <Link href="/">
                <Button variant="ghost">Home</Button>
              </Link>
              <Link href="/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 mb-8">Last Updated: October 12, 2025</p>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p>
                Welcome to EasyAutoBot ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data.
                This privacy policy explains how we collect, use, disclose, and safeguard your information when you use our social media
                automation platform and services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Personal Information</h3>
              <p className="mb-4">We collect information that you provide directly to us, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Account information (name, email address, password)</li>
                <li>Company or business information</li>
                <li>Payment and billing information</li>
                <li>Profile information and preferences</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">2.2 Social Media Data</h3>
              <p className="mb-4">When you connect your social media accounts (Instagram, Facebook, TikTok, WhatsApp), we collect:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access tokens and authentication credentials</li>
                <li>Messages and conversations you authorize us to manage</li>
                <li>Comments, posts, and engagement data</li>
                <li>Follower and audience information</li>
                <li>Analytics and performance metrics</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">2.3 Usage Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage patterns and feature interactions</li>
                <li>Log data and analytics</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="mb-4">We use the collected information for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service Delivery:</strong> To provide, maintain, and improve our automation services</li>
                <li><strong>Automation:</strong> To send automated messages and responses on your behalf</li>
                <li><strong>Analytics:</strong> To analyze and improve our platform performance</li>
                <li><strong>Communication:</strong> To send you updates, notifications, and support messages</li>
                <li><strong>Security:</strong> To detect, prevent, and address fraud and security issues</li>
                <li><strong>Compliance:</strong> To comply with legal obligations and platform policies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Sharing and Disclosure</h2>
              <p className="mb-4">We do not sell your personal information. We may share your information in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Social Media Platforms:</strong> We share data with Instagram, Facebook, TikTok, and WhatsApp as necessary to provide our services</li>
                <li><strong>Service Providers:</strong> With trusted third-party service providers who assist in operating our platform</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In connection with any merger, sale, or acquisition</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Platform-Specific Privacy</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Meta Platforms (Facebook & Instagram)</h3>
              <p className="mb-4">
                We comply with Meta's Platform Terms and Data Use Policy. We access your Facebook and Instagram data only with your
                explicit permission and use it solely to provide the automation services you've requested. You can revoke our access
                at any time through your Facebook/Instagram settings.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 TikTok</h3>
              <p className="mb-4">
                We comply with TikTok's Developer Terms and Privacy Policy. We access your TikTok data only with your consent and
                use it exclusively for the automation features you enable. You maintain control over your TikTok data and can
                disconnect our access at any time.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.3 WhatsApp Business API</h3>
              <p className="mb-4">
                We comply with WhatsApp's Business API Terms of Service and Commerce Policy. Message content is encrypted end-to-end,
                and we only access metadata necessary to provide automation services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h2>
              <p className="mb-4">We implement industry-standard security measures to protect your data:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure authentication and access controls</li>
                <li>Regular security audits and monitoring</li>
                <li>Compliance with SOC 2 and GDPR standards</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights and Choices</h2>
              <p className="mb-4">You have the following rights regarding your personal data:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Revoke Consent:</strong> Disconnect social media integrations at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Retention</h2>
              <p>
                We retain your personal data only as long as necessary to provide our services and comply with legal obligations.
                When you close your account, we will delete or anonymize your data within 90 days, except where required by law to retain it longer.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
              <p>
                Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information
                from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your country of residence. We ensure
                appropriate safeguards are in place to protect your data in compliance with applicable data protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any material changes by posting the new
                policy on this page and updating the "Last Updated" date. Your continued use of our services after any changes
                constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
              <p className="mb-4">If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <p><strong>Email:</strong> privacy@easyautobot.com</p>
                <p><strong>Address:</strong> [Your Business Address]</p>
                <p><strong>Data Protection Officer:</strong> dpo@easyautobot.com</p>
              </div>
            </section>

            <section className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. GDPR Compliance (For EU Users)</h2>
              <p className="mb-4">If you are located in the European Union, you have additional rights under GDPR:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Right to be informed about data processing</li>
                <li>Right to access your personal data</li>
                <li>Right to rectification of inaccurate data</li>
                <li>Right to erasure ("right to be forgotten")</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
                <li>Rights related to automated decision-making and profiling</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us at gdpr@easyautobot.com
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. CCPA Compliance (For California Users)</h2>
              <p className="mb-4">If you are a California resident, you have rights under the California Consumer Privacy Act:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Right to know what personal information is collected</li>
                <li>Right to know if personal information is sold or disclosed</li>
                <li>Right to opt-out of the sale of personal information</li>
                <li>Right to deletion of personal information</li>
                <li>Right to non-discrimination for exercising CCPA rights</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us at ccpa@easyautobot.com
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between items-center">
            <Link href="/terms">
              <Button variant="outline">View Terms of Service</Button>
            </Link>
            <Link href="/">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
