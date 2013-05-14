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
          'edituser': 'edituser'

        home: =>
          hv = new HomeView()
          application.vent.trigger 'navigation', {href: "", view: hv}


        contents: =>
          cv = new ContentsView()
          application.vent.trigger 'navigation', {href: "contents", view: cv}


        about: =>
          av = new AboutView()
          application.vent.trigger 'navigation', {href: "about", view: av}


        logout: =>
          application.vent.trigger 'logout'
          @navigate application.menuView.currentRoute, trigger: true


        newuser: =>
          application.vent.trigger 'newuser'
          @navigate application.menuView.currentRoute, trigger: true


        edituser: =>
          application.vent.trigger 'edituser'
          @navigate application.menuView.currentRoute, trigger: true
