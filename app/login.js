Polymer({
  is: 'vientos-login',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],
  actions: {
    login (email, password) {
      return {
        type: window.vientos.ActionTypes.LOGIN_REQUESTED,
        email,
        password
      }
    },
    register (email, password) {
      return {
        type: window.vientos.ActionTypes.REGISTER_REQUESTED,
        email,
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

  _login () {
    this.dispatch('login', this.$.email.value, this.$.password.value)
  },

  _register () {
    //TODO: validate pass === confirm
    this.dispatch('register', this.$.email.value, this.$.password.value)
  },

  _goBack () {
    window.history.back()
  }

})
