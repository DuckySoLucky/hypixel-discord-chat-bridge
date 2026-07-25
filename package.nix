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
    owner = "Kathund";
    repo = "hypixel-discord-chat-bridge";
    rev = "b4f9f18325d192e04508fd27fe8b045c7c94475e";
    hash = "sha256-XB7rcbDs/NHXlvgKLESlPwjJL9R/rAstNcAmj9n84+w=";
  };

  patches = [ ./fix-config.patch ];

  pnpmDeps = fetchPnpmDeps {
    inherit (finalAttrs) pname version src;
    inherit pnpm;
    fetcherVersion = 4;
    hash = "sha256-GkUIpYF2g3lCVxTNCPDzOb49xPHRNWK3XU/Nj1sV1Nk=";
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
    substituteInPlace node_modules/.pnpm/skyhelper-networth@2.7.5/node_modules/skyhelper-networth/constants/itemsMap.js \
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
    cp -r resources "$out/lib/hypixel-discord-chat-bridge/"
    cp package.json pnpm-lock.yaml pnpm-workspace.yaml "$out/lib/hypixel-discord-chat-bridge/"
    cp index.ts "$out/lib/hypixel-discord-chat-bridge/"

    mkdir -p "$out/bin"
    cat > "$out/bin/hypixel-discord-chat-bridge" << 'WRAPPER'
#!/bin/sh
exec __NODE__ "$out/lib/hypixel-discord-chat-bridge/node_modules/tsx/dist/cli.mjs" "$out/lib/hypixel-discord-chat-bridge/index.ts" "$@"
WRAPPER
    chmod +x "$out/bin/hypixel-discord-chat-bridge"
    substituteInPlace "$out/bin/hypixel-discord-chat-bridge" \
      --replace '__NODE__' "${nodejs}/bin/node" \
      --replace '$out' "$out"

    runHook postInstall
  '';

  passthru.updateScript = nix-update-script { };

  meta = {
    description = "A two-way chat bridge between Hypixel guild chat and a Discord channel. The application utilizes discord.js v14 for communicating with Discord, and mineflayer for communicating with Hypixel";
    homepage = "https://github.com/Kathund/hypixel-discord-chat-bridge";
    mainProgram = "hypixel-discord-chat-bridge";
    platforms = lib.platforms.all;
  };
})
