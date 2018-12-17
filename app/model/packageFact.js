'use strict';

module.exports = app => {
  const { BIGINT, STRING, DATE } = app.Sequelize;
  const Model = app.model.define('package_operate_facts', {
    id: {
      type: BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    timeId: {
      type: BIGINT,
      null: false,
    },
    userId: {
      type: BIGINT,
      null: false,
    },
    packageId: {
      type: BIGINT,
      null: false,
    },
    action: {
      type: STRING(16),
      null: false,
    },
    remark: {
      type: STRING(1024),
    },
    operateAt: {
      type: DATE,
      null: false,
    },
  }, {
    underscored: false,
  });

  Model.associate = () => {
    app.model.PackageFact.belongsTo(app.model.Time);
    app.model.PackageFact.belongsTo(app.model.User);
    app.model.PackageFact.belongsTo(app.model.Package);
  };

  return Model;
};
