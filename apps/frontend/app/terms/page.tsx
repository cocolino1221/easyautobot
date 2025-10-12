'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-sm text-gray-500 mb-8">Last Updated: October 12, 2025</p>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing or using EasyAutoBot ("Service," "Platform," "we," "us," or "our"), you agree to be bound by these
                Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="mb-4">
                EasyAutoBot is a social media automation platform that enables users to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Automate responses to direct messages on Instagram, Facebook, TikTok, and WhatsApp</li>
                <li>Manage and respond to comments automatically</li>
                <li>Create automated conversation flows and chatbots</li>
                <li>Schedule and publish content across multiple platforms</li>
                <li>Analyze engagement metrics and audience insights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Account Registration and Security</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Account Creation</h3>
              <p className="mb-4">To use our Service, you must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Be at least 18 years old</li>
                <li>Provide accurate and complete registration information</li>
                <li>Maintain and update your account information</li>
                <li>Keep your password secure and confidential</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.2 Account Responsibility</h3>
              <p>
                You are responsible for all activities that occur under your account. You must immediately notify us of any
                unauthorized use of your account or any other breach of security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Platform Integration and Authorization</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Social Media Connections</h3>
              <p className="mb-4">
                By connecting your social media accounts to our Service, you authorize us to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your account data as permitted by the platform's API</li>
                <li>Send automated messages and responses on your behalf</li>
                <li>Post content according to your configured automations</li>
                <li>Retrieve analytics and engagement data</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.2 Platform Compliance</h3>
              <p className="mb-4">You agree to comply with all terms and policies of the connected platforms:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Meta (Facebook & Instagram):</strong> Meta Platform Terms, Community Standards, and Business Tools Terms</li>
                <li><strong>TikTok:</strong> TikTok Terms of Service, Community Guidelines, and Developer Terms</li>
                <li><strong>WhatsApp:</strong> WhatsApp Business Terms, Commerce Policy, and Business API Terms</li>
              </ul>

              <p className="mt-4 font-semibold text-gray-900">
                Violation of any platform's terms may result in suspension or termination of your access to our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Acceptable Use Policy</h2>
              <p className="mb-4">You agree NOT to use the Service to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Send spam, unsolicited messages, or bulk messages to non-consenting recipients</li>
                <li>Violate any laws, regulations, or third-party rights</li>
                <li>Harass, abuse, or harm other users or individuals</li>
                <li>Impersonate any person or entity</li>
                <li>Distribute malware, viruses, or harmful code</li>
                <li>Scrape, harvest, or collect user data without authorization</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Circumvent any security measures or access controls</li>
                <li>Use automated scripts or bots to access the Service (except as intended)</li>
                <li>Engage in any activity that could damage our reputation or business</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Subscription Plans and Billing</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1 Paid Subscriptions</h3>
              <p className="mb-4">
                We offer various subscription tiers with different features and usage limits. Subscription fees are charged in advance
                on a monthly or annual basis and are non-refundable except as required by law.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2 Free Trial</h3>
              <p className="mb-4">
                We may offer a free trial period. You must provide payment information to start a trial. Unless you cancel before the
                trial ends, your subscription will automatically begin, and you will be charged.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.3 Automatic Renewal</h3>
              <p className="mb-4">
                Your subscription will automatically renew at the end of each billing period unless you cancel. You can cancel at any
                time through your account settings.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.4 Price Changes</h3>
              <p>
                We may change our pricing with 30 days' notice. Price changes will apply to subsequent billing periods.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property Rights</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">7.1 Our Content</h3>
              <p className="mb-4">
                The Service, including all software, designs, text, graphics, and other content, is owned by EasyAutoBot and protected
                by intellectual property laws. You may not copy, modify, distribute, or create derivative works without our permission.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">7.2 Your Content</h3>
              <p className="mb-4">
                You retain ownership of content you create and post through the Service. By using the Service, you grant us a limited
                license to use, store, and display your content solely to provide the Service to you.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">7.3 Feedback</h3>
              <p>
                Any feedback, suggestions, or ideas you provide to us become our property, and we may use them without obligation or compensation to you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Service Availability and Modifications</h2>
              <p className="mb-4">
                We strive to provide reliable service but do not guarantee uninterrupted access. We reserve the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modify, suspend, or discontinue any aspect of the Service</li>
                <li>Perform maintenance and updates</li>
                <li>Limit features or access for certain users or plans</li>
                <li>Change features, functionality, or pricing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Termination</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">9.1 Termination by You</h3>
              <p className="mb-4">
                You may cancel your subscription and close your account at any time through your account settings. Upon cancellation,
                you will retain access until the end of your current billing period.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">9.2 Termination by Us</h3>
              <p className="mb-4">
                We may suspend or terminate your account immediately if you:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate these Terms</li>
                <li>Violate connected platform policies</li>
                <li>Engage in fraudulent or illegal activity</li>
                <li>Fail to pay subscription fees</li>
                <li>Use the Service in a way that harms our business or reputation</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">9.3 Effect of Termination</h3>
              <p>
                Upon termination, your right to use the Service immediately ceases. We will delete your data within 90 days, except
                as required by law or our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Disclaimers and Limitations of Liability</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">10.1 Service "As Is"</h3>
              <p className="mb-4">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DISCLAIM
                ALL WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">10.2 Platform Changes</h3>
              <p className="mb-4">
                We are not responsible for changes to social media platform APIs, policies, or features that may affect the Service's
                functionality.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">10.3 Limitation of Liability</h3>
              <p className="mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, EASYAUTOBOT SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, OR USE.
              </p>
              <p>
                OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS BEFORE THE EVENT GIVING RISE TO LIABILITY.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless EasyAutoBot, its affiliates, officers, directors, employees, and
                agents from any claims, liabilities, damages, losses, and expenses arising from:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights</li>
                <li>Content you post or share through the Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Dispute Resolution and Governing Law</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">12.1 Governing Law</h3>
              <p className="mb-4">
                These Terms are governed by the laws of [Your Jurisdiction], without regard to conflict of law principles.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">12.2 Arbitration</h3>
              <p className="mb-4">
                Any dispute arising from these Terms or the Service shall be resolved through binding arbitration, except you may
                bring claims in small claims court.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">12.3 Class Action Waiver</h3>
              <p>
                You agree to resolve disputes on an individual basis. You waive any right to participate in a class action lawsuit or
                class-wide arbitration.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Platform-Specific Terms</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">13.1 Meta Platforms (Facebook & Instagram)</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must comply with Meta's Platform Terms and Community Standards</li>
                <li>You are responsible for obtaining user consent for automated messages</li>
                <li>You must provide clear opt-out mechanisms in your messages</li>
                <li>You may not use the Service to violate Facebook/Instagram advertising policies</li>
                <li>Meta reserves the right to limit or remove access to their platforms at any time</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">13.2 TikTok</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must comply with TikTok's Terms of Service and Community Guidelines</li>
                <li>You may not use the Service to spam users or manipulate engagement</li>
                <li>You must respect TikTok's rate limits and API restrictions</li>
                <li>Automated content must not violate TikTok's content policies</li>
                <li>TikTok may suspend or terminate API access at their discretion</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">13.3 WhatsApp Business API</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must comply with WhatsApp Business Terms and Commerce Policy</li>
                <li>Messages must be transactional or customer-initiated (no cold outreach)</li>
                <li>You must obtain explicit opt-in consent before messaging users</li>
                <li>You must provide clear opt-out instructions in every message</li>
                <li>Your use of WhatsApp Business API is subject to Meta's approval</li>
                <li>Spam or policy violations may result in permanent ban from WhatsApp Business</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Data Protection and Privacy</h2>
              <p>
                Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference.
                Please review our <Link href="/privacy-policy" className="text-purple-600 hover:text-purple-700 underline">Privacy Policy</Link> to
                understand how we collect, use, and protect your data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Changes to Terms</h2>
              <p>
                We may update these Terms from time to time. We will notify you of material changes via email or through the Service.
                Your continued use of the Service after changes constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Miscellaneous</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">16.1 Entire Agreement</h3>
              <p className="mb-4">
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and EasyAutoBot.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">16.2 Severability</h3>
              <p className="mb-4">
                If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in effect.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">16.3 Waiver</h3>
              <p className="mb-4">
                Our failure to enforce any provision does not waive our right to enforce it later.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">16.4 Assignment</h3>
              <p>
                You may not transfer your rights or obligations under these Terms. We may assign our rights and obligations to any party
                at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">17. Contact Information</h2>
              <p className="mb-4">If you have questions about these Terms, please contact us:</p>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <p><strong>Email:</strong> legal@easyautobot.com</p>
                <p><strong>Support:</strong> support@easyautobot.com</p>
                <p><strong>Address:</strong> [Your Business Address]</p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between items-center">
            <Link href="/privacy-policy">
              <Button variant="outline">View Privacy Policy</Button>
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
