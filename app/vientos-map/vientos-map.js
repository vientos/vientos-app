/* global Polymer, L, CustomEvent, util */

Polymer({
  is: 'vientos-map',
  map: undefined,
  markers: undefined,
  me: undefined,

  properties: {
    locations: {
      type: Array,
      observer: '_updatedLocations'
    },
    map: {
      type: Object
    },
    latitude: {
      type: Number,
      value: window.vientos.config.map.latitude
    },
    longitude: {
      type: Number,
      value: window.vientos.config.map.longitude
    },
    zoom: {
      type: Number,
      value: window.vientos.config.map.zoom
    },
    view: {
      type: Object,
      observer: '_viewChanged'
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
      value: () => { return window.vientos.config.map.tilelayer }
    }
  },

  _initializeMap () {
    this.map = L.map(this.$.map)
    this.meIcon = L.icon({
      iconUrl: 'data:image/png;base64,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',
      iconSize: [32, 32]
    })
    this.map.setView([this.latitude, this.longitude], this.zoom)

    L.tileLayer(this.tilelayer).addTo(this.map)
    this.markers = L.layerGroup().addTo(this.map)
    this.me = L.layerGroup().addTo(this.map)
    this.map
      .on('locationfound', e => {
        L.marker([e.latitude, e.longitude], { icon: this.meIcon })
          .addTo(this.me)
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
    this._drawMarkers()
  },

  _drawMarkers () {
    let icon = this.of === 'projects' ? 'organization' : 'intent'
    this.icon = L.divIcon({
      html: `<iron-icon icon="vientos:${icon}"></iron-icon>`,
      iconSize: L.point(24, 24)
    })
    this.markers.clearLayers()
    this.locations.forEach(place => {
      L.marker([place.latitude, place.longitude], { placeId: place._id, icon: this.icon })
        .addTo(this.markers)
        .on('click', e => {
          this._placeSelected(e.target.options.placeId)
        })
    })
  },

  _updatedLocations () {
    if (this.map) {
      this._drawMarkers()
    }
  },

  _getBoundingBox (lat, lon, zoom) {
    if (this.map) {
      let sw, ne
      ({ _southWest: sw, _northEast: ne } = this.map.getBounds())
      return { sw, ne }
    }
  },

  _placeSelected (placeId) {
    window.history.pushState({}, '', util.pathFor(placeId, 'place'))
    window.dispatchEvent(new CustomEvent('location-changed'))
  },

  _updatedBoundingBox () {
    // FIXME gets called 3 times for lat, lon and zoom
    if (this.boundingBox) {
      this.fire('bbox', this.boundingBox)
    }
  },

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
  },

  _viewChanged (view) {
    if (this.map) this.map.setView([view.latitude, view.longitude], view.zoom)
  },

  ready () {
    this._initializeMap()
    // FIXME do only once, after viewing map page.. If not this 100 ms interval, doesn't load some tiles
    setInterval(() => {
      this.map.invalidateSize()
    }, 200)
  }
})
