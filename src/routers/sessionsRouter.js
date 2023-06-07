const express = require('express');
const sessionsRouter = express.Router();
const debug = require('debug')('app:sessionsRouter');
const { MongoClient, ObjectId } = require('mongodb');
const sessions = require('../data/sessions.json');
require('dotenv').config();

const password = process.env.PASSWORD;

sessionsRouter.route('/')
  .get((req, res) => {
    const url = `mongodb+srv://fernandesdaniella:${password}@daniellatools.kljessr.mongodb.net/?retryWrites=true&w=majority`
    const dbName = 'daniellaTools';

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected to the Mongo DB');

        const db = client.db(dbName);

        const sessions = await db
          .collection('sessions')
          .find()
          .toArray();
        res.render('sessions', { sessions });
      } catch (error) {
        debug(error.stack);
      }
      client.close();
    })();
  })

sessionsRouter.route('/:id')
  .get((req, res) => {
    const id = req.params.id;
    const url = `mongodb+srv://fernandesdaniella:${password}@daniellatools.kljessr.mongodb.net/?retryWrites=true&w=majority`
    const dbName = 'daniellaTools';

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected to the Mongo DB');

        const db = client.db(dbName);

        const session = await db
          .collection('sessions')
          .findOne({ _id: new ObjectId(id) });
        res.render('session', {session});
      } catch (error) {
        debug(error.stack);
      }
      client.close();
    }())
  })

  module.exports = sessionsRouter;
