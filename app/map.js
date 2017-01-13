Polymer({
  is: 'vientos-map',
  behaviors: [ ReduxBehavior ],

  properties: {
    map: {
      type: Object
    },
    mapLatitude: {
      type: Number,
      value: 19.43
    },
    mapLongitude: {
      type: Number,
      value: -99.13
    },
    mapZoom: {
      type: Number,
      value: 11
    },
    projects: {
      type: Array,
      statePath: 'projects'
    },
    visibleLocations: {
      type: Array,
      value: [],
      computed: '_extractLocations(projects, mapLatitude, mapLongitude, mapZoom)'
    },
    myLatitude: {
      type: Number
    },
    myLongitude: {
      type: Number
    },
    myAccuracy: {
      type: Number()
    }
  },

  // FIXME: calculations work only for NW coordinates
  _extractLocations () {
    let map = this.$.map.map
    let sw, ne
    if (map) {
      ({ _southWest: sw, _northEast: ne } = map.getBounds())
    } else {
      sw = { lat: 0, lng: -180 }
      ne = { lat: 90, lng: 0 }
    }
    return this.projects.reduce((acc, project) => {
      // TODO: move normalization to reducer
      if (!project.locations) project.locations = []
      project.locations.forEach(location => {
        if (Number(location.latitude) <= ne.lat && Number(location.latitude) >= sw.lat &&
            Number(location.longitude) <= ne.lng && Number(location.longitude) >= sw.lng) {
          acc.push({
            latitude: location.latitude,
            longitude: location.longitude,
            project: project
          })
        }
      })
      return acc
    }, [])
  },

  _markerClick (event) {
    this.fire('selected', event.model.item.project._id)
  }

})
