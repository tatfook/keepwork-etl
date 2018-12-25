'use strict';
const _ = require('lodash');

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
      allowNull: false,
    },
    userId: {
      type: BIGINT,
      allowNull: false,
    },
    packageId: {
      type: BIGINT,
      allowNull: false,
    },
    action: {
      type: STRING(16),
      allowNull: false,
    },
    remark: {
      type: STRING(1024),
    },
    operateAt: {
      type: DATE,
      allowNull: false,
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
    app.model.PackageFact.belongsTo(app.model.Time);
    app.model.PackageFact.belongsTo(app.model.User);
    app.model.PackageFact.belongsTo(app.model.Package);
  };

  Model.createFromEvent = async data => {
    const params = _.pick(data, [ 'action', 'remark', 'operateAt' ]);
    const user = await app.model.User.findOne({ where: { dKey: data.userId }, order: [[ 'id', 'DESC' ]] });
    params.userId = user.id;
    const packageInstance = await app.model.Package.findOne({ where: { dKey: data.packageId }, order: [[ 'id', 'DESC' ]] });
    params.packageId = packageInstance.id;
    const timeInstance = await app.model.Time.getTimeByString(data.operateAt);
    params.timeId = timeInstance.id;

    return app.model.PackageFact.create(params);
  };

  return Model;
};
