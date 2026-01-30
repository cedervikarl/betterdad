// Facebook Pixel helper
export const initFacebookPixel = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    return // Already initialized
  }

  // Replace YOUR_PIXEL_ID with your actual Pixel ID from Facebook Events Manager
  const PIXEL_ID = import.meta.env.VITE_FACEBOOK_PIXEL_ID || 'YOUR_PIXEL_ID'

  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');

  window.fbq('init', PIXEL_ID);
  window.fbq('track', 'PageView');
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

