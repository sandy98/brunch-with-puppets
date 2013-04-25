application = require('application')
HomeView = require('views/HomeView')
ContentsView = require('views/ContentsView')
AboutView = require('views/AboutView')

module.exports = class Router extends Backbone.Router

        routes:
          '':         'home'
          'contents': 'contents'
          'about':    'about'
          'dologout': 'logout'
          'newuser':  'newuser'

        home: =>
          hv = new HomeView()
          application.vent.trigger 'navigation', href: ""
          application.layout.content.show(hv)


        contents: =>
          cv = new ContentsView()
          application.vent.trigger 'navigation', href: "contents"
          application.layout.content.show(cv)


        about: =>
          av = new AboutView()
          application.vent.trigger 'navigation', href: "about"
          application.layout.content.show(av)

        logout: =>
          application.logout()
          @navigate application.menuView.currentRoute, trigger: true

        newuser: =>
          console.log "new user coming soon..."
          application.vent.trigger 'newuser'
          @navigate application.menuView.currentRoute, trigger: true
