# Player Stat Variables

In multiple places we support "stat variables". These are in game stats that can be used as a variable inside some configuration options. Below is a full list of these
variables that are designed for players:

## General

`{username}` - Player's Username

`{guildRank}` - Guild Rank. **Note!** Due to api key limits this will only work if the user is inside of the minecraft bot's guild. Anyone outside will have an empty
string

`{guildName}` - The guild name. Note this is the name of the guild that the minecraft bot is inside of

`{level}` - Player's Hypixel Level

`{karma}` - Player's Hypixel Karma

`{achievementPoints}` - Player's Hypixel Achievement Points

`{guildWeeklyXp}` - Player's total amount of gexp gained this week. **Note!** Due to api key limits this will only work if the user is inside of the minecraft bot's
guild. Anyone outside will have 0

`{guildCurrentDayXp}` - Player's total amount of gexp gained this week. **Note!** Due to api key limits this will only work if the user is inside of the minecraft bot's
guild. Anyone outside will have 0

## BedWars

`{bedwarsStar}` - Player's BedWars Star

`{bedwarsTokens}` - Player's BedWars Tokens

`{bedwarsKills}` - Player's BedWars Kills

`{bedwarsDeaths}` - Player's BedWars Deaths

`{bedwarsKDRatio}` - Player's BedWars KDRatio

`{bedwarsFinalKills}` - Player's BedWars Final Kills

`{bedwarsFinalDeathss}` - Player's BedWars Final Deathss

`{bedwarsFinalKDRatio}` - Player's BedWars Final KDRatio

`{bedwarsWins}` - Player's BedWars Wins

`{bedwarsLosses}` - Player's BedWars Losses

`{bedwarsWLRatio}` - Player's BedWars WLRatio

`{bedwarsBedsBroken}` - Player's BedWars Beds Broken

`{bedwarsBedsLost}` - Player's BedWars Beds Lost

`{bedwarsBedsBLRatio}` - Player's BedWars Beds BLRatio

`{bedwarsPlayedGames}` - Player's BedWars Played Games

`{bedwarsSoloKills}` - Bedwars Solo Kills

`{bedwarsSoloDeaths}` - Bedwars Solo Deaths

`{bedwarsSoloKDRatio}` - Bedwars Solo Kdratio

`{bedwarsSoloFinalKills}` - Bedwars Solo Final Kills

`{bedwarsSoloFinalDeathss}` - Bedwars Solo Final Deathss

`{bedwarsSoloFinalKDRatio}` - Bedwars Solo Final Kdratio

`{bedwarsSoloWins}` - Bedwars Solo Wins

`{bedwarsSoloLosses}` - Bedwars Solo Losses

`{bedwarsSoloWLRatio}` - Bedwars Solo Wlratio

`{bedwarsSoloBedsBroken}` - Bedwars Solo Beds Broken

`{bedwarsSoloBedsLost}` - Bedwars Solo Beds Lost

`{bedwarsSoloBedsBLRatio}` - Bedwars Solo Beds Blratio

`{bedwarsSoloPlayedGames}` - Bedwars Solo Played Games

`{bedwarsDoublesKills}` - Bedwars Doubles Kills

`{bedwarsDoublesDeaths}` - Bedwars Doubles Deaths

`{bedwarsDoublesKDRatio}` - Bedwars Doubles Kdratio

`{bedwarsDoublesFinalKills}` - Bedwars Doubles Final Kills

`{bedwarsDoublesFinalDeathss}` - Bedwars Doubles Final Deathss

`{bedwarsDoublesFinalKDRatio}` - Bedwars Doubles Final Kdratio

`{bedwarsDoublesWins}` - Bedwars Doubles Wins

`{bedwarsDoublesLosses}` - Bedwars Doubles Losses

`{bedwarsDoublesWLRatio}` - Bedwars Doubles Wlratio

`{bedwarsDoublesBedsBroken}` - Bedwars Doubles Beds Broken

`{bedwarsDoublesBedsLost}` - Bedwars Doubles Beds Lost

`{bedwarsDoublesBedsBLRatio}` - Bedwars Doubles Beds Blratio

`{bedwarsDoublesPlayedGames}` - Bedwars Doubles Played Games

