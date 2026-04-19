'use client'

import { useEffect } from 'react'

interface TrackingData {
  facebook: {
    pixel_id: string | null
    pixel_code: string | null
  }
  google: {
    analytics_id: string | null
    analytics_code: string | null
    tag_manager_id: string | null
    tag_manager_code: string | null
  }
}

export default function TrackingScripts() {
  useEffect(() => {
    let mounted = true

    const injectTrackingScripts = async () => {
      try {
        // Fetch tracking codes from API
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://hooknhunt-api.test/api/v2'
        const response = await fetch(`${apiUrl}/website/tracking`)
        if (!response.ok) return

        const result = await response.json()
        if (!result.success || !result.data) return

        const data: TrackingData = result.data

        if (!mounted) return

        // ============================================
        // FACEBOOK PIXEL
        // ============================================
        const { pixel_id, pixel_code } = data.facebook

        // Priority: Custom code > ID
        if (pixel_code && pixel_code.trim()) {
          // Use custom code
          injectScriptToHead(pixel_code.trim(), 'facebook-pixel-custom')
        } else if (pixel_id && pixel_id.trim()) {
          // Generate standard Facebook Pixel script
          const standardPixelScript = `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixel_id.trim()}');
            fbq('track', 'PageView');
          `
          injectScriptToHead(standardPixelScript, 'facebook-pixel-standard')
          injectNoscriptToBody(`<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${pixel_id.trim()}&ev=PageView&noscript=1"/>`, 'facebook-pixel-noscript')
        }

        // ============================================
        // GOOGLE ANALYTICS (GA4)
        // ============================================
        const { analytics_id, analytics_code } = data.google

        // Priority: Custom code > ID
        if (analytics_code && analytics_code.trim()) {
          // Use custom code
          injectScriptToHead(analytics_code.trim(), 'google-analytics-custom', true)
        } else if (analytics_id && analytics_id.trim()) {
          // Generate standard GA4 script
          const gaScript1 = document.createElement('script')
          gaScript1.async = true
          gaScript1.src = `https://www.googletagmanager.com/gtag/js?id=${analytics_id.trim()}`
          gaScript1.id = 'google-analytics-gtag'
          document.head.appendChild(gaScript1)

          const gaScript2 = document.createElement('script')
          gaScript2.id = 'google-analytics-config'
          gaScript2.textContent = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${analytics_id.trim()}');
          `
          document.head.appendChild(gaScript2)
        }

        // ============================================
        // GOOGLE TAG MANAGER (GTM)
        // ============================================
        const { tag_manager_id, tag_manager_code } = data.google

        // Priority: Custom code > ID
        if (tag_manager_code && tag_manager_code.trim()) {
          // Use custom code
          const parts = tag_manager_code.trim().split(/<noscript>|<\/noscript>/i)
          if (parts[0]) {
            injectScriptToHead(parts[0].trim(), 'gtm-custom-script')
          }
          if (parts[1]) {
            injectNoscriptToBody(parts[1].trim(), 'gtm-custom-noscript')
          }
        } else if (tag_manager_id && tag_manager_id.trim()) {
          // Generate standard GTM script
          const gtmScript = document.createElement('script')
          gtmScript.id = 'gtm-standard'
          gtmScript.textContent = `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${tag_manager_id.trim()}');
          `
          document.head.appendChild(gtmScript)

          injectNoscriptToBody(`<iframe src="https://www.googletagmanager.com/ns.html?id=${tag_manager_id.trim()}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`, 'gtm-standard-noscript')
        }

      } catch (error) {
        // Silent fail - don't break the app if tracking fails
        console.warn('Failed to load tracking scripts:', error)
      }
    }

    injectTrackingScripts()

    // Cleanup function
    return () => {
      mounted = false
    }
  }, [])

  // Helper: Inject script to head
  const injectScriptToHead = (content: string, id: string, isRawText = false) => {
    if (document.getElementById(id)) return // Already injected

    const script = document.createElement('script')
    script.id = id

    if (isRawText) {
      script.textContent = content
    } else {
      script.text = content
    }

    document.head.appendChild(script)
  }

  // Helper: Inject noscript to body
  const injectNoscriptToBody = (content: string, id: string) => {
    if (document.getElementById(id)) return // Already injected

    const noscript = document.createElement('noscript')
    noscript.id = id
    noscript.innerHTML = content
    document.body.appendChild(noscript)
  }

  return null // This component doesn't render anything
}
