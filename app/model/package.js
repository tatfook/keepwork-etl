'use strict';
const _ = require('lodash');

module.exports = app => {
  const { BIGINT, SMALLINT, INTEGER, DATE, STRING } = app.Sequelize;
  const Model = app.model.define('packages', {
    id: {
      type: BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    dKey: {
      type: STRING(64),
      allowNull: false,
    },
    name: {
      type: STRING(64),
    },
    userId: {
      type: BIGINT,
      allowNull: false,
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

  Model.createFromEvent = async data => {
    const params = _.pick(data, [ 'userId', 'name', 'subjectName', 'subjectId', 'minAge', 'maxAge', 'lessonCount' ]);
    params.dKey = data.id;
    const user = await app.model.User.findOne({ where: { dKey: params.userId }, order: [[ 'id', 'DESC' ]] });
    params.userId = user.id;
    return app.model.Package.create(params);
  };

  Model.updateFromEvent = async data => {
    const params = _.pick(data, [ 'name', 'subjectName', 'subjectId', 'minAge', 'maxAge', 'lessonCount' ]);
    const instance = await app.model.Package.findOne({ where: { dKey: data.id }, order: [[ 'id', 'DESC' ]] });
    return instance.update(params);
  };

  Model.upsertFromEvent = async data => {
    if (!data.id) throw new Error('Id cannot be null');
    let instance;
    try {
      instance = await app.model.Package.updateFromEvent(data);
    } catch (e) {
      instance = await app.model.Package.createFromEvent(data);
    }
    return instance;
  };

  return Model;
};