`{bedwarsThreesKills}` - Bedwars Threes Kills

`{bedwarsThreesDeaths}` - Bedwars Threes Deaths

`{bedwarsThreesKDRatio}` - Bedwars Threes Kdratio

`{bedwarsThreesFinalKills}` - Bedwars Threes Final Kills

`{bedwarsThreesFinalDeathss}` - Bedwars Threes Final Deathss

`{bedwarsThreesFinalKDRatio}` - Bedwars Threes Final Kdratio

`{bedwarsThreesWins}` - Bedwars Threes Wins

`{bedwarsThreesLosses}` - Bedwars Threes Losses

`{bedwarsThreesWLRatio}` - Bedwars Threes Wlratio

`{bedwarsThreesBedsBroken}` - Bedwars Threes Beds Broken

`{bedwarsThreesBedsLost}` - Bedwars Threes Beds Lost

`{bedwarsThreesBedsBLRatio}` - Bedwars Threes Beds Blratio

`{bedwarsThreesPlayedGames}` - Bedwars Threes Played Games

`{bedwarsFoursKills}` - Bedwars Fours Kills

`{bedwarsFoursDeaths}` - Bedwars Fours Deaths

`{bedwarsFoursKDRatio}` - Bedwars Fours Kdratio

`{bedwarsFoursFinalKills}` - Bedwars Fours Final Kills

`{bedwarsFoursFinalDeathss}` - Bedwars Fours Final Deathss

`{bedwarsFoursFinalKDRatio}` - Bedwars Fours Final Kdratio

`{bedwarsFoursWins}` - Bedwars Fours Wins

`{bedwarsFoursLosses}` - Bedwars Fours Losses

`{bedwarsFoursWLRatio}` - Bedwars Fours Wlratio

`{bedwarsFoursBedsBroken}` - Bedwars Fours Beds Broken

`{bedwarsFoursBedsLost}` - Bedwars Fours Beds Lost

`{bedwarsFoursBedsBLRatio}` - Bedwars Fours Beds Blratio

`{bedwarsFoursPlayedGames}` - Bedwars Fours Played Games

`{bedwars4v4Kills}` - Bedwars 4v4 kills

`{bedwars4v4Deaths}` - Bedwars 4v4 deaths

`{bedwars4v4KDRatio}` - Bedwars 4v4 kdratio

`{bedwars4v4FinalKills}` - Bedwars 4v4 final Kills

`{bedwars4v4FinalDeathss}` - Bedwars 4v4 final Deathss

`{bedwars4v4FinalKDRatio}` - Bedwars 4v4 final Kdratio

`{bedwars4v4Wins}` - Bedwars 4v4 wins

`{bedwars4v4Losses}` - Bedwars 4v4 losses

`{bedwars4v4WLRatio}` - Bedwars 4v4 wlratio

`{bedwars4v4BedsBroken}` - Bedwars 4v 4beds Broken

`{bedwars4v4BedsLost}` - Bedwars 4v4 beds Lost

`{bedwars4v4BedsBLRatio}` - Bedwars 4v4 beds Blratio

`{bedwars4v4PlayedGames}` - Bedwars 4v4 Played Games

## SkyWars

`{skywarsStar}` - Player's SkyWars Star

`{skywarsCoins}` - Player's SkyWars Coins

`{skywarsTokens}` - Player's SkyWars Tokens

`{skywarsSouls}` - Player's SkyWars Souls

`{skywarsOpals}` - Player's SkyWars Opals

`{skywarsKills}` - Player's SkyWars Kills

`{skywarsDeaths}` - Player's SkyWars Deaths

`{skywarsKDRatio}` - Player's SkyWars KDRatio

`{skywarsWins}` - Player's SkyWars Wins

`{skywarsLosses}` - Player's SkyWars Losses

`{skywarsWLRatio}` - Player's SkyWars WLRatio

`{skywarsPlayedGames}` - Player's SkyWars Played Games

## Duels

`{duelsDivision}` - Player's Duels Title

`{duelsKills}` - Player's Duels Kills

`{duelsDeaths}` - Player's Duels Deaths

