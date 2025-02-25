//CREDIT: https://github.com/Senither/hypixel-skyblock-facade (Modified)
/**
 * Returns whether or not the provided string is a valid UUID.
 * @param {string} uuid
 * @returns {boolean}
 */
function isUuid(uuid) {
  if (uuid === undefined || uuid === null || typeof uuid !== "string") {
    return false;
  }

  return (
    /^[0-9a-fA-F]{8}[0-9a-fA-F]{4}[0-9a-fA-F]{4}[0-9a-fA-F]{4}[0-9a-fA-F]{12}$/.test(uuid) ||
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(uuid)
  );
}

module.exports = {
  isUuid
};
