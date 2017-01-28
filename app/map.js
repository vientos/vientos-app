Polymer({
  is: 'vientos-map',
  properties: {
    locations: {
      type: Array
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

  _getBoundingBox () {
    let map = this.$.map.map
    if (map) {
      let sw, ne
      ({ _southWest: sw, _northEast: ne } = map.getBounds())
      return { sw, ne }
    }
  },
  _updatedBoundingBox () {
    if (this.boundingBox) {
      this.fire('bbox', this.boundingBox)
    }
  },

  _markerClick (event) {
    this.fire('selected', event.model.item.project._id)
  }

})
