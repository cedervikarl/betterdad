// Facebook Pixel helper
export const initFacebookPixel = () => {
  try {
    if (typeof window === 'undefined') {
      return // Server-side rendering, skip
    }
    
    if (window.fbq) {
      return // Already initialized
    }

    // Facebook Pixel ID
    const PIXEL_ID = import.meta.env.VITE_FACEBOOK_PIXEL_ID || '2044437109839927'

    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');

    if (window.fbq) {
      window.fbq('init', PIXEL_ID);
      window.fbq('track', 'PageView');
    }
  } catch (error) {
    console.error('Facebook Pixel initialization error:', error)
    // Don't crash the app if Pixel fails
  }
}

export const trackEvent = (eventName, parameters = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, parameters);
    console.log('📊 Facebook Pixel Event:', eventName, parameters);
  }
}

export const trackPurchase = (value, currency = 'EUR') => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Purchase', {
      value: value,
      currency: currency
    });
    console.log('💰 Facebook Pixel Purchase:', value, currency);
  }
}

