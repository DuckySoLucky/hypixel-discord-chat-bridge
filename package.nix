{
  lib,
  stdenv,
  fetchFromGitHub,
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

  src = fetchFromGitHub {
    owner = "DuckySoLucky";
    repo = "hypixel-discord-chat-bridge";
    rev = "9ec6e3b9916cde0c253be427260a478361c85707";
    hash = "sha256-h0j7xDh8Kgl1JfUSV3EHH2PLMFV3TPIjxfCEwcbXlnw=";
  };

  patches = [ ./fix-config.patch ];

  pnpmDeps = fetchPnpmDeps {
    inherit (finalAttrs) pname version src;
    inherit pnpm;
    fetcherVersion = 4;
    hash = "sha256-Vd9zrm6TTD2DfJlq9EsWJX2WnSf125EzDd5Tl/LxQQo=";
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

        mkdir -p "$out/bin"
        cat > "$out/bin/bridgebot" << 'WRAPPER'
    #!/bin/sh
    exec __NODE__ "$out/lib/hypixel-discord-chat-bridge/node_modules/tsx/dist/cli.mjs" "$out/lib/hypixel-discord-chat-bridge/index.ts" "$@"
    WRAPPER
        chmod +x "$out/bin/bridgebot"
        substituteInPlace "$out/bin/bridgebot" \
          --replace '__NODE__' "${nodejs}/bin/node" \
          --replace '$out' "$out"

        runHook postInstall
  '';

  passthru.updateScript = nix-update-script { };

  meta = {
    description = "A two-way chat bridge between Hypixel guild chat and a Discord channel. The application utilizes discord.js v14 for communicating with Discord, and mineflayer for communicating with Hypixel";
    homepage = "https://github.com/Kathund/hypixel-discord-chat-bridge";
    mainProgram = "bridgebot";
    platforms = lib.platforms.all;
  };
})
