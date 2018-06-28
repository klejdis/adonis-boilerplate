'use strict'

const Antl = use('Antl')

class Login {

  get rules () {
    return {
      email: 'required|email',
      password: 'required'
    }
  }

  get validateAll(){
    return true
  }

  get sanitizationRules(){
    return {
      email: 'normalize_email',
    }
  }

}

module.exports = Login
