const { MongoClient } = require('mongodb');

// .env config
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'config', '.env') });

// MongoDB Config
const uri = process.env.MONGOURL;
const dbclient = new MongoClient(uri);
const database = dbclient.db(process.env.DBNAME);

module.exports =  {database}