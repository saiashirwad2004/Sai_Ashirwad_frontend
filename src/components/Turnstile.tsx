import { useEffect, useRef } from 'react';

interface TurnstileProps {
  onVerify: (token: string) => void;
  options?: {
    theme?: 'light' | 'dark' | 'auto';
    size?: 'normal' | 'compact' | 'flexible';
  };
}

declare global {
  interface Window {
    turnstile: {
      render: (
        container: string | HTMLElement,
        options: Record<string, unknown>
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export default function Turnstile({ onVerify, options = {} }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '0x4AAAAAACpbKP942F0Qp-Js';

    const renderWidget = () => {
      if (window.turnstile && containerRef.current && !widgetIdRef.current) {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => {
            onVerify(token);
          },
          'expired-callback': () => {
            onVerify('');
          },
          'error-callback': () => {
            onVerify('');
          },
          theme: options.theme || 'dark',
          size: options.size || 'normal',
        });
      }
    };

    // Check if turnstile is already loaded
    if (window.turnstile) {
      renderWidget();
    } else {
      // If not, it might still be loading, but since we added it to head it should be there soon
      // We can poll or wait for the script to load. Cloudflare suggests using an onload callback but for React this is fine.
      const timer = setInterval(() => {
        if (window.turnstile) {
          renderWidget();
          clearInterval(timer);
        }
      }, 500);
      return () => clearInterval(timer);
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [onVerify, options.theme, options.size]);

  return <div ref={containerRef} className="cf-turnstile-container flex justify-center py-2" />;
}
