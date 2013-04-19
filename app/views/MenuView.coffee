template = require './templates/menu'

module.exports = class MenuView extends Backbone.Marionette.ItemView
	id: 'menu-view'
	
	template: template
	
	events:
	  'submit': 'submit'
	
	submit: (ev) =>
	  return false unless @$('.username-input').val() and @$('.pwd-input').val()
	  console.log 'submit user data'
	  @fakeSetUser username: @$('.username-input').val(), pwd: @$('pwd-input').val()
	  false
	
	fakeSetUser: (userdata) =>
	   #To be overridden by a call to the server to get real data in a production app. 
	   fakeFullNames = ['Maria Sol', 'Maria Celeste', 'Jorge Danilo']
	   userdata.fullname = fakeFullNames[Math.floor(Math.random() * fakeFullNames.length)]
	   @model.set userdata
	       
	initialize: =>
	  @on 'render', =>
	    @$("a[href='##{@currentRoute}']").parent().addClass 'active'
	    
	  @options.vent.on 'navigation', (where) =>
	    @currentRoute = where.href
	    #console.log "Navigate to #{where.href or '/'}"
	    @$('ul.nav>li').removeClass 'active'
	    @$("a[href='##{where.href}']").parent().addClass 'active'
	    
	  @model.on 'change', =>
	    if @model.get 'username'
	      @options.vent.trigger 'login', @model
	    else
	      @options.vent.trigger 'logout', @model 