{
  stdenv,
  fetchFromGitHub,
  fetchNpmDeps,
  npmHooks,
  nodejsInstallExecutables,
  nodejsInstallManuals,
  nodejs,
  lib,
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
  pname = "hypixel-bridge-bot";
  version = "3.1.15-unstable-2026-05-18";

  src = fetchFromGitHub {
    owner = "DuckySoLucky";
    repo = "hypixel-discord-chat-bridge";
    rev = "c9e1f90127c0ce453524e3c610bcaa1758f1681d";
    hash = "sha256-6WcUNJCzDGztxnuKTNfbFJijy5uB7msJB2k7SxybYXU=";
  };
  patches = [
    ./fix-config.patch
  ];
  strictDeps = true;

  nativeBuildInputs = [
    nodejs
    nodejsInstallExecutables
    nodejsInstallManuals
    npmHooks.npmConfigHook
    npmHooks.npmInstallHook
    pkg-config
    python3
  ];

  npmFlags = [
    "--ignore-scripts"
  ];

  buildInputs = [
    cairo
    pango
    pixman
    libjpeg
    giflib
    librsvg
  ];

  npmDeps = fetchNpmDeps {
    inherit (finalAttrs) src;
    hash = "sha256-OtHe0oHEjR4TL/zuPhCfTC+CJ3Cscmayw2BkGb+r0Rs=";
  };
  buildPhase = ''
    runHook preBuild
    cd node_modules/canvas
    node ${nodejs}/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js rebuild
    cd ../..
    runHook postBuild
  '';

  postInstall = ''
    makeWrapper "${lib.getExe nodejs}" $out/bin/bridgebot \
     --add-flags "$out/lib/node_modules/hypixel-discord-chat-bridge/index.js"

    substituteInPlace $out/lib/node_modules/hypixel-discord-chat-bridge/node_modules/skyhelper-networth/constants/itemsMap.js \
      --replace "path.join(__dirname, '..', '.itemsBackup.json')" "require('path').join(require('os').tmpdir(), '.skyhelper-itemsBackup.json')"
  '';

  meta = {
    description = "npm project";
  };
})
