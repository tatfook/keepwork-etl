'use strict';

const _ = require('lodash');
const moment = require('moment');

module.exports = app => {
  const { BIGINT, INTEGER, STRING, DATE } = app.Sequelize;
  const Model = app.model.define('classroom_facts', {
    id: {
      type: BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    beginTimeId: {
      type: BIGINT,
      allowNull: false,
    },
    endTimeId: {
      type: BIGINT,
      defaultValue: 1,
    },
    teacherId: {
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
    classroomKey: {
      type: STRING(64),
      allowNull: false,
    },
    studentCount: {
      type: INTEGER,
      defaultValue: 0,
      validate: { min: 0 },
    },
    timeAmount: {
      type: INTEGER,
      defaultValue: 0,
      validate: { min: 0 },
    },
    beginAt: {
      type: DATE,
    },
    endAt: {
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
    app.model.ClassroomFact.belongsTo(app.model.Time, {
      as: 'beginTime',
      foreignKey: 'beginTimeId',
    });
    app.model.ClassroomFact.belongsTo(app.model.Time, {
      as: 'endTime',
      foreignKey: 'endTimeId',
    });
    app.model.ClassroomFact.belongsTo(app.model.User, {
      as: 'teacher',
      foreignKey: 'teacherId',
    });
    app.model.ClassroomFact.belongsTo(app.model.Package);
    app.model.ClassroomFact.belongsTo(app.model.Lesson);
  };

  Model.beginClass = async data => {
    const params = _.pick(data, [ 'classroomKey', 'beginAt' ]);
    const user = await app.model.User.findOne({ where: { dKey: data.teacherId }, order: [[ 'id', 'DESC' ]] });
    params.teacherId = user.id;
    const packageInstance = await app.model.Package.findOne({ where: { dKey: data.packageId }, order: [[ 'id', 'DESC' ]] });
    params.packageId = packageInstance.id;
    const lessonInstance = await app.model.Lesson.findOne({ where: { dKey: data.lessonId }, order: [[ 'id', 'DESC' ]] });
    params.lessonId = lessonInstance.id;
    const timeInstance = await app.model.Time.getTimeByString(data.beginAt);
    params.beginTimeId = timeInstance.id;

    return app.model.ClassroomFact.create(params);
  };

  Model.updateStudentCount = async data => {
    const params = _.pick(data, [ 'studentCount' ]);
    const packageInstance = await app.model.Package.findOne({ where: { dKey: data.packageId }, order: [[ 'id', 'DESC' ]] });
    const lessonInstance = await app.model.Lesson.findOne({ where: { dKey: data.lessonId }, order: [[ 'id', 'DESC' ]] });

    const instance = await app.model.ClassroomFact.findOne({
      where: {
        classroomKey: data.classroomKey,
        packageId: packageInstance.id,
        lessonId: lessonInstance.id,
      },
      order: [[ 'id', 'DESC' ]],
    });

    return instance.update(params);
  };

  Model.updateStudentCountWithDiff = async data => {
    if (data.diff === 0) throw new Error('Invalid diff');
    const params = {};
    const packageInstance = await app.model.Package.findOne({ where: { dKey: data.packageId }, order: [[ 'id', 'DESC' ]] });
    const lessonInstance = await app.model.Lesson.findOne({ where: { dKey: data.lessonId }, order: [[ 'id', 'DESC' ]] });

    const instance = await app.model.ClassroomFact.findOne({
      where: {
        classroomKey: data.classroomKey,
        packageId: packageInstance.id,
        lessonId: lessonInstance.id,
      },
      order: [[ 'id', 'DESC' ]],
    });

    params.studentCount = instance.studentCount + data.diff;

    return instance.update(params);
  };

  Model.endClass = async data => {
    const params = _.pick(data, [ 'endAt', 'studentCount' ]);
    if (!params.endAt) params.endAt = _.now();
    const packageInstance = await app.model.Package.findOne({ where: { dKey: data.packageId }, order: [[ 'id', 'DESC' ]] });
    const lessonInstance = await app.model.Lesson.findOne({ where: { dKey: data.lessonId }, order: [[ 'id', 'DESC' ]] });
    const timeInstance = await app.model.Time.getTimeByString(data.endAt);
    params.endTimeId = timeInstance.id;

    const instance = await app.model.ClassroomFact.findOne({
      where: {
        classroomKey: data.classroomKey,
        packageId: packageInstance.id,
        lessonId: lessonInstance.id,
      },
      order: [[ 'id', 'DESC' ]],
    });

    params.timeAmount = Math.round(moment.duration(moment(data.endAt).diff(moment(instance.beginAt))).asMinutes());

    return instance.update(params);
  };

  return Model;
};
