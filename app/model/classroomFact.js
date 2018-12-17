'use strict';

module.exports = app => {
  const { BIGINT, INTEGER, STRING } = app.Sequelize;
  const Model = app.model.define('class_teaching_facts', {
    id: {
      type: BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    beginTimeId: {
      type: BIGINT,
      null: false,
    },
    endTimeId: {
      type: BIGINT,
    },
    teacherId: {
      type: BIGINT,
      null: false,
    },
    packageId: {
      type: BIGINT,
      null: false,
    },
    lessonId: {
      type: BIGINT,
      null: false,
    },
    classroomKey: {
      type: STRING(64),
    },
    studentCount: {
      type: INTEGER,
      default: 0,
    },
    timeAmount: {
      type: INTEGER,
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

  return Model;
};
