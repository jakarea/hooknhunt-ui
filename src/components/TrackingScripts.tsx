'use client'

import { useEffect } from 'react'
import api from '@/lib/api'

interface TrackingData {
  facebook: {
    pixelId?: string | null
    pixelCode?: string | null
  }
  google: {
    analyticsId?: string | null
    analyticsCode?: string | null
    tagManagerId?: string | null
    tagManagerCode?: string | null
  }
}

interface ApiResponse {
  success: boolean
  data: TrackingData
}

export default function TrackingScripts() {
  useEffect(() => {
    let mounted = true

    const injectTrackingScripts = async () => {
      try {
        const response = await api.getTrackingSettings() as ApiResponse

        if (!response.success || !response.data) {
          console.warn('[TrackingScripts] No tracking data returned from API')
          return
        }

        const data = response.data

        if (!mounted) return

        // ============================================
        // FACEBOOK PIXEL
        // ============================================
        const { pixelId, pixelCode } = data.facebook

        if (process.env.NODE_ENV === 'development') {
          console.log('[TrackingScripts] Facebook pixel data:', { pixelId, hasPixelCode: !!pixelCode })
        }

        // Priority: Custom code > ID
        if (pixelCode && pixelCode.trim()) {
          console.log('[TrackingScripts] Injecting custom Facebook pixel code')
          injectHtmlScript(pixelCode, 'facebook-pixel-custom')
        } else if (pixelId && pixelId.trim()) {
          console.log('[TrackingScripts] Injecting standard Facebook pixel with ID:', pixelId)
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
        } else {
          console.warn('[TrackingScripts] No Facebook pixel ID or code provided')
        }

        // ============================================
        // GOOGLE ANALYTICS (GA4)
        // ============================================
        const { analyticsId, analyticsCode } = data.google

        // Priority: Custom code > ID
        if (analyticsCode && analyticsCode.trim()) {
          // Use custom code (may contain HTML)
          injectHtmlScript(analyticsCode.trim(), 'google-analytics-custom')
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
          // Use custom HTML code (may contain <script> and <noscript> tags)
          injectHtmlScript(tagManagerCode.trim(), 'gtm-custom')
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

  // Helper: Safely decode HTML entities (backend now returns clean HTML, but keep as fallback)
  const decodeHtmlEntities = (html: string): string => {
    // Backend now decodes HTML before sending, but keep fallback for any remaining encoded entities
    if (!html || !html.includes('&')) {
      return html // Already clean
    }

    // Only decode if contains HTML entities
    const textarea = document.createElement('textarea')
    textarea.innerHTML = html
    const decoded = textarea.value

    // If multiple passes needed, repeat (handles rare triple-encoding edge cases)
    if (decoded !== html && decoded.includes('&')) {
      textarea.innerHTML = decoded
      return textarea.value
    }

    return decoded
  }

  // Helper: Inject HTML-containing script code (extracts JS from <script> tags)
  const injectHtmlScript = (htmlContent: string, id: string) => {
    if (document.getElementById(id)) {
      return
    }

    // Decode only if necessary
    const decoded = decodeHtmlEntities(htmlContent)

    // Create a temporary div to parse the HTML
    const temp = document.createElement('div')
    temp.innerHTML = decoded

    // Extract and execute script tags
    const scripts = temp.querySelectorAll('script')

    scripts.forEach((originalScript, index) => {
      const newScript = document.createElement('script')
      newScript.id = `${id}-${index}`

      // Copy all attributes (important for async, defer, etc.)
      Array.from(originalScript.attributes).forEach(attr => {
        if (attr.name !== 'id') {
          newScript.setAttribute(attr.name, attr.value)
        }
      })

      // Copy the script content
      if (originalScript.textContent) {
        newScript.textContent = originalScript.textContent
      }

      // Append to head (critical for pixel scripts to load first)
      document.head.appendChild(newScript)

      // Force script execution by creating a new script element
      // This ensures inline scripts run immediately
      if (originalScript.textContent && !originalScript.src) {
        const execScript = document.createElement('script')
        execScript.textContent = originalScript.textContent
        document.head.appendChild(execScript)
      }
    })

    // Handle noscript tags (add to body)
    const noscripts = temp.querySelectorAll('noscript')

    noscripts.forEach((noscript, index) => {
      if (noscript.textContent) {
        injectNoscriptToBody(noscript.textContent, `${id}-noscript-${index}`)
      }
    })

    // Log for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`[TrackingScripts] Injected ${id}:`, {
        scripts: scripts.length,
        noscripts: noscripts.length,
        content: decoded.substring(0, 100)
      })
    }
  }

  // Helper: Inject script to head (for direct JS code)
  const injectScriptToHead = (content: string, id: string, isRawText = false) => {
    if (document.getElementById(id)) return // Already injected

    const script = document.createElement('script')
    script.id = id
    script.type = 'text/javascript'

    // Use textContent for better compatibility
    script.textContent = content

    // Inject to head for early execution
    document.head.appendChild(script)

    // Force execution by waiting a tick
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        console.log('[TrackingScripts] Script injected:', id)
      }, 0)
    }
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
