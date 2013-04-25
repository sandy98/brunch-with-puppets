template = require 'views/templates/genericpopupview'

module.exports = class GenericPopupView extends Backbone.Marionette.ItemView
  template: template
  
  initialize: =>
    @on 'render', @on_render
 
  on_btnclick: (ev) =>
    console.log "Clicked on a link"
    ev.preventDefault?()
    @$('div.modal').modal('hide')        
    
  on_render: (ev) =>
    console.log 'GenericPopupView on render'
    @$('a').on 'click', @on_btnclick
    @$('div.modal').modal()
