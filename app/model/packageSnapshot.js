'use strict';

module.exports = app => {
  const { BIGINT, STRING, DATE } = app.Sequelize;
  const Model = app.model.define('package_snapshots', {
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
    subscribeCount: {
      type: BIGINT,
      defaultValue: 0,
    },
    totalIncome: {
      type: BIGINT,
      defaultValue: 0,
    },
    teachingCount: {
      type: BIGINT,
      defaultValue: 0,
    },
    learningCount: {
      type: BIGINT,
      defaultValue: 0,
    },
    newSubscribeCount: {
      type: BIGINT,
      defaultValue: 0,
    },
    newTotalIncome: {
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
    app.model.PackageSnapshot.belongsTo(app.model.Time);
    app.model.PackageSnapshot.belongsTo(app.model.Package);
  };

  Model.upsertWithData = async data => {
    const {
      period,
      timeId,
      packageId,
      newTeachingCount,
      newLearningCount,
      teachingCount,
      learningCount,
      subscribeCount,
      newSubscribeCount,
    } = data;
    const snapshot = await app.model.PackageSnapshot.findOrCreate({
      where: {
        period,
        timeId,
        packageId,
      },
    });
    return await snapshot[0].update({
      newTeachingCount,
      newLearningCount,
      teachingCount,
      learningCount,
      subscribeCount,
      newSubscribeCount,
    });
  };

  return Model;
};
