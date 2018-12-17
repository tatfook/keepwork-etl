'use strict';

module.exports = app => {
  const { BIGINT, STRING } = app.Sequelize;
  const Model = app.model.define('lesson_snapshots', {
    id: {
      type: BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    period: {
      type: STRING(16),
    },
    timeId: {
      type: BIGINT,
      null: false,
    },
    packageId: {
      type: BIGINT,
      null: false,
    },
    lessonId: {
      type: BIGINT,
      null: false,
    },
    teachingCount: {
      type: BIGINT,
      defaultValue: 0,
    },
    learningCount: {
      type: BIGINT,
      defaultValue: 0,
    },
    newTeachingCount: {
      type: BIGINT,
      defaultValue: 0,
    },
    newLearningCount: {
      type: BIGINT,
      defaultValue: 0,
    },
  }, {
    underscored: false,
  });

  Model.associate = () => {
    app.model.LessonSnapshot.belongsTo(app.model.Time);
    app.model.LessonSnapshot.belongsTo(app.model.Package);
    app.model.LessonSnapshot.belongsTo(app.model.Lesson);
  };

  return Model;
};
