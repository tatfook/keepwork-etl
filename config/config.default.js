'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_{{keys}}';

  // add your config here
  config.middleware = [];

  // change to your own sequelize configurations
  config.sequelize = {
    username: 'root',
    password: null,
    database: 'kpdataware-dev',
    host: '127.0.0.1',
    port: 3306,
  };

  return config;
};
