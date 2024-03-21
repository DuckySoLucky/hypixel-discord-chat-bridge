module.exports = function getGifts(profile, debug = false) {
    const giftsReceived = profile?.stats?.gifts_received || 0;
    const giftsGiven = profile?.stats?.gifts_given || 0;
  
    if (debug) {
      console.log("Gifts Received:", giftsReceived);
      console.log("Gifts Given:", giftsGiven);
    }
  
    return {
      received: giftsReceived,
      given: giftsGiven
    };
};