`{duelsKDRatio}` - Player's Duels KDRatio

`{duelsWins}` - Player's Duels Wins

`{duelsLosses}` - Player's Duels Losses

`{duelsWLRatio}` - Player's Duels WLRatio

`{duelsPlayedGames}` - Player's Duels Played Games

## SkyBlock

`{skyblockBank}` - Player's SkyBlock Bank

`{skyblockPurse}` - Player's SkyBlock Purse

`{skyblockLevel}` - Player's SkyBlock Level

`{skyblockSkillsAverageLevel}` - Player's SkyBlock Average Level

`{skyblockSkillsNonCosmeticAverageLevel}` - Player's SkyBlock Average Level

`{skyblockSkillsAlchemyXp}` - Player's SkyBlock Alchemy Xp

`{skyblockSkillsAlchemyLevel}` - Player's SkyBlock Alchemy Level

`{skyblockSkillsAlchemyLevelWithProgress}` - Player's SkyBlock Alchemy Level With Progress

`{skyblockSkillsAlchemyLevelOverflow}` - Player's SkyBlock Alchemy Overflow Level

`{skyblockSkillsAlchemyLevelOverflowWithProgress}` - Player's SkyBlock Alchemy Overflow Level With Progress

`{skyblockSkillsCarpentryXp}` - Player's SkyBlock Carpentry Xp

`{skyblockSkillsCarpentryLevel}` - Player's SkyBlock Carpentry Level

`{skyblockSkillsCarpentryLevelWithProgress}` - Player's SkyBlock Carpentry Level With Progress

`{skyblockSkillsCarpentryLevelOverflow}` - Player's SkyBlock Carpentry Overflow Level

`{skyblockSkillsCarpentryLevelOverflowWithProgress}` - Player's SkyBlock Carpentry Overflow Level With Progress

`{skyblockSkillsCombatXp}` - Player's SkyBlock Combat Xp

`{skyblockSkillsCombatLevel}` - Player's SkyBlock Combat Level

`{skyblockSkillsCombatLevelWithProgress}` - Player's SkyBlock Combat Level With Progress

`{skyblockSkillsCombatLevelOverflow}` - Player's SkyBlock Combat Overflow Level

`{skyblockSkillsCombatLevelOverflowWithProgress}` - Player's SkyBlock Combat Overflow Level With Progress

`{skyblockSkillsEnchantingXp}` - Player's SkyBlock Enchanting Xp

`{skyblockSkillsEnchantingLevel}` - Player's SkyBlock Enchanting Level

`{skyblockSkillsEnchantingLevelWithProgress}` - Player's SkyBlock Enchanting Level With Progress

`{skyblockSkillsEnchantingLevelOverflow}` - Player's SkyBlock Enchanting Overflow Level

`{skyblockSkillsEnchantingLevelOverflowWithProgress}` - Player's SkyBlock Enchanting Overflow Level With Progress

`{skyblockSkillsFarmingXp}` - Player's SkyBlock Farming Xp

`{skyblockSkillsFarmingLevel}` - Player's SkyBlock Farming Level

`{skyblockSkillsFarmingLevelWithProgress}` - Player's SkyBlock Farming Level With Progress

`{skyblockSkillsFarmingLevelOverflow}` - Player's SkyBlock Farming Overflow Level

`{skyblockSkillsFarmingLevelOverflowWithProgress}` - Player's SkyBlock Farming Overflow Level With Progress

`{skyblockSkillsFishingXp}` - Player's SkyBlock Fishing Xp

`{skyblockSkillsFishingLevel}` - Player's SkyBlock Fishing Level

`{skyblockSkillsFishingLevelWithProgress}` - Player's SkyBlock Fishing Level With Progress

`{skyblockSkillsFishingLevelOverflow}` - Player's SkyBlock Fishing Overflow Level

`{skyblockSkillsFishingLevelOverflowWithProgress}` - Player's SkyBlock Fishing Overflow Level With Progress

`{skyblockSkillsForagingXp}` - Player's SkyBlock Foraging Xp

`{skyblockSkillsForagingLevel}` - Player's SkyBlock Foraging Level

`{skyblockSkillsForagingLevelWithProgress}` - Player's SkyBlock Foraging Level With Progress

