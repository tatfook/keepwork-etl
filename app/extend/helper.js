'use strict';

module.exports = {
  decodeEventMessage(message) {
    const data = this.ctx.helper.binaryDecode(message.value);
    data.payload = JSON.parse(data.payload.toString());
    return data;
  },
};
