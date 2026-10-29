{
  lib,
  stdenv,
  rev ? null,
  nix-update-script,
  fetchPnpmDeps,
  pnpmConfigHook,
  makeBinaryWrapper,
  nodejs,
  pnpm,
  pkg-config,
  python3,
  cairo,
  pango,
  pixman,
  libjpeg,
  giflib,
  librsvg,
}:

stdenv.mkDerivation (finalAttrs: {
  pname = "hypixel-discord-chat-bridge";
  version = "0-unstable-2026-07-25";
  __structuredAttrs = true;
  strictDeps = true;

  src = builtins.path {
    path = ./.;
    name = "source";
  };
  pnpmDeps = fetchPnpmDeps {
    inherit (finalAttrs) pname version src;
    inherit pnpm;
    fetcherVersion = 4;
    hash = "sha256-ox5nFFKx98SfgoElkdrBRf5QD6h63cF5WnD/Am6oqQI=";
  };

  nativeBuildInputs = [
    pnpmConfigHook
    makeBinaryWrapper
    nodejs
    pkg-config
    python3
    pnpm
  ];

  buildInputs = [
    nodejs
    cairo
    pango
    pixman
    libjpeg
    giflib
    librsvg
  ];

  dontPnpmBuild = true;

  preBuild = ''
    SKYHELPER_FILE=$(find node_modules/.pnpm -path '*/skyhelper-networth/constants/itemsMap.js' | head -1)
    substituteInPlace "$SKYHELPER_FILE" \
      --replace "path.join(__dirname, '..', '.itemsBackup.json')" "require('node:os').tmpdir() + '/.skyhelper-itemsBackup.json'"
    mkdir -p .nodedir/include
    ln -s ${nodejs}/include/node .nodedir/include/node
    cd node_modules/canvas
    node ${nodejs}/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js rebuild --nodedir=$(pwd)/../../.nodedir
    cd ../..
  '';

  installPhase = ''
    runHook preInstall

    mkdir -p "$out/lib/hypixel-discord-chat-bridge"
    cp -r src "$out/lib/hypixel-discord-chat-bridge/"
    cp -r node_modules "$out/lib/hypixel-discord-chat-bridge/"
    cp package.json pnpm-lock.yaml pnpm-workspace.yaml "$out/lib/hypixel-discord-chat-bridge/"
    cp index.ts "$out/lib/hypixel-discord-chat-bridge/"


    makeWrapper "${nodejs}/bin/node" "$out/bin/bridgebot" \
      --add-flag "$out/lib/hypixel-discord-chat-bridge/node_modules/tsx/dist/cli.mjs" \
      --add-flag "$out/lib/hypixel-discord-chat-bridge/index.ts" \
      --set GIT_DIRTY false \
      --set GIT_COMMIT "${if rev == null then "unknown" else rev}"
    runHook postInstall
  '';

  passthru.updateScript = nix-update-script { };

  meta = {
    description = "A two-way chat bridge between Hypixel guild chat and a Discord channel. The application utilizes discord.js v14 for communicating with Discord, and mineflayer for communicating with Hypixel";
    homepage = "https://github.com/DuckySoLucky/hypixel-discord-chat-bridge";
    mainProgram = "bridgebot";
    platforms = lib.platforms.all;
  };
})
