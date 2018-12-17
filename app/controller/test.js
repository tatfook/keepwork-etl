'use strict';

module.exports = app => {
  return class TestController extends app.Controller {
    async index() {
      const { ctx } = this;
      ctx.body = 'test';
    }
  };
};