`{skyblockSkillsForagingLevelOverflow}` - Player's SkyBlock Foraging Overflow Level

`{skyblockSkillsForagingLevelOverflowWithProgress}` - Player's SkyBlock Foraging Overflow Level With Progress

`{skyblockSkillsHuntingXp}` - Player's SkyBlock Hunting Xp

`{skyblockSkillsHuntingLevel}` - Player's SkyBlock Hunting Level

`{skyblockSkillsHuntingLevelWithProgress}` - Player's SkyBlock Hunting Level With Progress

`{skyblockSkillsHuntingLevelOverflow}` - Player's SkyBlock Hunting Overflow Level

`{skyblockSkillsHuntingLevelOverflowWithProgress}` - Player's SkyBlock Hunting Overflow Level With Progress

`{skyblockSkillsMiningXp}` - Player's SkyBlock Mining Xp

`{skyblockSkillsMiningLevel}` - Player's SkyBlock Mining Level

`{skyblockSkillsMiningLevelWithProgress}` - Player's SkyBlock Mining Level With Progress

`{skyblockSkillsMiningLevelOverflow}` - Player's SkyBlock Mining Overflow Level

`{skyblockSkillsMiningLevelOverflowWithProgress}` - Player's SkyBlock Mining Overflow Level With Progress

`{skyblockSkillsRunecraftingXp}` - Player's SkyBlock Runecrafting Xp

`{skyblockSkillsRunecraftingLevel}` - Player's SkyBlock Runecrafting Level

`{skyblockSkillsRunecraftingLevelWithProgress}` - Player's SkyBlock Runecrafting Level With Progress

`{skyblockSkillsRunecraftingLevelOverflow}` - Player's SkyBlock Runecrafting Overflow Level

`{skyblockSkillsRunecraftingLevelOverflowWithProgress}` - Player's SkyBlock Runecrafting Overflow Level With Progress

`{skyblockSkillsSocialXp}` - Player's SkyBlock Social Xp

`{skyblockSkillsSocialLevel}` - Player's SkyBlock Social Level

`{skyblockSkillsSocialLevelWithProgress}` - Player's SkyBlock Social Level With Progress

`{skyblockSkillsSocialLevelOverflow}` - Player's SkyBlock Social Overflow Level

`{skyblockSkillsSocialLevelOverflowWithProgress}` - Player's SkyBlock Social Overflow Level With Progress

`{skyblockSkillsTamingXp}` - Player's SkyBlock Taming Xp

`{skyblockSkillsTamingLevel}` - Player's SkyBlock Taming Level

`{skyblockSkillsTamingLevelWithProgress}` - Player's SkyBlock Taming Level With Progress

`{skyblockSkillsTamingLevelOverflow}` - Player's SkyBlock Taming Overflow Level

`{skyblockSkillsTamingLevelOverflowWithProgress}` - Player's SkyBlock Taming Overflow Level With Progress

`{skyblockSlayerBlazeXp}` - Player's SkyBlock Blaze Slayer Xp

`{skyblockSlayerBlazeLevel}` - Player's SkyBlock Blaze Slayer Level

`{skyblockSlayerBlazeLevelWithProgress}` - Player's SkyBlock Blaze Slayer Level With Progress

`{skyblockSlayerBlazeTier1Kills}` - Player's SkyBlock Blaze Slayer Tier 1 Kills

`{skyblockSlayerBlazeTier2Kills}` - Player's SkyBlock Blaze Slayer Tier 2 Kills

`{skyblockSlayerBlazeTier3Kills}` - Player's SkyBlock Blaze Slayer Tier 3 Kills

`{skyblockSlayerBlazeTier4Kills}` - Player's SkyBlock Blaze Slayer Tier 4 Kills

`{skyblockSlayerBlazeTier5Kills}` - Player's SkyBlock Blaze Slayer Tier 5 Kills

`{skyblockSlayerEndermanXp}` - Player's SkyBlock Enderman Slayer Xp

`{skyblockSlayerEndermanLevel}` - Player's SkyBlock Enderman Slayer Level

`{skyblockSlayerEndermanLevelWithProgress}` - Player's SkyBlock Enderman Slayer Level With Progress

