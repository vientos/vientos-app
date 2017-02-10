const Polymer = window.Polymer
const L = window.L
Polymer({
  is: 'vientos-map',
  map: undefined,
  markers: undefined,
  ready () {
    this.map = L.map(this.$.map)
    this.icon = L.icon({ iconUrl: 'https://stendhalgame.org/images/mapmarker/me.png' })
    this.map.setView([this.latitude, this.longitude], this.zoom)

    L.tileLayer(this.tilelayer).addTo(this.map)
    this.markers = L.layerGroup().addTo(this.map)
    this.map
      .locate()
      .on('locationfound', e => {
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
      type: Number
    },
    longitude: {
      type: Number
    },
    zoom: {
      type: Number

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
    if (this.boundingBox) {
      this.fire('bbox', this.boundingBox)
    }
  }
})
