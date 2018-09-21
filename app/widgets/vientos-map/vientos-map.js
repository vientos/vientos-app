import { config, util } from '../../../src/engine.js'

class VientosMap extends Polymer.Element {
  static get is () { return 'vientos-map' }

  static get properties () {
    return {
      map: {
        type: Object
      },
      latitude: {
        type: Number,
        value: config.map.latitude
      },
      longitude: {
        type: Number,
        value: config.map.longitude
      },
      zoom: {
        type: Number,
        value: config.map.zoom
      },
      currentPlace: {
        type: String,
        observer: '_showPlace'
      },
      boundingBox: {
        type: Object,
        computed: '_getBoundingBox(latitude, longitude, zoom)',
        observer: '_updatedBoundingBox'
      },
      myLatitude: {
        type: Number
      },
      myLongitude: {
        type: Number
      },
      myAccuracy: {
        type: Number
      },
      tilelayer: {
        type: String,
        value: () => { return config.map.tilelayer }
      }
    }
  }

  static get observers () {
    return [
      '_redrawMarkers(locations, projects, intents, currentPlace)'
    ]
  }

  _initializeMap ({ createMap, tileLayer, layerGroup, marker, icon, divIcon, toPoint }) {
    this.map = createMap(this.$.map)
    this.meIcon = divIcon({
      html: '<div id="my-location"></div>'
    })
    if (this.currentPlace) {
      this._showPlace(this.currentPlace)
    } else {
      this.map.setView([this.latitude, this.longitude], this.zoom)
    }

    tileLayer(this.tilelayer).addTo(this.map)
    this.markers = layerGroup().addTo(this.map)
    this.map
      .on('locationfound', e => {
        marker([e.latitude, e.longitude], { icon: this.meIcon })
          .addTo(this.map)
        this.myLatitude = e.latitude
        this.myLongitude = e.longitude
        this.myAccuracy = e.accuracy
        this._showMyLocation()
      })
      .on('zoomend', e => {
        this.zoom = this.map.getZoom()
      })
      .on('moveend', e => {
        this.latitude = this.map.getCenter().lat
        this.longitude = this.map.getCenter().lng
      })
    this._drawMarkers = function drawMarkers (locations, projects, intents, currentPlace) {
      if (!locations) return
      if (!intents) intents = []
      if (!projects) projects = []
      let iconSize = toPoint(24, 24)
      this.markers.clearLayers()
      locations.forEach(place => {
        let projectCount = projects.filter(project => util.locatedIn(project, place, this.places)).length
        let intentCount = intents.filter(intent => util.locatedIn(intent, place, this.places)).length
        if (!projectCount && !intentCount) return
        let classes = ''
        if (place._id === currentPlace) {
          classes += 'selected '
          iconSize = toPoint(32, 32)
        }
        if (projectCount > 0) classes += 'projects '
        if (intentCount > 0) classes += 'intents'
        let intentsHtml = intentCount ? `<div>${intentCount}</div>` : ''
        let html = `
          <div class="${classes}">
            ${projectCount > 0 ? projectCount : ''}
            ${intentsHtml}
          </div>
        `
        let icon = divIcon({html, iconSize})
        marker([place.latitude, place.longitude], { placeId: place._id, icon })
          .addTo(this.markers)
          .on('click', e => {
            this._placeSelected(e.target.options.placeId, this.currentPlace)
          })
      })
    }

    if (this.locations) this._drawMarkers(this.locations, this.projects, this.intents, this.currentPlace)
    // FIXME do only once, after viewing map page.. If not this 100 ms interval, doesn't load some tiles
    setInterval(() => {
      this.map.invalidateSize()
    }, 200)
    setTimeout(() => {
      // hack to get boundingBox set and trigger map View changed
      this.set('latitude', this.latitude - 0.0001)
    }, 500)
  }

  _redrawMarkers (locations, projects, intents, currentPlace) {
    if (this.map && locations) {
      this._drawMarkers(locations, projects, intents, currentPlace)
    }
  }

  _getBoundingBox (lat, lon, zoom) {
    if (this.map) {
      let sw, ne
      ({ _southWest: sw, _northEast: ne } = this.map.getBounds())
      return { sw, ne }
    }
  }

  _placeSelected (placeId, currentPlace) {
    let marker = Object.values(this.markers._layers).find(m => m.options.placeId === placeId)
    let icon
    if (marker) icon = marker._icon.querySelector('iron-icon')
    let hasIntents = this.intents.filter(intent => util.locatedIn(intent, placeId, this.places)).length > 0
    let hasProjects = this.projects.filter(project => util.locatedIn(project, placeId, this.places)).length > 0
    let route = window.location.pathname
    if (hasIntents && !hasProjects) route = '/intents'
    if (!hasIntents && hasProjects) route = '/projects'
    if (placeId !== currentPlace) {
      if (icon) icon.classList.add('selected')
      window.history.pushState({}, '', `${route}?place=${placeId}`)
      window.dispatchEvent(new CustomEvent('location-changed'))
    } else {
      if (icon) icon.classList.remove('selected')
      window.history.replaceState({}, '', `${route}#map`)
      window.dispatchEvent(new CustomEvent('location-changed'))
    }
  }

  _updatedBoundingBox () {
    // FIXME gets called 3 times for lat, lon and zoom
    if (this.boundingBox) {
      this.dispatchEvent(new CustomEvent('view-changed', { detail: {
        bbox: this.boundingBox,
        zoom: this.map.getZoom()
      } }))
    }
  }

  _showPlace (currentPlace) {
    if (!currentPlace || !this.places.length || !this.map) return
    let bbox = util.getRef(currentPlace, this.places).bbox
    this.map.fitBounds([
      [bbox.south, bbox.west],
      [bbox.north, bbox.east]
    ])
  }

  _showMyLocation () {
    if (this.myLatitude && this.myLongitude) {
      this.set('view', {
        latitude: this.myLatitude,
        longitude: this.myLongitude,
        zoom: 15 // FIXME move magic number to config
      })
    } else {
      this.map.locate()
    }
  }

  _viewChanged (view) {
    if (this.map) this.map.setView([view.latitude, view.longitude], view.zoom)
  }

  ready () {
    super.ready()
    import(/* webpackChunkName: "vientos-leaflet" */ '../../../src/leaflet').then(this._initializeMap.bind(this))
  }
}
window.customElements.define(VientosMap.is, VientosMap)
