GenericPopupView = require 'views/GenericPopupView'
template = require 'views/templates/useritemview'


module.exports = class UserItemView extends GenericPopupView
  template: template

  onRender: (ev) =>
    console.log "Custom post-rendering of UserItemView"
    if @options.mode is 'insert'
      @$('div.modal-header>h3').text "New User"
    else if @options.mode is 'update'
      @$('div.modal-header>h3').text "Edit user #{@model.get('fullname')}"


  onBtnClick: (ev) =>
    ev.preventDefault?()
    action = ''
    if ev.target.className.match /btn-save/
      action = 'save'
    if ev.target.className.match /btn-cancel/
      action = 'cancel'

    if action is 'save'
      return unless @$('#txt-username').val() and @$('#txt-fullname').val() and @$('#txt-email').val() and @$('#txt-pwd').val()
      @model.set username: @$('#txt-username').val(), fullname: @$('#txt-fullname').val(), email: @$('#txt-email').val(), pwd: @$('#txt-pwd').val() 
      if @options.mode is 'insert'
        @options.dataSource.insertUser @model, (err, newuser) =>
          @options.vent.trigger 'login', newuser if not err
      else if @options.mode is 'update'
        @options.dataSource.updateUser @model.cid, @model.toJSON(), (err, user) =>
          @options.vent.trigger 'login', user if not err

    if action
      @$('div.modal').modal('hide')
