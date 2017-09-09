import 'raven-js'
// import './bower_components/intl-messageformat/dist/intl-messageformat.min.js'
import './bower_components/polymer/polymer.html'
import IntlMessageFormat from 'intl-messageformat'

// Load webcomponents-loader.js to check and load any polyfills your browser needs
import './bower_components/webcomponentsjs/webcomponents-loader.js'
document.addEventListener('WebComponentsReady', function webcomponentsready () {
  import(/* webpackChunkName: "engine" */ './src/engine.js').then(() => {
    import(/* webpackChunkName: "vientos-shell" */ './app/vientos-shell/vientos-shell.html')
  })
})
window.IntlMessageFormat = IntlMessageFormat

// // Load and register pre-caching Service Worker
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', function() {
//     navigator.serviceWorker.register(document.querySelector('base').href + 'service-worker.js')
//   })
// }
