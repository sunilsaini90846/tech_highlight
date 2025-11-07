'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export function GoogleAnalytics() {
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

    // Only load if GA_MEASUREMENT_ID is configured
    if (!GA_MEASUREMENT_ID) {
      return
    }

    // Load Google Analytics
    const script1 = document.createElement('script')
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    script1.async = true
    document.head.appendChild(script1)

    const script2 = document.createElement('script')
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', {
        page_title: document.title,
        page_location: window.location.href,
      });
    `
    document.head.appendChild(script2)

    // Track page views on route changes
    const handleRouteChange = (url: string) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', GA_MEASUREMENT_ID, {
          page_path: url,
        })
      }
    }

    // Listen for pathname changes
    handleRouteChange(pathname)

    // Cleanup function
    return () => {
      // Remove scripts if component unmounts (though unlikely for layout)
      const scripts = document.querySelectorAll(`script[src*="${GA_MEASUREMENT_ID}"]`)
      scripts.forEach(script => script.remove())
      const inlineScripts = document.querySelectorAll('script')
      inlineScripts.forEach(script => {
        if (script.innerHTML.includes('gtag')) {
          script.remove()
        }
      })
    }
  }, [pathname])

  // This component doesn't render anything
  return null
}
