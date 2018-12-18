'use strict';
const _ = require('lodash');

module.exports = app => {
  const { BIGINT, SMALLINT, INTEGER, DATE, STRING } = app.Sequelize;
  const { Op } = app.Sequelize;
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
    const params = _.pick(data, [ 'id', 'userId', 'name', 'subjectName', 'subjectId', 'minAge', 'maxAge', 'lessonCount' ]);
    params.dKey = params.id;
    _.omit(params, [ 'id' ]);
    const user = await app.model.User.findLast({ where: { dKey: { [Op.eq]: params.userId } } });
    params.userId = user.id;
    return app.model.Package.create(params);
  };

  return Model;
};
