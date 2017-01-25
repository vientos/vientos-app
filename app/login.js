Polymer({
  is: 'vientos-login',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],
  actions: {
    login (username, password) {
      return {
        type: window.vientos.ActionTypes.LOGIN_REQUESTED,
        username,
        password
      }
    }
  },

  properties: {
    language: {
      type: String,
      statePath: 'language'
    },
    resources: {
      type: Object,
      statePath: 'labels'
    }
  },

  _submit () {
    this.dispatch('login', this.$.username.value, this.$.password.value)
  },

  _goBack () {
    window.history.back()
  }

})
