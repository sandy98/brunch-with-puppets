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
            FooterView = require 'views/FooterView'
            @layout = new AppLayout()
            @layout.render()
            @menuView = new MenuView(vent: @vent)
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
