class User extends Backbone.Model
    idAttribute: "_id"

    urlRoot: '/users'

    defaults:
      fullname: ''
      username: ''
      birth: ''
      pwd: ''
      email: ''
      role: 'user'

    initialize: ->
      if not @birth
        @birth = moment().format('YYYY-MM-DD')


    validate: ->
      if not @get('fullname')
        bootbox.alert "Can't save.\nReason: User full name can't be blank.", dropback: false
        return true
      if not @get('nick')
        bootbox.alert "Can't save.\nReason: username can't be blank."
        return true
      if not @get('pwd')
        bootbox.alert "Can't save.\nReason: password can't be blank."
        return true
      if not @get('birth')
        bootbox.alert "Can't save.\nReason: birth date can't be null."
        return true
      if (not @get('email') or (not @get('email').match(/^\w+@\w+(\.\w+)*$/)))
        bootbox.alert "Can't save.\nReason: user email is wrong."
        return true

module.exports = User
