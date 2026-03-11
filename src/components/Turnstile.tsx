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

  // Use a ref for onVerify to prevent effect re-runs when parent passes inline function
  const onVerifyRef = useRef(onVerify);
  onVerifyRef.current = onVerify;

  useEffect(() => {
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '0x4AAAAAACpbKP942F0Qp-Js';

    const renderWidget = () => {
      // Ensure we only render if container exists and we don't already have a widget
      if (window.turnstile && containerRef.current && !widgetIdRef.current) {
        try {
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
              onVerifyRef.current(token);
            },
            'expired-callback': () => {
              onVerifyRef.current('');
            },
            'error-callback': () => {
              onVerifyRef.current('');
            },
            theme: options.theme || 'dark',
            size: options.size || 'normal',
            // Explicitly set execution to 'render' to avoid unintended execution
            execution: 'render',
          });
        } catch (e) {
          console.error('Turnstile render error:', e);
        }
      }
    };

    // Check if turnstile is already loaded
    if (window.turnstile) {
      renderWidget();
    } else {
      // Polling for the script to be ready
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
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {}
        widgetIdRef.current = null;
      }
    };
    // Only re-run if theme or size changes. onVerify changes are handled by the ref.
  }, [options.theme, options.size]);

  return <div ref={containerRef} className="cf-turnstile-container flex justify-center py-2" />;
}
