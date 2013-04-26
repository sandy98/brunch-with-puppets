require 'lib/view_helper'

User = require 'models/user'


class Application extends Backbone.Marionette.Application

    initialize: =>

        UserItemView = require 'views/UserItemView'

        @dataSource = require './datasource'

        @user = new User

        @vent.on 'login', (user) =>
          console.log "login: #{user.get('username')}"
          @user = user
          @menuView.model = @user
          @layout.menu.show @menuView

        @vent.on 'logout',  =>
          console.log 'logout'
          @user = new User
          @menuView.model = @user
          @layout.menu.show @menuView
          
        @vent.on 'newuser', =>
          #model = new Backbone.Model({title: 'New User', message: 'User sign up data goes here.'})

          popupView = new UserItemView vent: @vent, model: new User, dataSource: @dataSource, mode: 'insert'
          @layout.popup.show popupView

        @vent.on 'edituser', =>
          popupView = new UserItemView vent: @vent, model: @user, dataSource: @dataSource, mode: 'update'
          @layout.popup.show popupView

        @on("initialize:after", (options) =>
            Backbone.history.start()
            # Freeze the object
            #Object.freeze? @
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
