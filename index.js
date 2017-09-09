import Raven from 'raven-js'
import IntlMessageFormat from 'intl-messageformat'
import { config } from './src/engine'

document.addEventListener('WebComponentsReady', function webcomponentsready () {
  import(/* webpackChunkName: "polymer" */ './bower_components/polymer/polymer.html').then(() => {
    import(/* webpackChunkName: "vientos-shell" */ './app/vientos-shell/vientos-shell.html')
  })
})

// required by app-localize-behavior
window.IntlMessageFormat = IntlMessageFormat

// report errors to sentry.io
if (config.sentry) Raven.config(config.sentry).install()

// // Load and register pre-caching Service Worker
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', function() {
//     navigator.serviceWorker.register(document.querySelector('base').href + 'service-worker.js')
//   })
// }
