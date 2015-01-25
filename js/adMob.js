define([], function ()
{
    'use strict';

    return {
        initialize: function ()
        {
            if (!window.plugins || !window.plugins.AdMob)
            {
                return false;
            }

            window.plugins.AdMob.setOptions(
            {
                publisherId: "ca-app-pub-1505211538661389/9132499359", // Banner ID
                bannerAtTop: false, // Set to true, to put banner at top
                overlap: false, // Set to true, to allow banner overlap webview
                offsetTopBar: true, // Set to true to avoid ios7 status bar overlap                    
                interstitialAdId: "ca-app-pub-1505211538661389/7774164158",
                autoShow: true, // autoshow intertitial Ad
                isTesting: false // receiving test ad
            });
            
            return true;
        },

        showBanner: function ()
        {
            window.plugins.AdMob.createBannerView();
        },

        showInterstitial: function ()
        {
            window.plugins.AdMob.createInterstitialView();
        }
    };
});