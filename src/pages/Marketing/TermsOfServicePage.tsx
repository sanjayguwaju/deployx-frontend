export default function TermsOfServicePage() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pb-24">
      <div className="bg-brand-50 dark:bg-brand-900/10 pt-24 pb-16 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl mb-6">Terms of Service</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Effective Date: January 1, 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 prose prose-lg dark:prose-invert prose-brand">
        <p>
          These Terms of Service ("Terms") govern your access to and use of the DeployX website, services, and software platform (collectively, the "Services"). By accessing or using the Services, you agree to be bound by these Terms and our Privacy Policy.
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By using our Services, you agree to these Terms. If you don't agree to these Terms, do not use the Services. If you are using the Services on behalf of a recruitment agency, organization, or other legal entity, you represent and warrant that you have the authority to bind that entity to these Terms.
        </p>

        <h2>2. Description of Services</h2>
        <p>
          DeployX provides a multi-tenant SaaS operating system designed for overseas manpower recruitment agencies. This includes modules for candidate management, job demand pipelines, visa processing, document compliance, and agent portals. We reserve the right to modify, suspend, or discontinue the Services at any time, with or without notice.
        </p>

        <h2>3. Account Registration</h2>
        <p>
          To access certain features of the Services, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password and for all activities that occur under your account.
        </p>

        <h2>4. User Conduct</h2>
        <p>
          You agree not to use the Services for any unlawful purpose or in any way that interrupts, damages, or impairs the service. You must not:
        </p>
        <ul>
          <li>Upload or transmit viruses, worms, or any malicious code.</li>
          <li>Attempt to gain unauthorized access to any portion of the Services or any other systems or networks connected to the Services.</li>
          <li>Use the Services to store or transmit infringing, libelous, or otherwise unlawful or tortious material.</li>
          <li>Interfere with or disrupt the integrity or performance of the Services or third-party data contained therein.</li>
        </ul>

        <h2>5. Intellectual Property</h2>
        <p>
          The Services and their original content, features, and functionality are and will remain the exclusive property of DeployX Technologies and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of DeployX.
        </p>

        <h2>6. Limitation of Liability</h2>
        <p>
          In no event shall DeployX, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Services.
        </p>

        <h2>7. Termination</h2>
        <p>
          We may terminate or suspend your account and bar access to the Services immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
        </p>

        <h2>8. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at:
        </p>
        <p>
          <strong>DeployX Technologies</strong><br />
          Email: legal@deployx.io<br />
          Phone: +977-1-4123456
        </p>
      </div>
    </div>
  );
}
