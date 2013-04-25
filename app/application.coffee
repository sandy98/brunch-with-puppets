require 'lib/view_helper'

User = require 'models/user'


class Application extends Backbone.Marionette.Application
    logout: =>
        @user.set username: '', fullname: '', pwd: ''
        
    initialize: =>

        GenericPopupView = require 'views/GenericPopupView'

        @dataSource = require './datasource'

        @user = new User

        @vent.on 'login', (user) =>
          console.log "login: #{user.get('username')}"
          @user = user
          @layout.menu.show @menuView

        @vent.on 'logout',(user)  =>
          console.log 'logout'
          @user = user
          @layout.menu.show @menuView
          
        @vent.on 'newuser', =>
          #bootbox.alert "Time to sign up a new user..."
          model = new Backbone.Model({title: 'New User', message: 'User sign up data goes here.'})
          popupView = new GenericPopupView model: model
          @layout.popup.show popupView
          #$(@layout.popup.el).modal()

        @on("initialize:after", (options) =>
            Backbone.history.start()
            # Freeze the object
            Object.freeze? @
        )

        @addInitializer( (options) =>

            AppLayout = require 'views/AppLayout'
            MenuView = require 'views/MenuView'
            FooterView = require 'views/FooterView'
            @layout = new AppLayout()
            @layout.render()
            @menuView = new MenuView(vent: @vent, dataSource: @dataSource, model: @user)
            @layout.menu.show @menuView
            @footerView = new FooterView(vent: @vent)
            @layout.footer.show @footerView

        )

        @addInitializer((options) =>
            # Instantiate the router
            Router = require 'lib/router'
            @router = new Router()
        )

        @start()



module.exports = new Application()
