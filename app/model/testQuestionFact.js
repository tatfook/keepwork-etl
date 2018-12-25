'use strict';

module.exports = app => {
  const { BIGINT, STRING, BOOLEAN, DATE } = app.Sequelize;
  const Model = app.model.define('test_question_facts', {
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
    lessonId: {
      type: BIGINT,
      allowNull: false,
    },
    questionId: {
      type: BIGINT,
      allowNull: false,
    },
    classroomKey: {
      type: STRING(64),
    },
    recordKey: {
      type: STRING(64),
    },
    answer: {
      type: STRING(64),
    },
    isRight: {
      type: BOOLEAN,
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
    app.model.TestQuestionFact.belongsTo(app.model.Time);
    app.model.TestQuestionFact.belongsTo(app.model.User);
    app.model.TestQuestionFact.belongsTo(app.model.Package);
    app.model.TestQuestionFact.belongsTo(app.model.Lesson);
    app.model.TestQuestionFact.belongsTo(app.model.Question);
  };

  return Model;
};
