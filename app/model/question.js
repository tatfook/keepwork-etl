'use strict';
const _ = require('lodash');

module.exports = app => {
  const { BIGINT, DATE, TEXT, INTEGER } = app.Sequelize;
  const Model = app.model.define('questions', {
    id: {
      type: BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    lessonId: { // lesson dimension
      type: BIGINT,
      allowNull: false,
    },
    index: {
      type: INTEGER,
      allowNull: false,
    },
    content: {
      type: TEXT,
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
    app.model.Question.belongsTo(app.model.Lesson);
  };

  Model.createFromEvent = async data => {
    const params = _.pick(data, [ 'lessonId', 'index', 'content' ]);
    const lesson = await app.model.Lesson.findOne({ where: { dKey: params.lessonId }, order: [[ 'id', 'DESC' ]] });
    params.lessonId = lesson.id;
    return app.model.Question.create(params);
  };

  Model.updateFromEvent = async data => {
    const params = _.pick(data, [ 'content' ]);
    const lesson = await app.model.Lesson.findOne({ where: { dKey: data.lessonId }, order: [[ 'id', 'DESC' ]] });
    const instance = await app.model.Question.findOne({ where: { lessonId: lesson.id, index: data.index }, order: [[ 'id', 'DESC' ]] });
    return instance.update(params);
  };

  Model.upsertFromEvent = async data => {
    try {
      await app.model.Question.updateFromEvent(data);
    } catch (e) {
      await app.model.Question.createFromEvent(data);
    }
    const lesson = await app.model.Lesson.findOne({ where: { dKey: data.lessonId }, order: [[ 'id', 'DESC' ]] });
    return app.model.Question.findOne({ where: { lessonId: lesson.id, index: data.index }, order: [[ 'id', 'DESC' ]] });
  };

  return Model;
};
