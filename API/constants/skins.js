// CREDIT: https://github.com/SkyCryptWebsite/SkyCrypt/ (Modified)
/*eslint-disable */

/*
  skins: Array of objects containing all skins ever released
  {
    id: string,
    name: string,
    texture: string,
    release: int,
  }
*/

const skins = [
  {
    id: "PET_SKIN_ENDERMAN",
    name: "Spooky",
    texture:
      "/head/ea84cc8818c293484fdaafc8fa2f0bf39e55733a247d68023df2c6c6b9b671d0",
    release: new Date("2020-09-08 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_ENDERMAN_SLAYER",
    name: "Void Conqueror",
    texture:
      "/head/8fff41e1afc597b14f77b8e44e2a134dabe161a1526ade80e6290f2df331dc11",
    release: new Date("2021-05-31 23:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_GUARDIAN",
    name: "Watcher",
    texture:
      "/head/37cc76e7af29f5f3fbfd6ece794160811eff96f753459fa61d7ad176a064e3c5",
    release: new Date("2020-10-01 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_TIGER_TWILIGHT",
    name: "Twilight",
    texture:
      "/head/896211dc599368dbd9056c0116ab61063991db793be93066a858eb4e9ce56438",
    release: new Date("2020-10-20 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_RABBIT",
    name: "Pretty",
    texture:
      "/head/a34631d940fddb689ddef6a3b352c50220c460dba05cd18dc83192b59dc647f8",
    release: new Date("2020-09-12 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_RABBIT_AQUAMARINE",
    name: "Aquamarine",
    texture:
      "/head/35a2119d122961852c010c1007ab2aff95b4bbeb74407463f6d2e1ff0792c812",
    release: new Date("2021-04-15 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_RABBIT_ROSE",
    name: "Rose",
    texture:
      "/head/d7cddf5b20cb50d6600e5333c6bb3fb15b4741f17e3675fc2bfc09c2cd09e619",
    release: new Date("2021-04-15 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_WITHER",
    name: "Dark",
    texture:
      "/head/224c2d14a0219af5ccfcaa36e8a333e271724ed61276611f9529e16c10273a0d",
    release: new Date("2020-11-15 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_ROCK_COOL",
    name: "Cool",
    texture:
      "/head/fefcdbb7d95502acc1ae35a32a40ce4dec8f4c9f0da26c9d9fe7c2c3eb748f6",
    release: new Date("2020-09-23 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_ROCK_SMILE",
    name: "Smile",
    texture:
      "/head/713c8b2916a275db4c1762cf5f13d7b95b91d60baf5164a447d6efa7704cf11b",
    release: new Date("2020-09-23 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_ROCK_THINKING",
    name: "Thinking",
    texture:
      "/head/dd2f781f03c365bbc5dd1e7186ab38dc69465e836c9fe066a9a844f34a4da92",
    release: new Date("2020-09-23 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_ROCK_LAUGH",
    name: "Laughing",
    texture:
      "/head/8cc1ef513d5f616675242174acde7b9d6259a47c4fe8f6e4b6e20920319d7073",
    release: new Date("2020-09-23 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_ROCK_DERP",
    name: "Derp",
    texture:
      "/head/c4f89fbd12c209f7f26c1f34a1bd7f47635814759c09688dd212b205c73a8c02",
    release: new Date("2020-09-23 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_ROCK_EMBARRASSED",
    name: "Embarrassed",
    texture:
      "/head/27ff34992e66599e8529008be3fb577cb0ab545294253e25a0cc988e416c849",
    release: new Date("2020-09-23 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_SHEEP_WHITE",
    name: "White",
    texture:
      "/head/b92a1a5c325f25f7438a0abb4f86ba6cf75552d02c7349a7292981459b31d2f7",
    release: new Date("2020-11-07 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_SHEEP_PURPLE",
    name: "Purple",
    texture:
      "/head/99a88cf7dd33063587c6b540e6130abc5d07f1a65c47573ab3c1ad3ccec8857f",
    release: new Date("2020-11-07 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_SHEEP_BLACK",
    name: "Black",
    texture:
      "/head/aa9dcda642a807cd2daa4aa6be87cef96e08a8c8f5cec2657dda4266c6a884c2",
    release: new Date("2020-11-07 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_SHEEP_PINK",
    name: "Pink",
    texture:
      "/head/afa7747684dcb96192d90342cea62742ec363da07cb5e6e25eecec888cd2076",
    release: new Date("2020-11-07 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_SHEEP_LIGHT_BLUE",
    name: "Light Blue",
    texture:
      "/head/722220de1a863bc5d9b9e7a6a3b03214c9f3d698ed3fe0d28220f3b93b7685c5",
    release: new Date("2020-11-07 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_SHEEP_LIGHT_GREEN",
    name: "Light Green",
    texture:
      "/head/cf183ec2fe58faa43e568419b7a0dc446ece4ea0be52ec784c94e1d74b75939d",
    release: new Date("2020-11-07 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_SHEEP_NEON_YELLOW",
    name: "Neon Yellow",
    texture:
      "/head/94263428c23da9165b2639a8f2428ff4835227945c9e1038461cf644d67cc82a",
    release: new Date("2021-01-05 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_SHEEP_NEON_RED",
    name: "Neon Red",
    texture:
      "/head/4918be142a20b2b39bc582f421f6ae87b3184b5c9523d16fbe6d69530107886a",
    release: new Date("2021-01-05 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_SHEEP_NEON_BLUE",
    name: "Neon Blue",
    texture:
      "/head/e55b3fe9311c99342ea565483cbf9e969a258faf7afa30270fb9a0929377acfd",
    release: new Date("2021-01-05 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_SHEEP_NEON_GREEN",
    name: "Neon Green",
    texture:
      "/head/2c14d66911554bd0882339074bf6b8110c2d3509b69e7a6144e4d5a7164bacc8",
    release: new Date("2021-01-05 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_SILVERFISH",
    name: "Fortified",
    texture:
      "/head/d8552ff591042c4a38f8ba0626784ae28c4545a97d423fd9037c341035593273",
    release: new Date("2020-11-22 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_SILVERFISH_FOSSILIZED",
    name: "Fossilized",
    texture:
      "/head/ca3a363368ed1e06cee3900717f062e02ec39aee1747675392255b48f7f83600",
    release: new Date("2021-01-22 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_ELEPHANT_PINK",
    name: "Pink",
    texture:
      "/head/570eef474ec0e56cc34c2307eaa39f024612f8cd7248e7d5b14169ebd307c742",
    release: new Date("2020-12-05 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_ELEPHANT_BLUE",
    name: "Blue",
    texture:
      "/head/4b62969c005815d0409136380febc5ac468aaba9bda4db80954fa5426ee0a323",
    release: new Date("2020-12-05 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_ELEPHANT_ORANGE",
    name: "Orange",
    texture:
      "/head/554a34a80c474206d3700b8fced6b44fab0b0ed0b05c1293ff0c5d86eda251d1",
    release: new Date("2020-12-05 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_ELEPHANT_RED",
    name: "Red",
    texture:
      "/head/ba5c66ec66cb6b4b5550085f583b4e5c1cee5247bec5fbcc5c318c30c66cab42",
    release: new Date("2021-02-13 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_ELEPHANT_PURPLE",
    name: "Purple",
    texture:
      "/head/5ff9df290b6c5a4984fc6e516605f9816b9882f7bf04db08d3f7ee32d1969a44",
    release: new Date("2021-02-13 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_ELEPHANT_GREEN",
    name: "Green",
    texture:
      "/head/360c122ade5b2fedca14aa78c834a7b0ac9cb5da2a0c93112163086f90c13b68",
    release: new Date("2021-02-13 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_ELEPHANT_MONOCHROME",
    name: "Monochrome",
    texture:
      "/head/4bdf0f628c05e86cabdee2f5858dd5def7f8b8d940cbf25f9937e2ffb53432f4",
    release: new Date("2021-03-22 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_JERRY_RED_ELF",
    name: "Red Elf",
    texture:
      "/head/1d82f9c36e824c1e37963a849bf5abd76d3b349125023504af58369086089ee9",
    release: new Date("2020-12-25 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_JERRY_GREEN_ELF",
    name: "Green Elf",
    texture:
      "/head/4ec5455f43426ca1874b5c7b4a492ec3722a502f8b9599e758e133fed8b3c1e4",
    release: new Date("2020-12-25 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_YETI_GROWN_UP",
    name: "Grown-up",
    texture:
      "/head/f5f29a975529276d916fc67998833c11ee178ff21e5941afdfb0fa7010f8374e",
    release: new Date("2020-12-15 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_MONKEY_GOLDEN",
    name: "Golden",
    texture:
      "/head/e9281c4d87d68526b0749d4361e6ef786c8a35717aa053da704b1d53410d37a6",
    release: new Date("2021-01-13 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_MONKEY_GORILLA",
    name: "Gorilla",
    texture:
      "/head/c3eb3e37e9873bfc176b9ed8ef4fbef833de144546bfaefdf24863c3eb87bb86",
    release: new Date("2021-05-13 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_HORSE_ZOMBIE",
    name: "Zombie",
    texture:
      "/head/578211e1b4d99d1c7bfda4838e48fc884c3eae376f58d932bc2f78b0a919f8e7",
    release: new Date("2021-01-29 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_DRAGON_NEON_BLUE",
    name: "Neon Blue",
    texture:
      "/head/96a4b9fbcf8c3e7e1232e57d6a2870ba3ea30f76407ae1197fd52e9f76ca46ac",
    release: new Date("2021-02-08 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_DRAGON_NEON_PURPLE",
    name: "Neon Purple",
    texture:
      "/head/54bdf5ba6289b29e27c57db1ec7f76151c39492d409268e00a9838e8c963159",
    release: new Date("2021-02-08 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_DRAGON_NEON_RED",
    name: "Neon Red",
    texture:
      "/head/e05c9b4f4218677c5b4bcc9c7d9e29e18d1684a536781fede1280fc5e6961538",
    release: new Date("2021-02-08 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_DRAGON_PASTEL",
    name: "Pastel",
    texture:
      "/head/4a62ec4e019fe0fed059663ae59daa0d91729517bf33ae7f7d7e722913602df4",
    release: new Date("2021-06-30 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_WHALE_ORCA",
    name: "Orca",
    texture:
      "/head/b008ca9c00cecf499685030e8ef0c230a32908619ce9dc10690b69111591faa1",
    release: new Date("2021-03-09 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_CHICKEN_BABY_CHICK",
    name: "Baby Chick",
    texture:
      "/head/1bde55ed54cb5c87661b86c349186a9d5baffb3cb934b449a2d329e399d34bf",
    release: new Date("2021-04-05 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_BLACK_CAT_IVORY",
    name: "Ivory",
    texture:
      "/head/f51b17d7ded6c7e8f3b2dac12378a6fc4e9228b911986f64c8af45837ae6d9e1",
    release: new Date("2021-04-26 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_BLACK_CAT_ONYX",
    name: "Onyx",
    texture:
      "/head/be924115d3a8bbacfd4fafb6cc70f99a2f7580e4583a50fa9b9c285a98ac0c56",
    release: new Date("2021-04-26 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_ENDERMITE_RADIANT",
    name: "Radiant",
    texture:
      "/head/2fc4a7542b754420b1b19f9a28ea00040555a9e876052b97f65840308a93348d",
    release: new Date("2021-06-02 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_WOLF",
    name: "Dark Wolf",
    texture:
      "/head/c8e414e762e1024c799e70b7a527c22fb95648f141d660b10c512cc124334218",
    release: new Date("2021-08-10 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_HOUND_BEAGLE",
    name: "Beagle",
    texture:
      "/head/877364e0ce27f0239b7754706b93022d0cf945854015d6096f9cf43d24a38269",
    release: new Date("2021-08-24 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_SQUID_GLOW",
    name: "Glow",
    texture:
      "/head/fca9982520eee4066bab0ae697f3b3656084b6639ba89113bd8e23ab7288563d",
    release: new Date("2021-09-14 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_TIGER_SABER_TOOTH",
    name: "Saber-Tooth",
    texture:
      "/head/e92dba2fbd699d541b2fa0fbcaff640ad8c311987ade59a13b2a65d0ce319316",
    release: new Date("2021-09-28 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_PARROT_GOLD_MACAW",
    name: "Gold Macaw",
    texture:
      "/head/5dad34650f8d1c6afbfd979b38d7e1412e636215b8f85240e06d998278879b8b",
    release: new Date("2021-10-20 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_BAT_VAMPIRE",
    name: "Vampire",
    texture:
      "/head/473af69ed9bf67e2f5403dd7d28bbe32034749bbfb635ac1789a412053cdcbf0",
    release: new Date("2021-10-31 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_PHOENIX_ICE",
    name: "Ice",
    texture:
      "/head/12582057e52d0f7fffd1a1f93acf196db5f09b76f1ba3ede28476cc4cd82da97",
    release: new Date("2021-11-25 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_OCELOT_SNOW_TIGER",
    name: "Snow Tiger",
    texture:
      "/head/496499b99c88314b1459fc5b515c477b069bf2229a2833abb2e1ff20b5f29457",
    release: new Date("2021-12-14 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_BLAZE_FROZEN",
    name: "Frozen",
    texture:
      "/head/9617a34c8ff467fdb45be3ff17863fcff7e8424c8dd9b99666edd13b44b32e8c",
    release: new Date("2021-12-24 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_DOLPHIN_SNUBNOSE_GREEN",
    name: "Green Snubfin",
    texture:
      "/head/5f2879bd8b0bafdd71dbd3fc5850afc6c53da60d4252182cfc80737a00d72408",
    release: new Date("2022-01-19 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_DOLPHIN_SNUBNOSE_RED",
    name: "Red Snubfin",
    texture:
      "/head/779df5b4da325c0d740251b4204a0cd22d9fdb88cecb6eff6176ef4f2ecedb1e",
    release: new Date("2022-01-19 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_DOLPHIN_SNUBNOSE_PURPLE",
    name: "Purple Snubfin",
    texture:
      "/head/fd0b213c15dd7b8c67512bc18bf14d32dc4b57b9c305d1c7514aa3e2609a78a4",
    release: new Date("2022-01-19 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_DOLPHIN_SNUBFIN",
    name: "Snubfin",
    texture:
      "/head/279413c788c7f450234bdab0cf0d0291c57f730e380c6d4c7746fde15928381",
    release: new Date("2022-01-19 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_TIGER_GOLDEN",
    name: "Golden",
    texture:
      "/head/c85f8db6e5b826d3dd5847cd8d7279f4d4dd50bc955ca7968c7c49b496ed7a3b",
    release: new Date("2022-02-01 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_ARMADILLO_ENCHANTED",
    name: "Enchanted",
    texture:
      "/head/7426d7b174e8bd9c283f91a42cf2dfa95a518d5eae97ab5595412d4951d4db18",
    release: new Date("2022-02-16 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_ARMADILLO_SEAFOAM",
    name: "Seafoam",
    texture:
      "/head/d0c72b0db2ecbdaf153c563593d17d546b302b278b1b81d3e063963b5b0e5bc4",
    release: new Date("2022-02-16 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_JERRY_HANDSOME",
    name: "Handsome",
    texture:
      "/head/11be7e0da38de93dba068a40011808ecc39bb757d3fdee8fb25128e2a06dde86",
    release: new Date("2022-04-01 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_KUUDRA_LOYALTY",
    name: "Loyalty",
    texture:
      "/head/bb7d06ab10c4d15433670ca59ed6ad87d797c24bf7bfc3343730aa1594a4970c",
    release: new Date("2022-05-13 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_ENDERMAN_NEON",
    name: "Neon",
    texture:
      "/head/6f9020c07d875bad1440337adb55a08c15db06b994646a691795f4cd293fe3de",
    release: new Date("2022-06-10 18:00:00 GMT+1").getTime(),
  },
  {
    id: "PET_SKIN_ENDERMAN_XENON",
    name: "Xenon",
    texture:
      "/head/92defbe3cde326d4511bb53339d777afa703f3ec4daa697d61a4402744cbb0cd",
    release: new Date("2022-06-10 18:00:00 GMT+1").getTime(),
  },
];

const gen_pet_skins = {};

skins.forEach((skin) => {
  if (skin.id.startsWith("PET_SKIN_")) {
    gen_pet_skins[skin.id] = {
      name: skin.name,
      texture: skin.texture,
      release: skin.release,
    };
  }
});

const pet_skins = gen_pet_skins;

module.exports = { pet_skins };
