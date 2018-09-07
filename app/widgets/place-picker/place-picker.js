import { ReduxMixin, ActionCreators, util, config, mintUrl } from '../../../src/engine.js'

class PlacePicker extends Polymer.mixinBehaviors(
  [Polymer.AppLocalizeBehavior],
  ReduxMixin(
    Polymer.GestureEventListeners(Polymer.Element)
  )) {
  static get is () { return 'place-picker' }

  static get actions () {
    return {
      savePlace: ActionCreators.savePlace,
      fetchMunicipalities: ActionCreators.fetchMunicipalities
    }
  }

  static get properties () {
    return {
      country: {
        type: String,
        value: config.country
      },
      places: {
        type: Array,
        statePath: 'places'
      },
      place: {
        type: Object,
        value: {}
      },
      googlePlace: {
        type: Object,
        observer: '_googlePlaceChanged'
      },
      googleMapsApiKey: {
        type: String,
        value: config.map.googleApiKey
      },
      selectedState: {
        type: String,
        value: null,
        observer: '_selectedStateChanged'
      },
      states: {
        type: Array,
        statePath: 'states'
      },
      municipalities: {
        type: Object,
        statePath: 'municipalities'
      },
      stateMunicipalities: {
        type: Array,
        computed: '_selectMunicipalities(selectedState, municipalities)'
      },
      municipalityBbox: {
        type: Object,
        computed: '_computeMunicipalityBbox(selectedMunicipality, selectedState, municipalities)'
      },
      language: {
        type: String,
        statePath: 'language'
      },
      resources: {
        type: Object,
        statePath: 'labels'
      }
    }
  }

  reset () {
    this.set('selectedState', null)
    this.set('selectedMunicipality', null)
    this.set('googlePlace', null)
  }

  _selectedStateChanged (stateId) {
    if (stateId === null) {
      this.set('selectedMunicipality', null)
    } else {
      this.dispatch('fetchMunicipalities', stateId)
    }
  }

  _selectMunicipalities (selectedState, municipalities) {
    if (!selectedState) return
    return municipalities[selectedState]
  }

  _computeMunicipalityBbox (selectedMunicipality, selectedState, municipalities) {
    if (!selectedMunicipality || !selectedState) return
    return util.getRef(selectedMunicipality, municipalities[selectedState]).bbox
  }

  _googlePlaceChanged (googlePlace) {
    if (googlePlace && googlePlace.place_id) {
      let exactPlace = this.places.find(place => place.googlePlaceId === googlePlace.place_id)
      if (!exactPlace) {
        exactPlace = {
          type: 'Place',
          level: 'other',
          address: googlePlace.formatted_address,
          latitude: googlePlace.latLng.lat,
          longitude: googlePlace.latLng.lng,
          googlePlaceId: googlePlace.place_id,
          bbox: googlePlace.bbox
        }
      }
      this.set('place', exactPlace)
    }
  }

  _add () {
    if (!this.selectedState) return
    let relevantPlaces = [util.getRef(this.selectedState, this.states)]
    if (this.selectedMunicipality) {
      relevantPlaces.push(util.getRef(this.selectedMunicipality, this.municipalities[this.selectedState]))
    }
    if (this.place.googlePlaceId) {
      relevantPlaces.push(this.place)
    }
    let placesToSave = relevantPlaces.filter(placeToSave =>
      !this.places.find(pl =>
        pl._id === placeToSave._id ||
        (placeToSave.googlePlaceId && pl.googlePlaceId === placeToSave.googlePlaceId)
      )
    )
    placesToSave.forEach(placeToSave => {
      if (placeToSave.googlePlaceId) {
        placeToSave.state = this.selectedState
        placeToSave.municipality = this.selectedMunicipality
        placeToSave._id = mintUrl({ type: 'Place' })
      }
      this.dispatch('savePlace', placeToSave)
      // TODO catch if savePlace fail
    })
    let placePicked = relevantPlaces.pop()
    this.dispatchEvent(new CustomEvent('picked', { detail: placePicked._id }))
    this.reset()
  }

  _cancel () {
    this.dispatchEvent(new CustomEvent('canceled'))
    this.reset()
  }
}
window.customElements.define(PlacePicker.is, PlacePicker)
