application = require('application')
HomeView = require('views/HomeView')
ContentsView = require('views/ContentsView')
AboutView = require('views/AboutView')


module.exports = class Router extends Backbone.Router

	clear_active: =>
	  $('ul.nav>li').removeClass 'active'
	  
	routes:
	  '': 'home'
	  'contents': 'contents'
	  'about': 'about'

	home: =>
	  @clear_active()
	  hv = new HomeView()
	  $('a[href="#"]').parent().addClass 'active'
	  application.layout.content.show(hv)
		

	contents: =>
	  @clear_active()
	  cv = new ContentsView()
	  $('a[href="#contents"]').parent().addClass 'active'
	  application.layout.content.show(cv)
		

	about: =>
	  @clear_active()
	  av = new AboutView()
	  $('a[href="#about"]').parent().addClass 'active' 
	  application.layout.content.show(av)
		
