class ImagePicker extends Polymer.Element {
  static get is () { return 'image-picker' }

  static get properties () {
    return {
      imageUrl: {
      // passed from parent
        type: String
      },
      label: {
      // passed from parent
        type: String
      },
      newImage: {
        type: Object,
        value: null
      },
      imagePreviewSrc: {
        type: String,
        computed: '_getImagePreviewSrc(imageUrl, newImage)'
      }
    }
  }

  // called from parent
  reset () {
    this.set('newImage', null)
    this.$['new-image-form'].reset()
  }

  _imageInputChanged (e) {
    let image = e.target.files[0]
    if (image) {
      this.set('newImage', image)
      this.dispatchEvent(new CustomEvent('picked', { detail: image }))
    }
  }

  _getImagePreviewSrc (imageUrl, newImage) {
    if (newImage) {
      return window.URL.createObjectURL(newImage)
    } else if (imageUrl) {
      return imageUrl
    }
  }
}
window.customElements.define(ImagePicker.is, ImagePicker)
