GenericPopupView = require 'views/GenericPopupView'
template = require 'views/templates/useritemview'


module.exports = class UserItemView extends GenericPopupView
  template: template

  on_render: (ev) =>
    #Very important call to super(), otherwise modal won't get called
    GenericPopupView::on_render.apply @, arguments
    if @options.mode is 'insert'
      @$('div.modal-header>h2').text "New User"
    else if @options.mode is 'update'
      @$('div.modal-header>h2').text "Edit user #{@model.get('fullname')}"


  on_btnclick: (ev) =>
    ev.preventDefault?()
    action = ''
    if ev.target.className.match /btn-save/
      action = 'save'
    if ev.target.className.match /btn-cancel/
      action = 'cancel'

    if action is 'save'
      return unless @$('#txt-username').val() and @$('#txt-fullname').val() and @$('#txt-email').val()
      @model.set username: @$('#txt-username').val(), fullname: @$('#txt-fullname').val(), email: @$('#txt-email').val(), pwd: 'pwd' 
      if @options.mode is 'insert'
        @options.dataSource.addUser @model, (err, newuser) =>
          @options.vent.trigger 'login', newuser
      else if @options.mode is 'update'
        @options.dataSource.setUser @model.cid, @model.toJSON(), (err, user) =>
          @options.vent.trigger 'login', user

    if action
      @$('div.modal').modal('hide')
