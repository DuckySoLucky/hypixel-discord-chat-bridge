// @ts-nocheck
const nbt = require("prismarine-nbt");
const util = require("util");
const parseNbt = util.promisify(nbt.parse);

/**
 * Decodes a buffer containing NBT data
 * @param {Buffer} buffer
 * @returns {Promise<Object>}
 */
async function decodeData(buffer) {
  const parsedNbt = await parseNbt(buffer);
  return nbt.simplify(parsedNbt);
}

/**
 * Decodes an array buffer containing NBT data
 * @param {string} arraybuf
 * @returns {Promise<Array>}
 */
async function decodeArrayBuffer(arraybuf) {
  const buf = Buffer.from(arraybuf);

  let data = await parseNbt(buf);
  data = nbt.simplify(data);

  const items = data.i;
  return items;
}

module.exports = {
  decodeData,
  decodeArrayBuffer
};
