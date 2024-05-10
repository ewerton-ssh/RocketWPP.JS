const Datastore = require('nedb');
const path = require('path');
const fs = require('fs');
const dbDirectory = path.join(__dirname, '../../database');
if (!fs.existsSync(dbDirectory)){
    fs.mkdirSync(dbDirectory);
};
const dbSettings = new Datastore({ filename: path.join(dbDirectory, 'settings.db'), autoload: true });
const dbConnectors = new Datastore({ filename: path.join(dbDirectory, 'connectors.db'), autoload: true });

module.exports =  { dbSettings, dbConnectors };