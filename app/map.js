const Polymer = window.Polymer
const L = window.L

Polymer({
  is: 'vientos-map',
  map: undefined,
  markers: undefined,
  me: undefined,
  ready () {
    this.map = L.map(this.$.map)
    this.icon = L.icon({
      iconUrl: 'data:image/png;base64,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',
      iconSize: [16, 16]
    })
    this.map.setView([this.latitude, this.longitude], this.zoom)

    L.tileLayer(this.tilelayer).addTo(this.map)
    this.markers = L.layerGroup().addTo(this.map)
    this.me = L.layerGroup().addTo(this.map)
    this.map
      .locate()
      .on('locationfound', e => {
        L.marker([e.latitude, e.longitude], { icon: this.icon })
          .addTo(this.me)
        this.myLatitude = e.latitude
        this.myLongitude = e.longitude
        this.myAccuracy = e.accuracy
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
  _drawMarkers () {
    this.markers.clearLayers()
    this.locations.forEach(l => {
      L.marker([l.latitude, l.longitude], { project_id: l.project._id, icon: this.icon })
        .addTo(this.markers)
        .on('click', e => {
          this.fire('selected', e.target.options.project_id)
        })
    })
  },
  _updatedLocations () {
    if (this.map) {
      this._drawMarkers()
    }
  },
  _getBoundingBox () {
    if (this.map) {
      let sw, ne
      ({ _southWest: sw, _northEast: ne } = this.map.getBounds())
      return { sw, ne }
    }
  },
  _updatedBoundingBox () {
    // FIXME gets called 3 times for lat, lon and zoom
    if (this.boundingBox) {
      this.fire('bbox', this.boundingBox)
    }
  },
  _showMyLocation () {
    this.set('view', {
      latitude: this.myLatitude,
      longitude: this.myLongitude,
      zoom: 15
    })
  },

  _viewChanged (view) {
    if (this.map) this.map.setView([view.latitude, view.longitude], view.zoom)
  }
})
