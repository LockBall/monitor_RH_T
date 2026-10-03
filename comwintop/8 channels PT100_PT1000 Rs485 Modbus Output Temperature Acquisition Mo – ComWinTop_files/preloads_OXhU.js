
    (function() {
      var preconnectOrigins = ["https://cdn.shopify.com"];
      var scripts = ["/cdn/shopifycloud/checkout-web/assets/c1/polyfills.DsjDEvpF.js","/cdn/shopifycloud/checkout-web/assets/c1/app.DGSHpWaV.js","/cdn/shopifycloud/checkout-web/assets/c1/2c1ab0fe.GMbxnz74.js","/cdn/shopifycloud/checkout-web/assets/c1/6a2fc6d6.CB7WRe6i.js","/cdn/shopifycloud/checkout-web/assets/c1/4c290a1e.DMQ9xOwP.js","/cdn/shopifycloud/checkout-web/assets/c1/bb728e1c.CHt2JlPY.js","/cdn/shopifycloud/checkout-web/assets/c1/cf29e63b.BYllFEI4.js","/cdn/shopifycloud/checkout-web/assets/c1/cb38e5c2.Hmwo5zs2.js","/cdn/shopifycloud/checkout-web/assets/c1/413b21e2.DZZRDa_s.js","/cdn/shopifycloud/checkout-web/assets/c1/e477f96c.DJuIaq7S.js","/cdn/shopifycloud/checkout-web/assets/c1/2255f8fa.CDyfBNrW.js","/cdn/shopifycloud/checkout-web/assets/c1/b8733b27.05ur1szn.js","/cdn/shopifycloud/checkout-web/assets/c1/e39bc11c.D2a9UHbt.js","/cdn/shopifycloud/checkout-web/assets/c1/08a3b809.DDk5v8y8.js","/cdn/shopifycloud/checkout-web/assets/c1/bff2ff9b.Cy_si-5k.js","/cdn/shopifycloud/checkout-web/assets/c1/5fda1420.BLaDhoyL.js","/cdn/shopifycloud/checkout-web/assets/c1/164ad2e3.B4L1MRYB.js","/cdn/shopifycloud/checkout-web/assets/c1/9f047e05.DwjCPgK0.js","/cdn/shopifycloud/checkout-web/assets/c1/0a7dffce.BcNpdEJk.js","/cdn/shopifycloud/checkout-web/assets/c1/60a453ce.Cg9T1Gj2.js","/cdn/shopifycloud/checkout-web/assets/c1/21cc90a2.Ccyorzx_.js","/cdn/shopifycloud/checkout-web/assets/c1/fb3b4968.CfrqMjFZ.js","/cdn/shopifycloud/checkout-web/assets/c1/f8706cb6.Dq4SNRnK.js","/cdn/shopifycloud/checkout-web/assets/c1/dffdfb34.5SAJ7sQR.js","/cdn/shopifycloud/checkout-web/assets/c1/31cc568e.CVMsqQ1x.js","/cdn/shopifycloud/checkout-web/assets/c1/0c0ad074.Dl7fvU-G.js","/cdn/shopifycloud/checkout-web/assets/c1/53bbdad9.oGVvLPt2.js","/cdn/shopifycloud/checkout-web/assets/c1/945a08d6.c61SBjtG.js","/cdn/shopifycloud/checkout-web/assets/c1/2fdb3dd3.DyNzUnPi.js","/cdn/shopifycloud/checkout-web/assets/c1/0e67bd3b.DUa61rto.js","/cdn/shopifycloud/checkout-web/assets/c1/74835653.DeaMa2xw.js","/cdn/shopifycloud/checkout-web/assets/c1/29034f35.DARWjbfB.js","/cdn/shopifycloud/checkout-web/assets/c1/ac5a19ff.BchXgW63.js","/cdn/shopifycloud/checkout-web/assets/c1/47b970b2.C6dKnXeF.js","/cdn/shopifycloud/checkout-web/assets/c1/0727407f.DihGPUji.js","/cdn/shopifycloud/checkout-web/assets/c1/064f6ac1.DPGuEQ9h.js","/cdn/shopifycloud/checkout-web/assets/c1/efa0389a.ZcaEqvMP.js","/cdn/shopifycloud/checkout-web/assets/c1/f1968089.lfvhhPdb.js","/cdn/shopifycloud/checkout-web/assets/c1/55098bf1.SNyaSeYe.js","/cdn/shopifycloud/checkout-web/assets/c1/cb5cf153.CBk88ZOK.js","/cdn/shopifycloud/checkout-web/assets/c1/e3e348f2.DAaElZ9-.js","/cdn/shopifycloud/checkout-web/assets/c1/ca5e9c49.DIuWAPOX.js","/cdn/shopifycloud/checkout-web/assets/c1/ed9f2238.BDG257lM.js","/cdn/shopifycloud/checkout-web/assets/c1/ccdf3592.y_I-TghG.js","/cdn/shopifycloud/checkout-web/assets/c1/a422df8c.B9fLTQ4u.js","/cdn/shopifycloud/checkout-web/assets/c1/79974aab.DPBsbYrf.js","/cdn/shopifycloud/checkout-web/assets/c1/7b0c98ea.B54fWMkZ.js","/cdn/shopifycloud/checkout-web/assets/c1/d22d2b80.CPLrR--0.js","/cdn/shopifycloud/checkout-web/assets/c1/f49d4216.C2ooXZfg.js","/cdn/shopifycloud/checkout-web/assets/c1/0e9ee714.BUAjwk_6.js","/cdn/shopifycloud/checkout-web/assets/c1/39921a74.BMGPgeDG.js","/cdn/shopifycloud/checkout-web/assets/c1/ec391382.CdHY2UiR.js","/cdn/shopifycloud/checkout-web/assets/c1/f3fe2775.Cg8b5yuM.js","/cdn/shopifycloud/checkout-web/assets/c1/598fef4e.Blg5kMTg.js","/cdn/shopifycloud/checkout-web/assets/c1/e77f7fe0.BZPIxVUE.js","/cdn/shopifycloud/checkout-web/assets/c1/cc6ff67d.D2x8Yxrg.js","/cdn/shopifycloud/checkout-web/assets/c1/87bfafec.4CtkSIvo.js","/cdn/shopifycloud/checkout-web/assets/c1/dfca5da5.BJQx_CCE.js","/cdn/shopifycloud/checkout-web/assets/c1/6720fa5f.B84Z8I3K.js","/cdn/shopifycloud/checkout-web/assets/c1/01973ac7.hFyCq2Rp.js","/cdn/shopifycloud/checkout-web/assets/c1/58314944.D85q6ENI.js","/cdn/shopifycloud/checkout-web/assets/c1/7a8217fd.C-KSXAi3.js","/cdn/shopifycloud/checkout-web/assets/c1/2b89a178.dq9bza6T.js","/cdn/shopifycloud/checkout-web/assets/c1/b684bff6.FsqZYmPf.js","/cdn/shopifycloud/checkout-web/assets/c1/910cd6e2.C--KAxpp.js","/cdn/shopifycloud/checkout-web/assets/c1/347b440c.-JodZrUc.js","/cdn/shopifycloud/checkout-web/assets/c1/d5d34b3b.D0jJQL_d.js","/cdn/shopifycloud/checkout-web/assets/c1/181d38d3.bNzFxA5T.js","/cdn/shopifycloud/checkout-web/assets/c1/d6447d9e.BtUd7XAf.js","/cdn/shopifycloud/checkout-web/assets/c1/f51e663e.Cb7U9v8A.js","/cdn/shopifycloud/checkout-web/assets/c1/64de7b49.yFRdciMn.js","/cdn/shopifycloud/checkout-web/assets/c1/8e79be58.DbjZmhsu.js","/cdn/shopifycloud/checkout-web/assets/c1/90e26f5f.C0yU_UAv.js","/cdn/shopifycloud/checkout-web/assets/c1/f3e117aa.DNg1dGVr.js","/cdn/shopifycloud/checkout-web/assets/c1/a25deb9a.BE5O6zot.js","/cdn/shopifycloud/checkout-web/assets/c1/7aefefff.BlVjin5V.js","/cdn/shopifycloud/checkout-web/assets/c1/a535174a.DPVRr5eA.js","/cdn/shopifycloud/checkout-web/assets/c1/5fd968f2.BwKCnifP.js","/cdn/shopifycloud/checkout-web/assets/c1/73a9b0a0.gCS2W2-n.js","/cdn/shopifycloud/checkout-web/assets/c1/91319467.DpeMFOvW.js","/cdn/shopifycloud/checkout-web/assets/c1/86720dbb.DHZl5FAg.js","/cdn/shopifycloud/checkout-web/assets/c1/7114e006.DxMyqTAB.js","/cdn/shopifycloud/checkout-web/assets/c1/f692f62f.DHgy7Fzw.js","/cdn/shopifycloud/checkout-web/assets/c1/e0989459.DW399CzT.js","/cdn/shopifycloud/checkout-web/assets/c1/fc21c11a.Dku7sbdq.js","/cdn/shopifycloud/checkout-web/assets/c1/4ea44c06.Cj0Sc_bl.js","/cdn/shopifycloud/checkout-web/assets/c1/1ed8f5e3.DkmKdCgD.js","/cdn/shopifycloud/checkout-web/assets/c1/7ee73f43.QtnstTj2.js","/cdn/shopifycloud/checkout-web/assets/c1/c10167e6.DW7aL1mi.js","/cdn/shopifycloud/checkout-web/assets/c1/b9c0319a.CIGlacbX.js","/cdn/shopifycloud/checkout-web/assets/c1/3a819064.DvJdzPv7.js","/cdn/shopifycloud/checkout-web/assets/c1/d2e6a587.Dn0L4cvy.js"];
      var styles = ["/cdn/shopifycloud/checkout-web/assets/c1/assets/app.BuSMBobh.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/previous.Cyrg41An.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/helpers.CWAfD7H_.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/OnePage.B8fMdKm8.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/VatNumberValidationField.DFhaUJdw.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/StickyPayButton.pnFPnjHJ.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/hasViolationsIgnoringCodes.CQ_TUsw-.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/Section.CU18S7Ap.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/Rollup.DH9hPBhl.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/PaymentIcon.DUuFvlux.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/useShopPayProgressIntercepts.DIc3vsmn.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/Choice.CIaVEvsx.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/PaymentLine.B_vs66ws.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/BillingAddressForm.2HXntA0X.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/Switch.CxvbvO76.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/EmptyState.CZwDb_Yh.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/index.CiYh36Pk.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/useShopPayButtonClassName.Lp0gX49z.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/PhoneField.-WW1pYgW.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/Middot.kivijyjU.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/ShippingLines.DCj76NbH.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/EstimatedDeliveryContent.D-6PyHqX.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/TransitionHeight.CuRoM9zv.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/BelowTheFoldContent.FKWAC7pT.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/Captcha.CJQgLR0i.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/RememberMeSection.Bn_OeoXz.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/PayButtonSection.ClYw8kJs.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/PaymentOptionSelector.FapYWhnE.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/PaymentMethodProgressionHost.DAMvZY87.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/MobileOrderSummary.DZEwkLmi.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/PaymentButtons.DCbwzC5k.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/Popover.Bi1nHaU-.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/floating-layer.DfWUBaTh.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/ShippingMethodSelector.D038PkOR.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/SubscriptionPriceBreakdown.vTcdVGq4.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/MissingFields.BbxB_6wt.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/RedirectionNotice.B8v_QGNW.css"];
      var fontPreconnectUrls = [];
      var fontPrefetchUrls = [];
      var imgPrefetchUrls = [];

      function preconnect(url, callback) {
        var link = document.createElement('link');
        link.rel = 'dns-prefetch preconnect';
        link.href = url;
        link.crossOrigin = '';
        link.onload = link.onerror = callback;
        document.head.appendChild(link);
      }

      function preconnectAssets() {
        var resources = preconnectOrigins.concat(fontPreconnectUrls);
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) preconnect(res, next);
        })();
      }

      function prefetch(url, as, callback) {
        var link = document.createElement('link');
        if (link.relList.supports('prefetch')) {
          link.rel = 'prefetch';
          link.fetchPriority = 'low';
          link.as = as;
          if (as === 'font') link.type = 'font/woff2';
          link.href = url;
          link.crossOrigin = '';
          link.onload = link.onerror = callback;
          document.head.appendChild(link);
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onloadend = callback;
          xhr.send();
        }
      }

      function prefetchAssets() {
        var resources = [].concat(
          scripts.map(function(url) { return [url, 'script']; }),
          styles.map(function(url) { return [url, 'style']; }),
          fontPrefetchUrls.map(function(url) { return [url, 'font']; }),
          imgPrefetchUrls.map(function(url) { return [url, 'image']; })
        );
        var index = 0;
        function run() {
          var res = resources[index++];
          if (res) prefetch(res[0], res[1], next);
        }
        var next = (self.requestIdleCallback || setTimeout).bind(self, run);
        next();
      }

      function onLoaded() {
        try {
          if (parseFloat(navigator.connection.effectiveType) > 2 && !navigator.connection.saveData) {
            preconnectAssets();
            prefetchAssets();
          }
        } catch (e) {}
      }

      if (document.readyState === 'complete') {
        onLoaded();
      } else {
        addEventListener('load', onLoaded);
      }
    })();
  