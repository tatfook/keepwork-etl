'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_{{keys}}';

  // add your config here
  config.middleware = [];

  config.cors = { origin: '*' };

  config.security = {
    xframe: {
      enable: false,
    },
    csrf: {
      enable: false,
    },
  };
  // change to your own sequelize configurations
  config.sequelize = {
    username: 'root',
    password: null,
    database: 'kpdataware-dev',
    host: '127.0.0.1',
    port: 3306,
  };

  config.kafkajs = {
    host: '10.28.18.4:9092',
    encoding: 'buffer', // trans binary data
    keyEncoding: 'utf8',
    env: 'development',
    sub: [
      {
        groupId: 'event-keepwork-queue',
        stream: true,
        topics: [
          'evt_kp_dimension',
        ],
      },
      {
        groupId: 'event-keepwork-common',
        topics: [
          'evt_kp_common',
        ],
      },
    ],
    pub: {},
    avroSchema: {
      namespace: 'com.tatfook.statistic',
      type: 'record',
      name: 'event',
      fields: [
        { name: 'env', type: 'string', doc: " 环境变量, 如:'development', 'testing', 'staging', 'production'" },
        { name: 'requestId', type: 'string', doc: '请求唯一标识' },
        { name: 'sysCode', type: 'string', doc: '发送方系统代码' },
        { name: 'requestType', type: 'string', doc: '请求操作类型' },
        { name: 'requestFlag', type: 'string', doc: '消息类型，0：请求，1：回复，2：ack' },
        { name: 'timestamp', type: 'string', doc: '请求操作时间' },
        { name: 'param', type: [{ type: 'map', values: 'string' }, 'null' ], doc: '系统级别扩展参数' },
        { name: 'payload', type: 'bytes', doc: '业务数据' },
      ],
    },
  };

  return config;
};
