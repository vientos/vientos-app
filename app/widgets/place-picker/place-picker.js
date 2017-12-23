/* global google */
import { config } from '../../../src/engine.js'

class PlacePicker extends Polymer.Element {
  static get is () { return 'place-picker' }

  static get properties () {
    return {
      country: {
        type: String,
        value: config.country
      },
      language: {
        type: String,
        value: config.language
      },
      googleMapsApiKey: {
        type: String,
        value: config.map.googleApiKey
      }
    }
  }

  reset () {
    this.$['place-input'].value = ''
  }

  _onGoogleMapsApiLoad () {
    let options = { componentRestrictions: { country: this.country } }
    this.autocomplete = new google.maps.places.Autocomplete(this.$['place-input'], options)
    google.maps.event.addListener(this.autocomplete, 'place_changed', this._placeChanged.bind(this))
  }

  _placeChanged () {
    let googlePlace = this.autocomplete.getPlace()
    if (googlePlace.place_id) {
      let place = {
        address: googlePlace.formatted_address,
        latitude: googlePlace.geometry.location.lat(),
        longitude: googlePlace.geometry.location.lng(),
        googlePlaceId: googlePlace.place_id
      }
      this.dispatchEvent(new CustomEvent('picked', { detail: place }))
    }
    this.reset()
  }
}
window.customElements.define(PlacePicker.is, PlacePicker)
