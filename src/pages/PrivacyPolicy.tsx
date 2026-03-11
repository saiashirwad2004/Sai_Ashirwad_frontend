import PageTransition from '@/components/PageTransition';
import FadeIn from '@/components/animations/FadeIn';

export default function PrivacyPolicy() {
  return (
    <PageTransition>
      <div className="pt-24 pb-12 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight mb-4">
              Privacy <span className="text-gradient">Policy</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg font-medium">
              Last updated: March 10, 2026
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="prose dark:prose-invert max-w-none text-muted-foreground font-medium text-sm leading-relaxed">
              <p>
                At AnandVerse, I am committed to protecting your privacy and ensuring you have a positive experience on my website.
                This Privacy Policy outlines how I collect, use, and safeguard your personal information.
              </p>

              <h2 className="text-foreground font-display font-bold mt-10 mb-3 text-2xl">Information We Collect</h2>
              <p>
                We only collect minimal required information when you fill out forms on the site or subscribe to the newsletter.
                This may include your name, email address, and any messages or project details you choose to share.
              </p>

              <h2 className="text-foreground font-display font-bold mt-10 mb-3 text-2xl">How We Use Your Information</h2>
              <p>
                The information you provide is strictly used to:
              </p>
              <ul className="list-disc ml-6 space-y-2 marker:text-primary">
                <li>Respond to your project inquiries and general contact requests.</li>
                <li>Send you newsletters if you have explicitly opted in.</li>
                <li>Improve the performance and user experience of this website.</li>
              </ul>

              <h2 className="text-foreground font-display font-bold mt-10 mb-3 text-2xl">Data Processing & Security</h2>
              <p>
                We process all data securely. If you choose to process payments online for services, payments are securely processed by <strong>Razer Pay</strong>.
                We do not store your credit card information on our servers; it is handled entirely by our secure payment gateway provider ensuring PCI-DSS compliance.
              </p>

              <h2 className="text-foreground font-display font-bold mt-10 mb-3 text-2xl">Cookies and Analytics</h2>
              <p>
                This website may use essential cookies to maintain site functionality and performance tracking (such as Vercel Web Analytics) to understand how visitors interact with the site, improving our content and your experience.
              </p>

              <h2 className="text-foreground font-display font-bold mt-10 mb-3 text-2xl">Your Rights</h2>
              <p>
                You have the right to request access to the personal data we hold about you or request its deletion. If you would like to exercise these rights or have questions about this policy, please contact me at <strong>anand@anandverse.space</strong>.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </PageTransition>
  );
}
