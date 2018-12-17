'use strict';

module.exports = app => {
  const { BIGINT, STRING } = app.Sequelize;
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
      null: false,
    },
    packageId: {
      type: BIGINT,
      null: false,
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
  }, {
    underscored: false,
  });

  Model.associate = () => {
    app.model.PackageSnapshot.belongsTo(app.model.Time);
    app.model.PackageSnapshot.belongsTo(app.model.Package);
  };

  return Model;
};
