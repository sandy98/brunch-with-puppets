require 'lib/view_helper'

class Application extends Backbone.Marionette.Application
    initialize: =>
         
        @on("initialize:after", (options) =>
            Backbone.history.start()
            # Freeze the object
            Object.freeze? this
        )

        @addInitializer( (options) =>

            AppLayout = require 'views/AppLayout'
            MenuView = require 'views/MenuView'
            @layout = new AppLayout()
            @layout.render()
            @menuView = new MenuView(vent: @vent)
            @layout.menu.show @menuView
            
        )

        @addInitializer((options) =>
            # Instantiate the router
            Router = require 'lib/router'
            @router = new Router()
        )

        @start()



module.exports = new Application()
