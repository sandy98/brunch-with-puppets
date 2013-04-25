

class DataSource
  users: new Backbone.Collection [
    new Backbone.Model {username: 'lar-gand', fullname: 'Mon-El', pwd: 'daxamite', email: 'daxam@gmail.com'}
    new Backbone.Model {username: 'kal-el', fullname: 'Superboy', pwd: 'kriptonian', email: 'kripton@gmail.com'}
    new Backbone.Model {username: 'rokk-krinn', fullname: 'Cosmic Boy', pwd: 'braalian', email: 'braal@gmail.com'}
  ]
  
  getUser: (username, pwd, cb) =>
    len = @users.length
    for index in [0..(len - 1)]
      user = @users.at(index)
      if (user.get('username').toLowerCase() is username.toLowerCase()) and (user.get('pwd') is pwd)
        if cb
          cb null, user
        return user
    if cb
      msg = 'Wrong username and/or password'
      cb msg, null
    return msg 
 
  addUser: (user, cb) => 
    @users.add user
    if cb
      cb null, user

  setUser: (cid, userData, cb) =>
    len = @users.length
    for index in [0..(len - 1)]
      user = @users.at(index)
      if user.cid is cid
        user.set userData
        if cb
          cb null, user
        return user
    if cb
      cb 'Wrong user', null
    null 
 
  
 module.exports = new DataSource