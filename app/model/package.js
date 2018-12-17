'use strict';

module.exports = app => {
  const { BIGINT, SMALLINT, INTEGER, DATE, STRING } = app.Sequelize;
  const Model = app.model.define('package_d', {
    id: {
      type: BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    dKey: {
      type: STRING(64),
    },
    name: {
      type: STRING(64),
    },
    userId: {
      type: BIGINT,
    },
    subjectId: {
      type: BIGINT,
    },
    subjectName: {
      type: STRING(64),
    },
    minAge: {
      type: SMALLINT,
    },
    maxAge: {
      type: SMALLINT,
    },
    price: {
      type: INTEGER,
    },
    lessonCount: {
      type: INTEGER,
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
    app.model.Package.belongsTo(app.model.User);
  };

  return Model;
};