`{skyblockSlayerEndermanTier1Kills}` - Player's SkyBlock Enderman Slayer Tier 1 Kills

`{skyblockSlayerEndermanTier2Kills}` - Player's SkyBlock Enderman Slayer Tier 2 Kills

`{skyblockSlayerEndermanTier3Kills}` - Player's SkyBlock Enderman Slayer Tier 3 Kills

`{skyblockSlayerEndermanTier4Kills}` - Player's SkyBlock Enderman Slayer Tier 4 Kills

`{skyblockSlayerEndermanTier5Kills}` - Player's SkyBlock Enderman Slayer Tier 5 Kills

`{skyblockSlayerSpiderXp}` - Player's SkyBlock Spider Slayer Xp

`{skyblockSlayerSpiderLevel}` - Player's SkyBlock Spider Slayer Level

`{skyblockSlayerSpiderLevelWithProgress}` - Player's SkyBlock Spider Slayer Level With Progress

`{skyblockSlayerSpiderTier1Kills}` - Player's SkyBlock Spider Slayer Tier 1 Kills

`{skyblockSlayerSpiderTier2Kills}` - Player's SkyBlock Spider Slayer Tier 2 Kills

`{skyblockSlayerSpiderTier3Kills}` - Player's SkyBlock Spider Slayer Tier 3 Kills

`{skyblockSlayerSpiderTier4Kills}` - Player's SkyBlock Spider Slayer Tier 4 Kills

`{skyblockSlayerSpiderTier5Kills}` - Player's SkyBlock Spider Slayer Tier 5 Kills

`{skyblockSlayerVampireXp}` - Player's SkyBlock Vampire Slayer Xp

`{skyblockSlayerVampireLevel}` - Player's SkyBlock Vampire Slayer Level

`{skyblockSlayerVampireLevelWithProgress}` - Player's SkyBlock Vampire Slayer Level With Progress

`{skyblockSlayerVampireTier1Kills}` - Player's SkyBlock Vampire Slayer Tier 1 Kills

`{skyblockSlayerVampireTier2Kills}` - Player's SkyBlock Vampire Slayer Tier 2 Kills

`{skyblockSlayerVampireTier3Kills}` - Player's SkyBlock Vampire Slayer Tier 3 Kills

`{skyblockSlayerVampireTier4Kills}` - Player's SkyBlock Vampire Slayer Tier 4 Kills

`{skyblockSlayerVampireTier5Kills}` - Player's SkyBlock Vampire Slayer Tier 5 Kills

`{skyblockSlayerWolfXp}` - Player's SkyBlock Wolf Slayer Xp

`{skyblockSlayerWolfLevel}` - Player's SkyBlock Wolf Slayer Level

`{skyblockSlayerWolfLevelWithProgress}` - Player's SkyBlock Wolf Slayer Level With Progress

`{skyblockSlayerWolfTier1Kills}` - Player's SkyBlock Wolf Slayer Tier 1 Kills

`{skyblockSlayerWolfTier2Kills}` - Player's SkyBlock Wolf Slayer Tier 2 Kills

`{skyblockSlayerWolfTier3Kills}` - Player's SkyBlock Wolf Slayer Tier 3 Kills

`{skyblockSlayerWolfTier4Kills}` - Player's SkyBlock Wolf Slayer Tier 4 Kills

`{skyblockSlayerWolfTier5Kills}` - Player's SkyBlock Wolf Slayer Tier 5 Kills

`{skyblockSlayerZombieXp}` - Player's SkyBlock Zombie Slayer Xp

`{skyblockSlayerZombieLevel}` - Player's SkyBlock Zombie Slayer Level

`{skyblockSlayerZombieLevelWithProgress}` - Player's SkyBlock Zombie Slayer Level With Progress

`{skyblockSlayerZombieTier1Kills}` - Player's SkyBlock Zombie Slayer Tier 1 Kills

`{skyblockSlayerZombieTier2Kills}` - Player's SkyBlock Zombie Slayer Tier 2 Kills

`{skyblockSlayerZombieTier3Kills}` - Player's SkyBlock Zombie Slayer Tier 3 Kills

