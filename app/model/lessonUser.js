'use strict';
const _ = require('lodash');

module.exports = app => {
  const { BIGINT, DATE, STRING } = app.Sequelize;
  const { Op } = app.Sequelize;
  const Model = app.model.define('lesson_users', {
    id: {
      type: BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    dKey: {
      type: STRING(64),
      allowNull: false,
    },
    userId: { // user dimension
      type: BIGINT,
      allowNull: false,
    },
    role: {
      type: STRING(16),
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
    app.model.LessonUser.belongsTo(app.model.User);
  };

  Model.createFromEvent = async data => {
    const params = _.pick(data, [ 'id', 'userId', 'role' ]);
    params.dKey = params.id;
    _.omit(params, [ 'id' ]);
    const user = await app.model.User.findLast({ where: { dKey: { [Op.eq]: params.userId } } });
    params.userId = user.id;
    return app.model.LessonUser.create(params);
  };

  return Model;
};
