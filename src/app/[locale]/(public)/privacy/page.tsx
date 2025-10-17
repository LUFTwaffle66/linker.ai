'use client';

import { Database, FileText, Users, Lock, Eye, Globe, AlertCircle, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function PrivacyPolicyPage() {
  const lastUpdated = 'January 13, 2025';

  const sections = [
    {
      id: 'information-collection',
      icon: Database,
      title: '1. Information We Collect',
      content: [
        {
          subtitle: '1.1 Information You Provide',
          text: 'When you create an account, post projects, or submit proposals, we collect information such as your name, email address, professional credentials, payment information, and project details. For AI automation experts, this includes certifications, portfolio samples, and technical skills.',
        },
        {
          subtitle: '1.2 Automatically Collected Information',
          text: 'We automatically collect certain information when you use LinkerAI, including your IP address, browser type, device information, and usage patterns. We use cookies and similar technologies to enhance your experience and provide analytics.',
        },
        {
          subtitle: '1.3 Payment Information',
          text: 'Payment information is processed through our secure payment partners. We do not store full credit card numbers on our servers. We maintain transaction records for accounting and tax purposes in compliance with applicable laws.',
        },
      ],
    },
    {
      id: 'information-use',
      icon: FileText,
      title: '2. How We Use Your Information',
      content: [
        {
          subtitle: '2.1 Platform Operations',
          text: 'We use your information to operate and improve LinkerAI, including matching clients with AI automation experts, processing payments through our escrow system, facilitating communication, and providing customer support.',
        },
        {
          subtitle: '2.2 Safety and Security',
          text: 'We use your information to verify identities, prevent fraud, enforce our Terms of Service, comply with legal obligations, and protect the rights and safety of our users and the platform.',
        },
        {
          subtitle: '2.3 Communication',
          text: 'We may send you service-related emails, project updates, payment notifications, and platform announcements. You can opt out of marketing communications but will continue to receive essential service notifications.',
        },
      ],
    },
    {
      id: 'information-sharing',
      icon: Users,
      title: '3. Information Sharing and Disclosure',
      content: [
        {
          subtitle: '3.1 With Other Users',
          text: 'When you post projects or submit proposals, certain information (name, profile, portfolio, ratings) is visible to other users. You control what information appears in your public profile.',
        },
        {
          subtitle: '3.2 Service Providers',
          text: 'We share information with third-party service providers who perform services on our behalf, including payment processing, data analysis, email delivery, hosting services, and customer service. These providers are contractually obligated to protect your information.',
        },
        {
          subtitle: '3.3 Legal Requirements',
          text: 'We may disclose your information to comply with legal obligations, respond to lawful requests from government authorities, enforce our Terms of Service, protect our rights and property, or ensure the safety of our users.',
        },
        {
          subtitle: '3.4 Business Transfers',
          text: 'If LinkerAI is involved in a merger, acquisition, or sale of assets, your information may be transferred. We will notify you via email or prominent notice before your information becomes subject to a different privacy policy.',
        },
      ],
    },
    {
      id: 'data-security',
      icon: Lock,
      title: '4. Data Security',
      content: [
        {
          subtitle: '4.1 Security Measures',
          text: 'We implement industry-standard security measures to protect your information, including encryption, secure servers, access controls, and regular security audits. Our payment system uses bank-level encryption and complies with PCI DSS standards.',
        },
        {
          subtitle: '4.2 Account Security',
          text: 'You are responsible for maintaining the confidentiality of your account credentials. We recommend using strong passwords and enabling two-factor authentication. Notify us immediately if you suspect unauthorized access to your account.',
        },
        {
          subtitle: '4.3 Limitations',
          text: 'While we take reasonable steps to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security of your information.',
        },
      ],
    },
    {
      id: 'data-retention',
      icon: Database,
      title: '5. Data Retention',
      content: [
        {
          subtitle: '5.1 Active Accounts',
          text: 'We retain your information for as long as your account is active or as needed to provide services, comply with legal obligations, resolve disputes, and enforce our agreements.',
        },
        {
          subtitle: '5.2 Deleted Accounts',
          text: 'When you delete your account, we will delete or anonymize your personal information within 30 days, except where retention is required by law or for legitimate business purposes (e.g., tax records, dispute resolution).',
        },
      ],
    },
    {
      id: 'your-rights',
      icon: Eye,
      title: '6. Your Rights and Choices',
      content: [
        {
          subtitle: '6.1 Access and Correction',
          text: 'You can access and update your account information at any time through your account settings. You may request a copy of your personal information by contacting us.',
        },
        {
          subtitle: '6.2 Data Deletion',
          text: 'You can delete your account at any time through account settings. Certain information may be retained as required by law or for legitimate business purposes.',
        },
        {
          subtitle: '6.3 Marketing Communications',
          text: 'You can opt out of marketing emails by clicking the unsubscribe link in any marketing email or updating your communication preferences in account settings.',
        },
        {
          subtitle: '6.4 Cookies',
          text: 'Most browsers allow you to control cookies through their settings. Note that disabling cookies may affect the functionality of LinkerAI.',
        },
        {
          subtitle: '6.5 California Privacy Rights',
          text: 'California residents have additional rights under CCPA, including the right to know what personal information is collected, the right to delete personal information, and the right to opt-out of sale of personal information. We do not sell personal information.',
        },
        {
          subtitle: '6.6 GDPR Rights (EU Users)',
          text: 'EU residents have rights under GDPR, including rights to access, rectification, erasure, restriction of processing, data portability, and objection to processing. Contact us to exercise these rights.',
        },
      ],
    },
    {
      id: 'international-transfers',
      icon: Globe,
      title: '7. International Data Transfers',
      content: [
        {
          subtitle: '7.1 Cross-Border Transfers',
          text: 'LinkerAI operates globally. Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws.',
        },
        {
          subtitle: '7.2 Safeguards',
          text: 'We implement appropriate safeguards for international data transfers, including standard contractual clauses approved by regulatory authorities.',
        },
      ],
    },
    {
      id: 'children',
      icon: AlertCircle,
      title: "8. Children's Privacy",
      content: [
        {
          subtitle: '8.1 Age Requirement',
          text: 'LinkerAI is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will delete it immediately.',
        },
      ],
    },
    {
      id: 'changes',
      icon: FileText,
      title: '9. Changes to This Privacy Policy',
      content: [
        {
          subtitle: '9.1 Updates',
          text: 'We may update this Privacy Policy from time to time. We will notify you of material changes by email or through a prominent notice on the platform. Your continued use of LinkerAI after changes become effective constitutes acceptance of the updated policy.',
        },
      ],
    },
    {
      id: 'contact',
      icon: Shield,
      title: '10. Contact Us',
      content: [
        {
          subtitle: '10.1 Questions and Concerns',
          text: 'If you have questions about this Privacy Policy or our privacy practices, please contact us at:\n\nEmail: privacy@linkerai.com\nAddress: LinkerAI Privacy Team, [Address]\n\nFor GDPR-related inquiries, contact our Data Protection Officer at: dpo@linkerai.com',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl mb-4">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground mb-4">
            LinkerAI is committed to protecting your privacy and ensuring the security of your personal information.
          </p>
          <Badge variant="secondary" className="text-sm">
            Last Updated: {lastUpdated}
          </Badge>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <p className="text-muted-foreground leading-relaxed mb-4">
              This Privacy Policy describes how LinkerAI ("we," "us," or "our") collects, uses, shares, and protects your
              personal information when you use our AI automation freelance marketplace platform. By using LinkerAI, you
              agree to the collection and use of information in accordance with this policy.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This policy applies to all users of LinkerAI, including AI automation experts, clients, and visitors to our
              platform.
            </p>
          </CardContent>
        </Card>

        {/* Policy Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle>{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {section.content.map((item, index) => (
                    <div key={index}>
                      <h4 className="font-medium mb-2">{item.subtitle}</h4>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{item.text}</p>
                      {index < section.content.length - 1 && <Separator className="mt-6" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Card */}
        <Card className="mt-8 bg-gradient-to-br from-primary/10 to-cyan-500/10">
          <CardContent className="p-6 text-center">
            <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-medium mb-2">Your Privacy Matters</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We are committed to transparency and protecting your personal information.
            </p>
            <p className="text-sm text-muted-foreground">
              Questions? Contact us at <span className="text-primary font-medium">privacy@linkerai.com</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