`{skyblockSlayerZombieTier4Kills}` - Player's SkyBlock Zombie Slayer Tier 4 Kills

`{skyblockSlayerZombieTier5Kills}` - Player's SkyBlock Zombie Slayer Tier 5 Kills

`{skyblockDungeonsSecrets}` - Player's SkyBlock Dungeons Secrets

`{skyblockDungeonsXp}` - Player's SkyBlock Dungeons Xp

`{skyblockDungeonsLevel}` - Player's SkyBlock Dungeons Level

`{skyblockDungeonsLevelWithProgress}` - Player's SkyBlock Dungeons Level With Progress

`{skyblockDungeonsClassAverageLevel}` - Player's SkyBlock Dungeons Class Average Level

`{skyblockDungeonsClassArcherXp}` - Player's SkyBlock Dungeons Archer Class Xp

`{skyblockDungeonsClassArcherLevel}` - Player's SkyBlock Dungeons Archer Class Level

`{skyblockDungeonsClassArcherLevelWithProgress}` - Player's SkyBlock Dungeons Archer Class Level With Progress

`{skyblockDungeonsClassArcherLevelOverflow}` - Player's SkyBlock Dungeons Archer Class Overflow Level

`{skyblockDungeonsClassArcherLevelOverflowWithProgress}` - Player's SkyBlock Dungeons Archer Class Overflow Level With Progress

`{skyblockDungeonsClassBerserkXp}` - Player's SkyBlock Dungeons Berserk Class Xp

`{skyblockDungeonsClassBerserkLevel}` - Player's SkyBlock Dungeons Berserk Class Level

`{skyblockDungeonsClassBerserkLevelWithProgress}` - Player's SkyBlock Dungeons Berserk Class Level With Progress

`{skyblockDungeonsClassBerserkLevelOverflow}` - Player's SkyBlock Dungeons Berserk Class Overflow Level

`{skyblockDungeonsClassBerserkLevelOverflowWithProgress}` - Player's SkyBlock Dungeons Berserk Class Overflow Level With Progress

`{skyblockDungeonsClassHealerXp}` - Player's SkyBlock Dungeons Healer Class Xp

`{skyblockDungeonsClassHealerLevel}` - Player's SkyBlock Dungeons Healer Class Level

`{skyblockDungeonsClassHealerLevelWithProgress}` - Player's SkyBlock Dungeons Healer Class Level With Progress

`{skyblockDungeonsClassHealerLevelOverflow}` - Player's SkyBlock Dungeons Healer Class Overflow Level

`{skyblockDungeonsClassHealerLevelOverflowWithProgress}` - Player's SkyBlock Dungeons Healer Class Overflow Level With Progress

`{skyblockDungeonsClassMageXp}` - Player's SkyBlock Dungeons Mage Class Xp

`{skyblockDungeonsClassMageLevel}` - Player's SkyBlock Dungeons Mage Class Level

`{skyblockDungeonsClassMageLevelWithProgress}` - Player's SkyBlock Dungeons Mage Class Level With Progress

`{skyblockDungeonsClassMageLevelOverflow}` - Player's SkyBlock Dungeons Mage Class Overflow Level

`{skyblockDungeonsClassMageLevelOverflowWithProgress}` - Player's SkyBlock Dungeons Mage Class Overflow Level With Progress

`{skyblockDungeonsClassTankXp}` - Player's SkyBlock Dungeons Tank Class Xp

`{skyblockDungeonsClassTankLevel}` - Player's SkyBlock Dungeons Tank Class Level

`{skyblockDungeonsClassTankLevelWithProgress}` - Player's SkyBlock Dungeons Tank Class Level With Progress

`{skyblockDungeonsClassTankLevelOverflow}` - Player's SkyBlock Dungeons Tank Class Overflow Level

`{skyblockDungeonsClassTankLevelOverflowWithProgress}` - Player's SkyBlock Dungeons Tank Class Overflow Level With Progress

`{skyblockDungeonsEssenceDiamond}` - Player's SkyBlock Dungeons Essence Diamond

`{skyblockDungeonsEssenceDragon}` - Player's SkyBlock Dungeons Essence Dragon

