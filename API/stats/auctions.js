module.exports = (auctionsData) => {
  const auctions = {
    totalAuctions: 0,
    activeAuctions: 0,
    unclaimedAuctions: 0,
    soldAuctions: 0,
    coinsToClaim: 0,
    valueIfAllSold: 0,
    active: [],
    ended: [],
  };

  for (const auction of auctionsData.auctions) {
    if (auction.end >= Date.now()) {
      auctions.totalAuctions++;
      auctions.activeAuctions++;
      auctions.valueIfAllSold += auction.bin
        ? auction.starting_bid
        : auction.highest_bid_amount;

      if (auction.item_lore.includes("\n"))
        auction.item_lore = auction.item_lore.split("\n");
      auctions.active.push(auction);
    } else {
      if (!auction.claimed) {
        auctions.totalAuctions++;
        auctions.unclaimedAuctions++;
        auctions.coinsToClaim += auction.highest_bid_amount;
        auctions.valueIfAllSold += auction.highest_bid_amount;

        if (auction.item_lore.includes("\n"))
          auction.item_lore = auction.item_lore.split("\n");
        auctions.ended.push(auction);
      }
    }
  }

  return {
    total: auctions.totalAuctions,
    activeAuctions: auctions.activeAuctions,
    unclaimed: auctions.unclaimedAuctions,
    coinsToClaim: auctions.coinsToClaim,
    valueIfAllSold: auctions.valueIfAllSold,
    active: auctions.active,
    ended: auctions.ended,
  };
};
