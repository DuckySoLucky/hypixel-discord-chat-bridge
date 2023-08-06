//CREDIT: https://github.com/Senither/hypixel-skyblock-facade (Modified)
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
  isUuid,
};