`{skyblockDungeonsEssenceSpider}` - Player's SkyBlock Dungeons Essence Spider

`{skyblockDungeonsEssenceWither}` - Player's SkyBlock Dungeons Essence Wither

`{skyblockDungeonsEssenceUndead}` - Player's SkyBlock Dungeons Essence Undead

`{skyblockDungeonsEssenceGold}` - Player's SkyBlock Dungeons Essence Gold

`{skyblockDungeonsEssenceIce}` - Player's SkyBlock Dungeons Essence Ice

`{skyblockDungeonsEssenceCrimson}` - Player's SkyBlock Dungeons Essence Crimson

`{skyblockCrimsonIsleReputationBarbarian}` - Player's SkyBlock Crimson Isle Barbarian Reputation

`{skyblockCrimsonIsleReputationMage}` - Player's SkyBlock Crimson Isle Mage Reputation

`{skyblockCrimsonIsleKuudraBasic}` - Player's SkyBlock Crimson Isle Kuudra Basic Complications

`{skyblockCrimsonIsleKuudraHot}` - Player's SkyBlock Crimson Isle Kuudra Hot Complications

`{skyblockCrimsonIsleKuudraBurning}` - Player's SkyBlock Crimson Isle Kuudra Burning Complications

`{skyblockCrimsonIsleKuudraFiery}` - Player's SkyBlock Crimson Isle Kuudra Fiery Complications

`{skyblockCrimsonIsleKuudraInfernal}` - Player's SkyBlock Crimson Isle Kuudra Infernal Complications

`{skyblockNetworth}` - Player's SkyBlock Networth

`{skyblockNetwrothArmor}` - Player's SkyBlock Netwroth in Armor

`{skyblockNetwrothEquipment}` - Player's SkyBlock Netwroth in Equipment

`{skyblockNetwrothWardrobe}` - Player's SkyBlock Netwroth in Wardrobe

`{skyblockNetwrothInventory}` - Player's SkyBlock Netwroth in Inventory

`{skyblockNetwrothEnderchest}` - Player's SkyBlock Netwroth in Enderchest

`{skyblockNetwrothAccessories}` - Player's SkyBlock Netwroth in Accessories

`{skyblockNetwrothPersonalVault}` - Player's SkyBlock Netwroth in PersonalVault

`{skyblockNetwrothFishingBag}` - Player's SkyBlock Netwroth in FishingBag

`{skyblockNetwrothStorage}` - Player's SkyBlock Netwroth in Storage

`{skyblockNetwrothMuseum}` - Player's SkyBlock Netwroth in Museum

`{skyblockNetwrothSacks}` - Player's SkyBlock Netwroth in Sacks

`{skyblockNetwrothEssence}` - Player's SkyBlock Netwroth in Essence

`{skyblockNetwrothPets}` - Player's SkyBlock Netwroth in Pets

`{skyblockNetworthUnsoulbound}` - Player's SkyBlock Networth Unsoulbound

`{skyblockNetwrothArmorUnsoulbound}` - Player's SkyBlock Netwroth in Armor Unsoulbound

`{skyblockNetwrothEquipmentUnsoulbound}` - Player's SkyBlock Netwroth in Equipment Unsoulbound

`{skyblockNetwrothWardrobeUnsoulbound}` - Player's SkyBlock Netwroth in Wardrobe Unsoulbound

`{skyblockNetwrothInventoryUnsoulbound}` - Player's SkyBlock Netwroth in Inventory Unsoulbound

`{skyblockNetwrothEnderchestUnsoulbound}` - Player's SkyBlock Netwroth in Enderchest Unsoulbound

`{skyblockNetwrothAccessoriesUnsoulbound}` - Player's SkyBlock Netwroth in Accessories Unsoulbound

`{skyblockNetwrothPersonalVaultUnsoulbound}` - Player's SkyBlock Netwroth in PersonalVault Unsoulbound

`{skyblockNetwrothFishingBagUnsoulbound}` - Player's SkyBlock Netwroth in FishingBag Unsoulbound

`{skyblockNetwrothStorageUnsoulbound}` - Player's SkyBlock Netwroth in Storage Unsoulbound

