import 'raven-js'
// import './bower_components/intl-messageformat/dist/intl-messageformat.min.js'
import './bower_components/polymer/polymer.html'

// Load webcomponents-loader.js to check and load any polyfills your browser needs
import './bower_components/webcomponentsjs/webcomponents-loader.js'
document.addEventListener('WebComponentsReady', function webcomponentsready () {
  import(/* webpackChunkName: "vientos-shell" */ './app/vientos-shell/vientos-shell.html')
})

// // Load and register pre-caching Service Worker
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', function() {
//     navigator.serviceWorker.register(document.querySelector('base').href + 'service-worker.js')
//   })
// }
