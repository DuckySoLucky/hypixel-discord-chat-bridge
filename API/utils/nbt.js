const nbt = require("prismarine-nbt");
const util = require("util");
const parseNbt = util.promisify(nbt.parse);

module.exports = {
  decodeData: async function decodeData(buffer) {
    const parsedNbt = await parseNbt(buffer);
    return nbt.simplify(parsedNbt);
  },
  decodeArrayBuffer: async function decodeArrayBuffer(arraybuf) {
    const buf = Buffer.from(arraybuf);

    let data = await parseNbt(buf);
    data = nbt.simplify(data);

    const items = data.i;
    return items;
  },
};
