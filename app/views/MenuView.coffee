template = require './templates/menu'

module.exports = class MenuView extends Backbone.Marionette.ItemView

	template: template
	
	events:
	  'submit': 'submit'
	
	submit: (ev) =>
	  ev.preventDefault()
	  return false unless @$('.username-input').val() and @$('.pwd-input').val()
	  console.log 'submit user data'
	  @setFakeUser username: @$('.username-input').val(), pwd: @$('.pwd-input').val()
	  false
	
	setFakeUser: (userdata) =>
	   #To be overridden by a call to the server to get real data in a production app. 
	   @options.dataSource.getUser userdata.username, userdata.pwd, (err, user) =>
	      if user then @model.set user.toJSON() else bootbox.alert err
	       
	initialize: =>
	  @on 'render', =>
	    @$("li>a[href='##{@currentRoute}']").parent().addClass 'active'
	    
	  @options.vent.on 'navigation', (where) =>
	    @currentRoute = where.href
	    #console.log "Navigate to #{where.href or '/'}"
	    @$('ul.nav>li').removeClass 'active'
	    @$("li>a[href='##{where.href}']").parent().addClass 'active'
	    
	  @model.on 'change', =>
	    if @model.get 'username'
	      @options.vent.trigger 'login', @model
	    else
	      @options.vent.trigger 'logout', @model 