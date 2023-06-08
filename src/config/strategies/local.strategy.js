const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:localStrategy');
const pword = process.env.PASSWORD;

module.exports = function localStrategy(){
  passport.use(new Strategy({
    usernameField: 'username',
    passwordField: 'password'
  }, (username, password, done) => {
    const url = `mongodb+srv://fernandesdaniella:${pword}@daniellatools.kljessr.mongodb.net/?retryWrites=true&w=majority`
    const dbName = 'daniellaTools';
    (async function validateUser(){
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected to the Mongo DB');

        const db = client.db(dbName);

        const user = await db.collection('users').findOne({username});

        if(user && user.password === password){
          done(null, user);
        } else {
          done(null, false);
        }

      } catch (error) {
        done(error, false)
      }
      client.close();
    })();
  }))
}
