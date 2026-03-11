import PageTransition from '@/components/PageTransition';
import FadeIn from '@/components/animations/FadeIn';

export default function TermsOfService() {
  return (
    <PageTransition>
      <div className="pt-24 pb-12 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight mb-4">
              Terms of <span className="text-gradient">Service</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg font-medium">
              Last updated: March 10, 2026
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="prose dark:prose-invert max-w-none text-muted-foreground font-medium text-sm leading-relaxed">
              <p>
                By accessing or using the AnandVerse website, you agree to be bound by these Terms of Service and all applicable laws and regulations.
                If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>

              <h2 className="text-foreground font-display font-bold mt-10 mb-3 text-2xl">Services and Intellectual Property</h2>
              <p>
                The materials on AnandVerse's website are provided on an 'as is' basis. All designs, code snippets, articles, and media not explicitly marked for reuse are the intellectual property of Anand.
                You may access these for personal or educational use, but they may not be republished or sold without express permission.
              </p>

              <h2 className="text-foreground font-display font-bold mt-10 mb-3 text-2xl">Payment Terms</h2>
              <p>
                For commissioned development or design services, we utilize <strong>Razer Pay</strong> for all financial transactions.
                All payments made are subject to Razer Pay's Terms of Service and must be completed in the currency and timeframe specified in your project agreement.
                By completing a transaction via Razer Pay, you agree to the milestone payment structure outlined during our project consultation.
              </p>

              <h2 className="text-foreground font-display font-bold mt-10 mb-3 text-2xl">User Conduct</h2>
              <p>
                You agree not to engage in any prohibited conduct when using our website, including but not limited to:
              </p>
              <ul className="list-disc ml-6 space-y-2 marker:text-primary">
                <li>Attempting to hack, disrupt, or interfere with security features of the website.</li>
                <li>Submitting false or misleading information via our contact forms.</li>
                <li>Scraping the website.</li>
              </ul>

              <h2 className="text-foreground font-display font-bold mt-10 mb-3 text-2xl">Warranties and Liability</h2>
              <p>
                I make no warranties, expressed or implied, regarding the continuous availability of the site. I shall not be liable for any damages
                arising out of the use or inability to use the materials on the AnandVerse website.
              </p>

              <h2 className="text-foreground font-display font-bold mt-10 mb-3 text-2xl">Changes to Terms</h2>
              <p>
                AnandVerse may revise these Terms of Service at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms of Service.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </PageTransition>
  );
}
