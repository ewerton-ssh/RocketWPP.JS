// Run the comand in root directory: $ pm2 start server.config.js

module.exports = {
  apps : [{
    name   : "rocketwpp.js",
    script : "./index.js",
    instances: 2,
    exec_mode: "cluster",
    env: {
      NODE_ENV: "production"
    }
  }]
}