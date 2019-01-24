'use strict';

module.exports = app => {
  const { BIGINT, STRING, DATE } = app.Sequelize;
  const Model = app.model.define('package_lesson_snapshots', {
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
    packageId: {
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
    app.model.PackageLessonSnapshot.belongsTo(app.model.Time);
    app.model.PackageLessonSnapshot.belongsTo(app.model.Package);
    app.model.PackageLessonSnapshot.belongsTo(app.model.Lesson);
  };

  Model.upsertWithData = async data => {
    const {
      period,
      timeId,
      packageId,
      lessonId,
      newTeachingCount,
      newLearningCount,
      teachingCount,
      learningCount,
    } = data;
    const snapshot = await app.model.PackageLessonSnapshot.findOrCreate({
      where: {
        period,
        timeId,
        packageId,
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
