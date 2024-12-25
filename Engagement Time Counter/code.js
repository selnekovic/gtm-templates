<script>
(function() {
  try {
    // Vars
    var oN = 'mxl_ec'; // LocalStorage obj name
    var sT =  30 * 60000; // session time msec ** ADJUST **
    var iT = 5 * 60000; // inactivity timeout msec ** ADJUST **
    
    var cT = new Date().getTime(); 
    var sE = null; 
    var iTmr; // Timer for inactivity
    var a = false; // User activity flag
    var peT = 0; // Page engagement time

    // Retrieve or init obj from LocalStorage
    var o = JSON.parse(localStorage.getItem(oN)) || {};
    var seT = parseInt(localStorage.getItem("seT")) || 0; 
    
    // Session count (sc) - Track sessions
    var sc = parseInt(o.sc, 10) || 0;
    
    // New session check based on sc and timestamp
    if (sc === 0) {
      // New session
      o.ts = cT; 
      sc++;
      o.sc = sc; 
      o.ns = 'true'; 
    } else {
      var lTs = o.ts; 
      var tD = cT - lTs; 

      // Check if the last timestamp is older than 30 min
      if (tD > sT) {
        sc++;
        o.sc = sc; 
        o.ns = 'true'; 
      } else {
        o.ns = 'false'; 
      }
      o.ts = cT; 
    }

    // Store updated object in LocalStorage
    localStorage.setItem(oN, JSON.stringify(o));
    
    // Reset 'eT' to 0 if new session
    if (o.ns === 'true') {
      localStorage.setItem('seT', '0'); 
      seT = 0;
    }

    // Start engagement tracking
    var s = function() {
      if (!a) {
        a = true; 
        sE = new Date().getTime(); 
        seT = parseInt(localStorage.getItem("seT")) || seT; 
        r(); 
      }
    };

    // Stop engagement tracking
    var st = function() {
      if (a) {
        var cT = new Date().getTime(); 
        var tD = Math.round((cT - sE) / 1000);
        seT += tD; 
        peT += tD; 
        localStorage.setItem('seT', seT); 
        sessionStorage.setItem('peT', peT); 
        a = false; 
      }
    };

    // Send engagement data to the server
    var e = function(peT, seT) {
      var dseT = parseInt(localStorage.getItem("seT")) || seT;
      
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "page_closed",  
        page_eng_time: peT, 
        session_eng_time: dseT
       });
    };

    // Reset inactivity timer
    var r = function() {
      clearTimeout(iTmr); 
      iTmr = setTimeout(st, iT); 
    };

    // Event listener for page blur (user becomes inactive)
    window.addEventListener('blur', function() {
      st(); 
    });

    // Event listener for page focus (user becomes active)
    window.addEventListener('focus', function() {
      s(); 
    });

    // Event listener for before page unload
    window.addEventListener('beforeunload', function(event) {
      st(); 
      e(peT, seT); 
    });

    // Monitor user activity to reset inactivity timer
    var m = function() {
      s(); 
      r(); 
    };

    // Event listeners to monitor user activity (mouse, keyboard, scroll, touch)
    window.addEventListener('mousemove', m);
    window.addEventListener('keydown', m);
    window.addEventListener('scroll', m);
    window.addEventListener('touchmove', m);

    // Initialize inactivity timer when the page loads
    iTmr = setTimeout(st, iT);

  } catch (err) {
    // Error handling: Log any errors encountered
    console.error('Error in storage counter tag:', err);
  }
})();
</script>