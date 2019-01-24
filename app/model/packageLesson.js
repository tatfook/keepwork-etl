'use strict';
const _ = require('lodash');

module.exports = app => {
  const { BIGINT, DATE } = app.Sequelize;
  const Model = app.model.define('package_lessons', {
    id: {
      type: BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    packageId: {
      type: BIGINT,
      allowNull: false,
    },
    lessonId: {
      type: BIGINT,
      allowNull: false,
    },
    deletedAt: {
      type: DATE,
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
    app.model.PackageLesson.belongsTo(app.model.Lesson);
    app.model.PackageLesson.belongsTo(app.model.Package);
  };

  Model.createFromEvent = async data => {
    const params = _.pick(data, [ 'lessonId', 'packageId' ]);
    const lesson = await app.model.Lesson.findOne({ where: { dKey: params.lessonId }, order: [[ 'id', 'DESC' ]] });
    const pack = await app.model.Package.findOne({ where: { dKey: params.packageId }, order: [[ 'id', 'DESC' ]] });
    params.lessonId = lesson.id;
    params.packageId = pack.id;
    return app.model.PackageLesson.create(params);
  };

  Model.updateFromEvent = async data => {
    if (!data.deletedAt) throw new Error('deletedAt should not be null');
    const params = _.pick(data, [ 'deletedAt' ]);
    const lesson = await app.model.Lesson.findOne({ where: { dKey: data.lessonId }, order: [[ 'id', 'DESC' ]] });
    const pack = await app.model.Package.findOne({ where: { dKey: data.packageId }, order: [[ 'id', 'DESC' ]] });
    const instance = await app.model.PackageLesson.findOne({
      where: { lessonId: lesson.id, packageId: pack.id, deletedAt: { $eq: null } },
      order: [[ 'id', 'DESC' ]],
    });
    return instance.update(params);
  };

  return Model;
};