`{skyblockNetwrothMuseumUnsoulbound}` - Player's SkyBlock Netwroth in Museum Unsoulbound

`{skyblockNetwrothSacksUnsoulbound}` - Player's SkyBlock Netwroth in Sacks Unsoulbound

`{skyblockNetwrothEssenceUnsoulbound}` - Player's SkyBlock Netwroth in Essence Unsoulbound

`{skyblockNetwrothPetsUnsoulbound}` - Player's SkyBlock Netwroth in Pets Unsoulbound

`{skyblockChocolateFactoryLevel}` - Player's Skyblock Chocolate Factory Level

`{skyblockChocolateFactoryChocolateCurrent}` - Player's Skyblock Chocolate Factory Chocolate Current

`{skyblockChocolateFactoryChocolateSincePrestige}` - Player's Skyblock Chocolate Factory Chocolate Since Prestige

`{skyblockChocolateFactoryChocolateTotal}` - Player's Skyblock Chocolate Factory Chocolate Total

`{skyblockChocolateFactoryEmployeeBro}` - Player's SkyBlock Chocolate Factory Employee Bro Level

`{skyblockChocolateFactoryEmployeeCousin}` - Player's SkyBlock Chocolate Factory Employee Cousin Level

`{skyblockChocolateFactoryEmployeeSis}` - Player's SkyBlock Chocolate Factory Employee Sis Level

`{skyblockChocolateFactoryEmployeeFather}` - Player's SkyBlock Chocolate Factory Employee Father Level

`{skyblockChocolateFactoryEmployeeGrandma}` - Player's SkyBlock Chocolate Factory Employee Grandma Level

`{skyblockChocolateFactoryEmployeeUncle}` - Player's SkyBlock Chocolate Factory Employee Uncle Level

`{skyblockChocolateFactoryEmployeeDog}` - Player's SkyBlock Chocolate Factory Employee Dog Level

`{skyblockJacobMedalsGold}` - Player's SkyBlock Jacob Gold Medals

`{skyblockJacobMedalsSilver}` - Player's SkyBlock Jacob Silver Medals

`{skyblockJacobMedalsBronze}` - Player's SkyBlock Jacob Bronze Medals

`{skyblockJacobPerksLevelCap}` - Player's SkyBlock Jacob Perks Level Cap Level

`{skyblockJacobPerksDoubleDrops}` - Player's SkyBlock Jacob Perks Double Drops Level

`{skyblockJacobPersonalBestNetherWart}` - Player's SkyBlock Jacob Person Best Nether Wart In Contest

`{skyblockJacobPersonalBestCocoBeans}` - Player's SkyBlock Jacob Person Best Coco Beans In Contest

`{skyblockJacobPersonalBestMushroom}` - Player's SkyBlock Jacob Person Best Mushroom In Contest

`{skyblockJacobPersonalBestWheat}` - Player's SkyBlock Jacob Person Best Wheat In Contest

`{skyblockJacobPersonalBestPotato}` - Player's SkyBlock Jacob Person Best Potato In Contest

`{skyblockJacobPersonalBestPumpkin}` - Player's SkyBlock Jacob Person Best Pumpkin In Contest

`{skyblockJacobPersonalBestCarrot}` - Player's SkyBlock Jacob Person Best Carrot In Contest

`{skyblockJacobPersonalBestCactus}` - Player's SkyBlock Jacob Person Best Cactus In Contest

`{skyblockJacobPersonalBestMelon}` - Player's SkyBlock Jacob Person Best Melon In Contest

`{skyblockJacobPersonalBestSugarCane}` - Player's SkyBlock Jacob Person Best Sugar Cane In Contest

---

This document is [auto generated](/scripts/docs/Variables/Player.ts) and was last updated on `Tue, 01 Sep 2026 12:27:55 GMT` (`1788265675804`)

To update this document please run `pnpm docgen` or contact a maintainer and ask them to update it.

---

If you need any help help consider checking out the [FAQ](/docs/FrequentlyAskedQuestions.md)

Feel free to reach out to the maintainers directly on Discord. [@duckysolucky](https://discord.com/users/486155512568741900) and
[@.kathund](https://discord.com/users/1276524855445164098)
