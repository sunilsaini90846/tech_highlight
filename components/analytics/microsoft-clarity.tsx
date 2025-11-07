'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Microsoft Clarity Project ID
const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID

export function MicrosoftClarity() {
  const pathname = usePathname()

  useEffect(() => {
    // Don't load analytics on admin routes
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/preview')) {
      return
    }

    // Respect doNotTrack
    if (typeof window !== 'undefined' && window.navigator.doNotTrack === '1') {
      return
    }

    // Only load in production
    if (process.env.NODE_ENV !== 'production') {
      return
    }

    // Only load if CLARITY_PROJECT_ID is configured
    if (!CLARITY_PROJECT_ID) {
      return
    }

    // Load Microsoft Clarity
    const script = document.createElement('script')
    script.innerHTML = `
      (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
    `
    document.head.appendChild(script)

    // Cleanup function
    return () => {
      const scripts = document.querySelectorAll('script[src*="clarity.ms"]')
      scripts.forEach(script => script.remove())

      const inlineScripts = document.querySelectorAll('script')
      inlineScripts.forEach(script => {
        if (script.innerHTML.includes('clarity.ms')) {
          script.remove()
        }
      })

      // Clear Clarity from window if it exists
      if (typeof window !== 'undefined' && (window as any).clarity) {
        delete (window as any).clarity
      }
    }
  }, [pathname])

  // This component doesn't render anything
  return null
}
