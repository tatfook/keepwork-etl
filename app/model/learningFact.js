'use strict';

const _ = require('lodash');
const moment = require('moment');

module.exports = app => {
  const { BIGINT, INTEGER, STRING, DATE } = app.Sequelize;
  const Model = app.model.define('learning_facts', {
    id: {
      type: BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    beginTimeId: {
      type: BIGINT,
      allowNull: false,
    },
    endTimeId: {
      type: BIGINT,
      defaultValue: 1,
    },
    userId: {
      type: BIGINT,
      allowNull: false,
    },
    packageId: {
      type: BIGINT,
      allowNull: false,
    },
    lessonId: {
      type: BIGINT,
      allowNull: false,
    },
    classroomKey: {
      type: STRING(64),
    },
    recordKey: {
      type: STRING(64),
      allowNull: false,
      unique: true, // learning record key
    },
    quizSize: {
      type: INTEGER,
      defaultValue: 0,
    },
    quizRight: {
      type: INTEGER,
      defaultValue: 0,
    },
    quizWrong: {
      type: INTEGER,
      defaultValue: 0,
    },
    coinReward: {
      type: INTEGER,
      defaultValue: 0,
    },
    beanReward: {
      type: INTEGER,
      defaultValue: 0,
    },
    timeAmount: {
      type: INTEGER,
      defaultValue: 0,
      validate: { min: 0 },
    },
    beginAt: {
      type: DATE,
    },
    endAt: {
      type: DATE,
    },
    createdAt: {
      type: DATE,
    },
    updatedAt: {
      type: DATE,
    },
  }, {
    underscored: false,
  });

  Model.associate = () => {
    app.model.LearningFact.belongsTo(app.model.Time, {
      as: 'beginTime',
      foreignKey: 'beginTimeId',
    });
    app.model.LearningFact.belongsTo(app.model.Time, {
      as: 'endTime',
      foreignKey: 'endTimeId',
    });
    app.model.LearningFact.belongsTo(app.model.User);
    app.model.LearningFact.belongsTo(app.model.Package);
    app.model.LearningFact.belongsTo(app.model.Lesson);
  };

  Model.beginLearning = async data => {
    const params = _.pick(data, [ 'classroomKey', 'recordKey', 'beginAt' ]);
    const user = await app.model.User.findOne({ where: { dKey: data.userId }, order: [[ 'id', 'DESC' ]] });
    params.userId = user.id;
    const packageInstance = await app.model.Package.findOne({ where: { dKey: data.packageId }, order: [[ 'id', 'DESC' ]] });
    params.packageId = packageInstance.id;
    const lessonInstance = await app.model.Lesson.findOne({ where: { dKey: data.lessonId }, order: [[ 'id', 'DESC' ]] });
    params.lessonId = lessonInstance.id;
    const timeInstance = await app.model.Time.getTimeByString(data.beginAt);
    params.beginTimeId = timeInstance.id;

    return app.model.LearningFact.create(params);
  };

  Model.endLearning = async data => {
    const params = _.pick(data, [ 'endAt', 'quizSize', 'quizRight', 'quizWrong', 'coinReward', 'beanReward' ]);
    const timeInstance = await app.model.Time.getTimeByString(data.endAt);
    const query = {
      recordKey: data.recordKey,
    };
    const instance = await app.model.LearningFact.findOne({
      where: query,
      order: [[ 'id', 'DESC' ]],
    });

    params.endTimeId = timeInstance.id;
    params.timeAmount = Math.round(moment.duration(moment(data.endAt).diff(moment(instance.beginAt))).asMinutes());

    return instance.update(params);
  };

  return Model;
};
