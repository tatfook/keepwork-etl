'use strict';

module.exports = app => {
  const { BIGINT, STRING, DATE } = app.Sequelize;
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
      allowNull: false,
    },
    lessonId: {
      type: BIGINT,
      allowNull: false,
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
    app.model.LessonSnapshot.belongsTo(app.model.Time);
    app.model.LessonSnapshot.belongsTo(app.model.Lesson);
  };

  Model.upsertWithData = async data => {
    const {
      period,
      timeId,
      lessonId,
      newTeachingCount,
      newLearningCount,
      teachingCount,
      learningCount,
    } = data;
    const snapshot = await app.model.LessonSnapshot.findOrCreate({
      where: {
        period,
        timeId,
        lessonId,
      },
    });
    return await snapshot[0].update({
      newTeachingCount,
      newLearningCount,
      teachingCount,
      learningCount,
    });
  };

  return Model;
};
