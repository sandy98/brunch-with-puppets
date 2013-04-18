template = require './templates/menu'

module.exports = class MenuView extends Backbone.Marionette.ItemView
	id: 'menu-view'
	template: template
	
	initialize: =>
	  @options.vent.on 'navigation', (where) =>
	    #console.log "Navigate to #{where.href or '/'}"
	    @$('ul.nav>li').removeClass 'active'
	    @$("a[href='##{where.href}']").parent().addClass 'active'