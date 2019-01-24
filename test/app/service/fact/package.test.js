'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service//fact/package.test.js', () => {
  let ctx;
  let error;
  beforeEach(async () => {
    error = undefined;
    ctx = app.mockContext();
    await ctx.model.User.createFromEvent({ id: 123 });
    await app.model.Package.createFromEvent({
      id: 12345,
      userId: 123,
    });
  });

  describe('#commonOperate', () => {
    it('should create opration fact with valid action', async () => {
      const fact = await ctx.service.fact.package.commonOperate({
        category: 'keepwork',
        action: 'submit_package',
        data: {
          operateAt: '2018-12-24',
          userId: 123,
          packageId: 12345,
        },
      });
      assert(fact.action === 'submit_package');
    });
    it('should not create opration fact with invalid action', async () => {
      try {
        await ctx.service.fact.package.commonOperate({
          category: 'keepwork',
          action: 'submit_monster',
          data: {
            operateAt: '2018-12-24',
            userId: 123,
            packageId: 12345,
          },
        });
      } catch (e) {
        error = e;
      }
      assert.ok(error);
    });
  });
});
