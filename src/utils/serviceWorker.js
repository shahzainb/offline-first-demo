const ServiceWorker = {
  init () {
    if ('serviceWorker' in navigator) {
      navigator
        .serviceWorker
        .register('service-worker.js')
        .then(registration => {
          let serviceWorker;

          if (registration.installing) {
            serviceWorker = registration.installing;
            console.log('installing');
          }
          else if (registration.waiting) {
            serviceWorker = registration.waiting;
            console.log('waiting');
          }
          else if (registration.active) {
            serviceWorker = registration.active;
            console.log('active');
          }

          if (serviceWorker) {
            console.log(serviceWorker.state);
            serviceWorker.addEventListener('statechange', function (e) {
              console.log(e.target.state);
            });
          }
        })
        .catch((e) => {
          console.error('Error during service worker registration:', e);
        });
    }
  }
};

export default ServiceWorker;
