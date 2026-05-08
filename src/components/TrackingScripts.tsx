'use client'

import { useEffect } from 'react'

interface TrackingData {
  facebook: {
    pixelId: string | null
    pixelCode: string | null
  }
  google: {
    analyticsId: string | null
    analyticsCode: string | null
    tagManagerId: string | null
    tagManagerCode: string | null
  }
}

export default function TrackingScripts() {
  useEffect(() => {
    let mounted = true

    const injectTrackingScripts = async () => {
      try {
        // Fetch tracking codes from API
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://probesh.hooknhunt.com/api/v2'
        const response = await fetch(`${apiUrl}/website/tracking`)
        if (!response.ok) return

        const result = await response.json()
        if (!result.success || !result.data) return

        const data: TrackingData = result.data

        if (!mounted) return

        // ============================================
        // FACEBOOK PIXEL
        // ============================================
        const { pixelId, pixelCode } = data.facebook

        // Priority: Custom code > ID
        if (pixelCode && pixelCode.trim()) {
          // Use custom code
          injectScriptToHead(pixelCode.trim(), 'facebook-pixel-custom')
        } else if (pixelId && pixelId.trim()) {
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
            fbq('init', '${pixelId.trim()}');
            fbq('track', 'PageView');
          `
          injectScriptToHead(standardPixelScript, 'facebook-pixel-standard')
          injectNoscriptToBody(`<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${pixelId.trim()}&ev=PageView&noscript=1"/>`, 'facebook-pixel-noscript')
        }

        // ============================================
        // GOOGLE ANALYTICS (GA4)
        // ============================================
        const { analyticsId, analyticsCode } = data.google

        // Priority: Custom code > ID
        if (analyticsCode && analyticsCode.trim()) {
          // Use custom code
          injectScriptToHead(analyticsCode.trim(), 'google-analytics-custom', true)
        } else if (analyticsId && analyticsId.trim()) {
          // Generate standard GA4 script
          const gaScript1 = document.createElement('script')
          gaScript1.async = true
          gaScript1.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId.trim()}`
          gaScript1.id = 'google-analytics-gtag'
          document.head.appendChild(gaScript1)

          const gaScript2 = document.createElement('script')
          gaScript2.id = 'google-analytics-config'
          gaScript2.textContent = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${analyticsId.trim()}');
          `
          document.head.appendChild(gaScript2)
        }

        // ============================================
        // GOOGLE TAG MANAGER (GTM)
        // ============================================
        const { tagManagerId, tagManagerCode } = data.google

        // Priority: Custom code > ID
        if (tagManagerCode && tagManagerCode.trim()) {
          // Use custom code
          const parts = tagManagerCode.trim().split(/<noscript>|<\/noscript>/i)
          if (parts[0]) {
            injectScriptToHead(parts[0].trim(), 'gtm-custom-script')
          }
          if (parts[1]) {
            injectNoscriptToBody(parts[1].trim(), 'gtm-custom-noscript')
          }
        } else if (tagManagerId && tagManagerId.trim()) {
          // Generate standard GTM script
          const gtmScript = document.createElement('script')
          gtmScript.id = 'gtm-standard'
          gtmScript.textContent = `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${tagManagerId.trim()}');
          `
          document.head.appendChild(gtmScript)

          injectNoscriptToBody(`<iframe src="https://www.googletagmanager.com/ns.html?id=${tagManagerId.trim()}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`, 'gtm-standard-noscript')
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

    // document.head.appendChild(script)
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
