(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.brunch = true;
})();

window.require.register("application", function(exports, require, module) {
  (function() {
    var Application, User,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    require('lib/view_helper');

    User = require('models/user');

    Application = (function(_super) {

      __extends(Application, _super);

      function Application() {
        this.initialize = __bind(this.initialize, this);
        Application.__super__.constructor.apply(this, arguments);
      }

      Application.prototype.initialize = function() {
        var UserItemView,
          _this = this;
        UserItemView = require('views/UserItemView');
        this.dataSource = require('./datasource');
        this.user = new User;
        this.vent.on('login', function(user) {
          console.log("login: " + (user.get('username')));
          _this.user = user;
          _this.menuView.model = _this.user;
          return _this.layout.menu.show(_this.menuView);
        });
        this.vent.on('logout', function() {
          console.log('logout');
          _this.user = new User;
          _this.menuView.model = _this.user;
          return _this.layout.menu.show(_this.menuView);
        });
        this.vent.on('newuser', function() {
          var popupView;
          popupView = new UserItemView({
            vent: _this.vent,
            model: new User,
            dataSource: _this.dataSource,
            mode: 'insert'
          });
          return _this.layout.popup.show(popupView);
        });
        this.vent.on('edituser', function() {
          var popupView;
          popupView = new UserItemView({
            vent: _this.vent,
            model: _this.user,
            dataSource: _this.dataSource,
            mode: 'update'
          });
          return _this.layout.popup.show(popupView);
        });
        this.on("initialize:after", function(options) {
          return Backbone.history.start();
        });
        this.addInitializer(function(options) {
          var AppLayout, FooterView, MenuView;
          AppLayout = require('views/AppLayout');
          MenuView = require('views/MenuView');
          FooterView = require('views/FooterView');
          _this.layout = new AppLayout();
          _this.layout.render();
          _this.menuView = new MenuView({
            vent: _this.vent,
            dataSource: _this.dataSource,
            model: _this.user
          });
          _this.layout.menu.show(_this.menuView);
          _this.footerView = new FooterView({
            vent: _this.vent
          });
          return _this.layout.footer.show(_this.footerView);
        });
        this.addInitializer(function(options) {
          var Router;
          Router = require('lib/router');
          return _this.router = new Router();
        });
        return this.start();
      };

      return Application;

    })(Backbone.Marionette.Application);

    module.exports = new Application();

  }).call(this);
  
});
window.require.register("datasource", function(exports, require, module) {
  (function() {
    var DataSource,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

    DataSource = (function() {

      function DataSource() {
        this.updateUser = __bind(this.updateUser, this);
        this.insertUser = __bind(this.insertUser, this);
        this.getUserByCid = __bind(this.getUserByCid, this);
        this.getUser = __bind(this.getUser, this);
      }

      DataSource.prototype.users = new Backbone.Collection([
        new Backbone.Model({
          username: 'lar-gand',
          fullname: 'Mon-El',
          pwd: 'daxamite',
          email: 'daxam@gmail.com'
        }), new Backbone.Model({
          username: 'kal-el',
          fullname: 'Superboy',
          pwd: 'kryptonian',
          email: 'krypton@gmail.com'
        }), new Backbone.Model({
          username: 'rokk-krinn',
          fullname: 'Cosmic Boy',
          pwd: 'braalian',
          email: 'braal@gmail.com'
        })
      ]);

      DataSource.prototype.getUser = function(username, pwd, cb) {
        var index, len, msg, user, _ref;
        len = this.users.length;
        for (index = 0, _ref = len - 1; 0 <= _ref ? index <= _ref : index >= _ref; 0 <= _ref ? index++ : index--) {
          user = this.users.at(index);
          if ((user.get('username').toLowerCase() === username.toLowerCase() || user.get('email').toLowerCase() === username.toLowerCase()) && user.get('pwd') === pwd) {
            if (cb) cb(null, user);
            return user;
          }
        }
        if (cb) {
          msg = 'Wrong username and/or password';
          cb(msg, null);
        }
        return msg;
      };

      DataSource.prototype.getUserByCid = function(cid, cb) {
        var index, len, msg, user, _ref;
        len = this.users.length;
        for (index = 0, _ref = len - 1; 0 <= _ref ? index <= _ref : index >= _ref; 0 <= _ref ? index++ : index--) {
          user = this.users.at(index);
          if (user.cid === cid) {
            if (cb) cb(null, user);
            return user;
          }
        }
        if (cb) {
          msg = 'Cid not found';
          cb(msg, null);
        }
        return msg;
      };

      DataSource.prototype.insertUser = function(user, cb) {
        this.users.add(user);
        if (cb) return cb(null, user);
      };

      DataSource.prototype.updateUser = function(cid, userData, cb) {
        var index, len, user, _ref;
        len = this.users.length;
        for (index = 0, _ref = len - 1; 0 <= _ref ? index <= _ref : index >= _ref; 0 <= _ref ? index++ : index--) {
          user = this.users.at(index);
          if (user.cid === cid) {
            user.set(userData);
            if (cb) cb(null, user);
            return user;
          }
        }
        if (cb) cb('Wrong user', null);
        return null;
      };

      return DataSource;

    })();

    module.exports = new DataSource;

  }).call(this);
  
});
window.require.register("initialize", function(exports, require, module) {
  (function() {
    var application;

    window.app = application = require('application');

    $(function() {
      return application.initialize();
    });

  }).call(this);
  
});
window.require.register("lib/router", function(exports, require, module) {
  (function() {
    var AboutView, ContentsView, HomeView, Router, application,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    application = require('application');

    HomeView = require('views/HomeView');

    ContentsView = require('views/ContentsView');

    AboutView = require('views/AboutView');

    module.exports = Router = (function(_super) {

      __extends(Router, _super);

      function Router() {
        this.edituser = __bind(this.edituser, this);
        this.newuser = __bind(this.newuser, this);
        this.logout = __bind(this.logout, this);
        this.about = __bind(this.about, this);
        this.contents = __bind(this.contents, this);
        this.home = __bind(this.home, this);
        Router.__super__.constructor.apply(this, arguments);
      }

      Router.prototype.routes = {
        '': 'home',
        'contents': 'contents',
        'about': 'about',
        'dologout': 'logout',
        'newuser': 'newuser',
        'edituser': 'edituser'
      };

      Router.prototype.home = function() {
        var hv;
        hv = new HomeView();
        application.vent.trigger('navigation', {
          href: ""
        });
        return application.layout.content.show(hv);
      };

      Router.prototype.contents = function() {
        var cv;
        cv = new ContentsView();
        application.vent.trigger('navigation', {
          href: "contents"
        });
        return application.layout.content.show(cv);
      };

      Router.prototype.about = function() {
        var av;
        av = new AboutView();
        application.vent.trigger('navigation', {
          href: "about"
        });
        return application.layout.content.show(av);
      };

      Router.prototype.logout = function() {
        application.vent.trigger('logout');
        return this.navigate(application.menuView.currentRoute, {
          trigger: true
        });
      };

      Router.prototype.newuser = function() {
        application.vent.trigger('newuser');
        return this.navigate(application.menuView.currentRoute, {
          trigger: true
        });
      };

      Router.prototype.edituser = function() {
        application.vent.trigger('edituser');
        return this.navigate(application.menuView.currentRoute, {
          trigger: true
        });
      };

      return Router;

    })(Backbone.Router);

  }).call(this);
  
});
window.require.register("lib/view_helper", function(exports, require, module) {
  (function() {

    Handlebars.registerHelper('pick', function(val, options) {
      return options.hash[val];
    });

  }).call(this);
  
});
window.require.register("models/collection", function(exports, require, module) {
  (function() {
    var Collection,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    module.exports = Collection = (function(_super) {

      __extends(Collection, _super);

      function Collection() {
        Collection.__super__.constructor.apply(this, arguments);
      }

      return Collection;

    })(Backbone.Collection);

  }).call(this);
  
});
window.require.register("models/model", function(exports, require, module) {
  (function() {
    var Model,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    module.exports = Model = (function(_super) {

      __extends(Model, _super);

      function Model() {
        Model.__super__.constructor.apply(this, arguments);
      }

      return Model;

    })(Backbone.Model);

  }).call(this);
  
});
window.require.register("models/user", function(exports, require, module) {
  (function() {
    var User,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    User = (function(_super) {

      __extends(User, _super);

      function User() {
        User.__super__.constructor.apply(this, arguments);
      }

      User.prototype.idAttribute = "_id";

      User.prototype.urlRoot = '/users';

      User.prototype.defaults = {
        fullname: '',
        username: '',
        birth: '',
        pwd: '',
        email: '',
        role: 'user'
      };

      User.prototype.initialize = function() {
        if (!this.birth) return this.birth = moment().format('YYYY-MM-DD');
      };

      User.prototype.validate = function() {
        if (!this.get('fullname')) {
          bootbox.alert("Can't save.\nReason: User full name can't be blank.", {
            dropback: false
          });
          return true;
        }
        if (!this.get('nick')) {
          bootbox.alert("Can't save.\nReason: username can't be blank.");
          return true;
        }
        if (!this.get('pwd')) {
          bootbox.alert("Can't save.\nReason: password can't be blank.");
          return true;
        }
        if (!this.get('birth')) {
          bootbox.alert("Can't save.\nReason: birth date can't be null.");
          return true;
        }
        if (!this.get('email') || (!this.get('email').match(/^\w+@\w+(\.\w+)*$/))) {
          bootbox.alert("Can't save.\nReason: user email is wrong.");
          return true;
        }
      };

      return User;

    })(Backbone.Model);

    module.exports = User;

  }).call(this);
  
});
window.require.register("views/AboutView", function(exports, require, module) {
  (function() {
    var AboutView, template,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    template = require('./templates/about');

    module.exports = AboutView = (function(_super) {

      __extends(AboutView, _super);

      function AboutView() {
        AboutView.__super__.constructor.apply(this, arguments);
      }

      AboutView.prototype.id = 'about-view';

      AboutView.prototype.template = template;

      return AboutView;

    })(Backbone.Marionette.ItemView);

  }).call(this);
  
});
window.require.register("views/AppLayout", function(exports, require, module) {
  (function() {
    var AppLayout, application,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    application = require('application');

    module.exports = AppLayout = (function(_super) {

      __extends(AppLayout, _super);

      function AppLayout() {
        AppLayout.__super__.constructor.apply(this, arguments);
      }

      AppLayout.prototype.template = require('views/templates/appLayout');

      AppLayout.prototype.el = "body";

      AppLayout.prototype.regions = {
        menu: "#menu",
        content: "#content",
        footer: "#footer",
        popup: "#popup"
      };

      return AppLayout;

    })(Backbone.Marionette.Layout);

  }).call(this);
  
});
window.require.register("views/ContentsView", function(exports, require, module) {
  (function() {
    var ContentsView, template,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    template = require('./templates/contents');

    module.exports = ContentsView = (function(_super) {

      __extends(ContentsView, _super);

      function ContentsView() {
        ContentsView.__super__.constructor.apply(this, arguments);
      }

      ContentsView.prototype.template = template;

      return ContentsView;

    })(Backbone.Marionette.ItemView);

  }).call(this);
  
});
window.require.register("views/FooterView", function(exports, require, module) {
  (function() {
    var FooterView, template,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    template = require('./templates/footer');

    module.exports = FooterView = (function(_super) {

      __extends(FooterView, _super);

      function FooterView() {
        FooterView.__super__.constructor.apply(this, arguments);
      }

      FooterView.prototype.template = template;

      return FooterView;

    })(Backbone.Marionette.ItemView);

  }).call(this);
  
});
window.require.register("views/GenericPopupView", function(exports, require, module) {
  (function() {
    var GenericPopupView, template,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    template = require('views/templates/genericpopupview');

    module.exports = GenericPopupView = (function(_super) {

      __extends(GenericPopupView, _super);

      function GenericPopupView() {
        this.on_render = __bind(this.on_render, this);
        this.on_btnclick = __bind(this.on_btnclick, this);
        this.initialize = __bind(this.initialize, this);
        GenericPopupView.__super__.constructor.apply(this, arguments);
      }

      GenericPopupView.prototype.template = template;

      GenericPopupView.prototype.initialize = function() {
        return this.on('render', this.on_render);
      };

      GenericPopupView.prototype.on_btnclick = function(ev) {
        console.log("Clicked on a link");
        if (typeof ev.preventDefault === "function") ev.preventDefault();
        return this.$('div.modal').modal('hide');
      };

      GenericPopupView.prototype.on_render = function(ev) {
        console.log('GenericPopupView on render');
        this.$('a').on('click', this.on_btnclick);
        return this.$('div.modal').modal();
      };

      return GenericPopupView;

    })(Backbone.Marionette.ItemView);

  }).call(this);
  
});
window.require.register("views/HomeView", function(exports, require, module) {
  (function() {
    var HomeView, template,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    template = require('./templates/home');

    module.exports = HomeView = (function(_super) {

      __extends(HomeView, _super);

      function HomeView() {
        HomeView.__super__.constructor.apply(this, arguments);
      }

      HomeView.prototype.id = 'home-view';

      HomeView.prototype.template = template;

      return HomeView;

    })(Backbone.Marionette.ItemView);

  }).call(this);
  
});
window.require.register("views/MenuView", function(exports, require, module) {
  (function() {
    var MenuView, template,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    template = require('./templates/menu');

    module.exports = MenuView = (function(_super) {

      __extends(MenuView, _super);

      function MenuView() {
        this.initialize = __bind(this.initialize, this);
        this.setFakeUser = __bind(this.setFakeUser, this);
        this.submit = __bind(this.submit, this);
        MenuView.__super__.constructor.apply(this, arguments);
      }

      MenuView.prototype.template = template;

      MenuView.prototype.events = {
        'submit': 'submit'
      };

      MenuView.prototype.submit = function(ev) {
        if (typeof ev.preventDefault === "function") ev.preventDefault();
        if (!(this.$('.username-input').val() && this.$('.pwd-input').val())) {
          return false;
        }
        this.setFakeUser({
          username: this.$('.username-input').val(),
          pwd: this.$('.pwd-input').val()
        });
        return false;
      };

      MenuView.prototype.setFakeUser = function(userdata) {
        var _this = this;
        return this.options.dataSource.getUser(userdata.username, userdata.pwd, function(err, user) {
          if (user) {
            return _this.options.vent.trigger('login', user);
          } else {
            return bootbox.alert(err);
          }
        });
      };

      MenuView.prototype.initialize = function() {
        var _this = this;
        this.on('render', function() {
          _this.$("li>a[href='#" + _this.currentRoute + "']").parent().addClass('active');
          return _this.$('a[href="#newuser"], a[href="#edituser"]').tooltip({
            placement: 'bottom'
          });
        });
        return this.options.vent.on('navigation', function(where) {
          _this.currentRoute = where.href;
          _this.$('ul.nav>li').removeClass('active');
          return _this.$("li>a[href='#" + where.href + "']").parent().addClass('active');
        });
      };

      return MenuView;

    })(Backbone.Marionette.ItemView);

  }).call(this);
  
});
window.require.register("views/UserItemView", function(exports, require, module) {
  (function() {
    var GenericPopupView, UserItemView, template,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    GenericPopupView = require('views/GenericPopupView');

    template = require('views/templates/useritemview');

    module.exports = UserItemView = (function(_super) {

      __extends(UserItemView, _super);

      function UserItemView() {
        this.on_btnclick = __bind(this.on_btnclick, this);
        this.on_render = __bind(this.on_render, this);
        UserItemView.__super__.constructor.apply(this, arguments);
      }

      UserItemView.prototype.template = template;

      UserItemView.prototype.on_render = function(ev) {
        GenericPopupView.prototype.on_render.apply(this, arguments);
        if (this.options.mode === 'insert') {
          return this.$('div.modal-header>h3').text("New User");
        } else if (this.options.mode === 'update') {
          return this.$('div.modal-header>h3').text("Edit user " + (this.model.get('fullname')));
        }
      };

      UserItemView.prototype.on_btnclick = function(ev) {
        var action,
          _this = this;
        if (typeof ev.preventDefault === "function") ev.preventDefault();
        action = '';
        if (ev.target.className.match(/btn-save/)) action = 'save';
        if (ev.target.className.match(/btn-cancel/)) action = 'cancel';
        if (action === 'save') {
          if (!(this.$('#txt-username').val() && this.$('#txt-fullname').val() && this.$('#txt-email').val() && this.$('#txt-pwd').val())) {
            return;
          }
          this.model.set({
            username: this.$('#txt-username').val(),
            fullname: this.$('#txt-fullname').val(),
            email: this.$('#txt-email').val(),
            pwd: this.$('#txt-pwd').val()
          });
          if (this.options.mode === 'insert') {
            this.options.dataSource.insertUser(this.model, function(err, newuser) {
              return _this.options.vent.trigger('login', newuser);
            });
          } else if (this.options.mode === 'update') {
            this.options.dataSource.updateUser(this.model.cid, this.model.toJSON(), function(err, user) {
              return _this.options.vent.trigger('login', user);
            });
          }
        }
        if (action) return this.$('div.modal').modal('hide');
      };

      return UserItemView;

    })(GenericPopupView);

  }).call(this);
  
});
window.require.register("views/templates/about", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "    \n\n<div class=\"row\">\n  <div class=\"span12\">\n    <div class=\"row pull-right\">\n        <div class=\"span5\"><h3>About Brunch with Puppets</h3></div>\n        <div class=\"span1\"><img class=\"img-rounded\" src=\"img/puppets.jpg\"/></div>\n    </div>\n    <div class=\"row\">\n        <div class=\"well\" style=\"padding: 20px;\">\n            <p>\n              Brunch with Puppets is a Brunch Skeleton App which provides a \"three pages\" top menu, a central region where\n              contents - like this - are displayed, and a footer.\n            </p>\n            <p>\n              It's Backbone.Marionette driven and the implementation language is Coffeescript, though you can build upon it\n               using whatever language you prefer - i.e Livescript, Roy, Javascript! - thanks to the powerful plugin system\n               that Brunch The Application Assembler offers.\n            </p>\n        </div>\n    </div>\n  </div>\n</div>\n\n    ";});
});
window.require.register("views/templates/appLayout", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "\n<div id=\"menu\" class=\"navbar navbar-inverse navbar-fixed-top\"></div>\n<div id=\"content\" class=\"container\"></div>\n<div id=\"footer\"></div>\n<div id=\"popup\"></div>";});
});
window.require.register("views/templates/contents", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "    \n\n<div class=\"row\">\n  <div class=\"span12\">\n    <div class=\"well\"><h3>Contents</h3></div>\n  </div>\n</div>\n\n    ";});
});
window.require.register("views/templates/footer", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "\n<footer class=\"navbar-fixed-bottom\" style=\"border-top: solid 1px; padding-top: 0.5em; padding-bottom: 0.5em; color: #666666; border-color: #cccccc;\">\n    <div class=\"container\">\n      <span><a target=\"_blank\"href=\"https://github.com/sandy98/brunch-with-puppets#brunch-with-puppets\">Brunch with Puppets</a> - </span>\n      <span> Yet another skeleton for <a target=\"_blank\" href=\"http://brunch.io/\">Brunch.io</a> the App Assembler</span>\n    </div>\n</footer>";});
});
window.require.register("views/templates/genericpopupview", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<div class=\"modal hide fade\">\n  <div class=\"modal-header\">\n      <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n      <h3>";
    foundHelper = helpers.title;
    stack1 = foundHelper || depth0.title;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n  </div>\n  <div class=\"modal-body\">\n      <p>";
    foundHelper = helpers.message;
    stack1 = foundHelper || depth0.message;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "message", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n  </div>\n  <div class=\"modal-footer\">\n      <a href=\"#\" class=\"btn\">Close</a>\n      <a href=\"#\" class=\"btn btn-primary\">OK</a>\n  </div>\n</div>";
    return buffer;});
});
window.require.register("views/templates/home", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "    \n\n<div class=\"row\">\n  <div class=\"span12\">\n    <div class=\"well\">\n      <h3>Home</h3>\n    </div>\n    <div class=\"row\" style=\"text-align: center;\">\n      <img class=\"img-circle\" src=\"img/puppets.jpg\"/>\n    </div>\n    <div class=\"row\">\n      <div style=\"margin-top: 0.5em; font-size: small;\">\n        <p>\n          Right now, you can login using the facade data source system, using any of the built-in users as seen below.\n        </p>\n        <p>\n          Or just simply sign up as a new user. Just keep in mind that any changes you make will be lost as soon as you leave the app\n          because they are not being recorded to a database, this is only a mockup. The real thing is left to you...\n        </p>\n        <p>\n          <ul class=\"breadcrumb\">\n            <li>\n              <span style=\"color: #880000;\">username: </span>\n              <span style=\"color: #3C84CC;\">lar-gand</span>\n              <span style=\"color: #880000;\">pwd: </span>\n              <span style=\"color: #3C84CC;\">daxamite</span>\n            </li>\n            <span class=\"divider\">&nbsp;/&nbsp;</span>\n            <li>\n              <span style=\"color: #880000;\">username: </span>\n              <span style=\"color: #3C84CC;\">kal-el</span>\n              <span style=\"color: #880000;\">pwd: </span>\n              <span style=\"color: #3C84CC;\">kriptonian</span>\n            </li>\n            <span class=\"divider\">&nbsp;/&nbsp;</span>\n            <li>\n              <span style=\"color: #880000;\">username: </span>\n              <span style=\"color: #3C84CC;\">rokk-krinn</span>\n              <span style=\"color: #880000;\">pwd: </span>\n              <span style=\"color: #3C84CC;\">braalian</span>\n            </li>\n          </ul>\n        </p>\n      </div>\n    </div>\n  </div>\n</div>\n\n    ";});
});
window.require.register("views/templates/menu", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n        <ul class=\"nav nav-pills pull-right\">\n            <li><a style=\"color: #00ccff;\" href=\"#edituser\" title=\"Edit user data\">";
    foundHelper = helpers.fullname;
    stack1 = foundHelper || depth0.fullname;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "fullname", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</a></li>\n            <li><a href=\"#dologout\">Sign out</a></li>\n        </ul>\n        ";
    return buffer;}

  function program3(depth0,data) {
    
    
    return "\n        <ul class=\"nav pull-right\">\n            <li><a href=\"#newuser\" title=\"Become a member\">Sign up</a></li>\n        </ul>\n        <form class=\"navbar-form pull-right\">\n            <input class=\"span2 username-input\" type=\"text\" placeholder=\"username or email\" required=\"required\">\n            <input class=\"span2 pwd-input\" type=\"password\" placeholder=\"password\" required=\"required\">\n            <button type=\"submit\" class=\"btn btn-small\">Sign in</button>\n        </form>\n        ";}

    buffer += "  <div class=\"navbar-inner\">\n    <div class=\"container\">\n      <a class=\"btn btn-navbar\" data-toggle=\"collapse\" data-target=\".nav-collapse\">\n          <span class=\"icon-bar\"></span>\n          <span class=\"icon-bar\"></span>\n          <span class=\"icon-bar\"></span>\n      </a>\n      <a class=\"brand\" href=\"#\">Brunch with Puppets</a>\n      <div class=\"nav-collapse collapse\">\n        <ul class=\"nav\">\n          <li><a href=\"#\">Home</a></li>\n          <li><a href=\"#contents\">Contents</a></li>\n          <li><a href=\"#about\">About</a></li>\n        </ul>\n\n        ";
    foundHelper = helpers.username;
    stack1 = foundHelper || depth0.username;
    stack2 = helpers['if'];
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(3, program3, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n        \n      </div>\n    </div>\n  </div>\n";
    return buffer;});
});
window.require.register("views/templates/useritemview", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<div class=\"modal hide fade\">\n  <div class=\"modal-header\">\n      <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n      <h3></h3>\n  </div>\n  <div class=\"modal-body\">\n    <form class=\"form-horizontal well well-shadow\">\n      <fieldset>\n        <legend>User Data</legend>\n        <div class=\"control-group\">\n          <label class=\"control-label\" for=\"txt-username\">Username</label>\n          <div class=\"controls\">\n            <input type=\"text\" placeholder=\"username\" id=\"txt-username\" value=\"";
    foundHelper = helpers.username;
    stack1 = foundHelper || depth0.username;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "username", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" />\n          </div>\n        </div>\n        <div class=\"control-group\">\n          <label class=\"control-label\" for=\"txt-fullname\">Full Name</label>\n          <div class=\"controls\">\n            <input type=\"text\" placeholder=\"full name\" id=\"txt-fullname\" value=\"";
    foundHelper = helpers.fullname;
    stack1 = foundHelper || depth0.fullname;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "fullname", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" />\n          </div>\n        </div>\n        <div class=\"control-group\">\n          <label class=\"control-label\" for=\"txt-email\">eMail</label>\n          <div class=\"controls\">\n            <input type=\"text\" placeholder=\"email\" id=\"txt-email\" value=\"";
    foundHelper = helpers.email;
    stack1 = foundHelper || depth0.email;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "email", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" />\n          </div>\n        </div>\n        <div class=\"control-group\">\n          <label class=\"control-label\" for=\"txt-pwd\">Password</label>\n          <div class=\"controls\">\n            <input type=\"password\" placeholder=\"password\" id=\"txt-pwd\" value=\"";
    foundHelper = helpers.pwd;
    stack1 = foundHelper || depth0.pwd;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "pwd", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" />\n          </div>\n        </div>\n      </fieldset>\n    </form>\n  </div>\n  <div class=\"modal-footer\">\n      <a href=\"#\" class=\"btn btn-cancel\">Cancel</a>\n      <a href=\"#\" class=\"btn btn-primary btn-save\">Save</a>\n  </div>\n</div>";
    return buffer;});
});
