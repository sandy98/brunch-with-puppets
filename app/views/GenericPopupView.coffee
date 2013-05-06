template = require 'views/templates/genericpopupview'

module.exports = class GenericPopupView extends Backbone.Marionette.ItemView
  template: template
  
  onBtnClick: (ev) =>
    console.log "Clicked on a link"
    ev.preventDefault?()
    @$('div.modal').modal('hide')
    
  render: =>
    Backbone.Marionette.ItemView::render.apply @, arguments
    console.log 'GenericPopupView render'
    @$('a').on 'click', @onBtnClick
    @$('div.modal').modal()
