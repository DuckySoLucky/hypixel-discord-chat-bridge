{
  lib,
  stdenv,
  nodejs_24,
  nodejs-slim_24,
  pnpm_11,
  fetchPnpmDeps,
  pnpmConfigHook,
  python3,
  makeWrapper,

  nix-update-script,

  # overridables
  gitCommit ? "unknown",
  gitDirty ? true,
  originalSrc ? ./..,
}:
let
  src = lib.sources.cleanSourceWith {
    name = "hypixeldiscordchatbridge-src";
    src = lib.sources.cleanSourceWith {
      src = originalSrc;
      filter =
        name: type:
        let
          baseName = baseNameOf (toString name);
        in
        # Local state and build output, see .gitignore
        !(builtins.elem baseName [
          "node_modules"
          "build"
          "data"
          "config.json"
          "nix"
          "flake.nix"
          "flake.lock"
        ]);
    };
    filter = lib.sources.cleanSourceFilter;
  };
in

stdenv.mkDerivation (finalAttrs: {
  pname = "hypixeldiscordchatbridge";
  version = "0-unstable-2026-11-27";

  inherit src;

  pnpmDeps = fetchPnpmDeps {
    inherit (finalAttrs) pname version src;
    pnpm = pnpm_11;
    fetcherVersion = 5;
    hash = "sha256-DHPIh7W6nlazxnRwx+v/JYjwzBnbbjaJ1qy3b90CkG8=";
  };

  nativeBuildInputs = [
    nodejs_24
    pnpm_11
    pnpmConfigHook
    # canvas
    python3
    makeWrapper

  ];

  preBuild = ''
    SKYHELPER_FILE=$(find node_modules/.pnpm -path '*/skyhelper-networth/constants/itemsMap.js' | head -1)
    substituteInPlace "$SKYHELPER_FILE" \
      --replace "path.join(__dirname, '..', '.itemsBackup.json')" "require('node:os').tmpdir() + '/.skyhelper-itemsBackup.json'"
    mkdir -p .nodedir/include
    ln -s ${nodejs_24}/include/node .nodedir/include/node
    cd node_modules/canvas
    node ${nodejs_24}/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js rebuild --nodedir=$(pwd)/../../.nodedir
    cd ../..
  '';

  buildPhase = ''
    runHook preBuild

    # pnpmConfigHook installs with --ignore-scripts. canvas needs its install script to
    # build the native addon, which falls back to node-gyp as prebuilt binaries can't be fetched.
    export npm_config_nodedir=${nodejs_24}
    pnpm rebuild canvas

    # Type check, like upstream's Docker image does before starting
    pnpm build

    runHook postBuild
  '';

  installPhase = ''
    runHook preInstall

    share="$out"/share/hypixeldiscordchatbridge
    mkdir -p "$share"
    cp -r index.ts package.json config.example.json src skills node_modules "$share"/

    # The bot reads src/ (commands, migrations, ...) and config.example.json relative to its working
    # directory, which also holds its writable config.json and data/. So link the code into whichever
    # directory it is started from, then start it from the store.
    makeWrapper ${lib.getExe nodejs-slim_24} "$out"/bin/hypixeldiscordchatbridge \
        --run 'ln -sfn '"$share"'/src src' \
        --run 'ln -sfn '"$share"'/config.example.json config.example.json' \
        --set NODE_ENV production \
        --set GIT_COMMIT ${lib.escapeShellArg gitCommit} \
        --set GIT_DIRTY ${lib.boolToString gitDirty} \
        --prefix PATH : ${lib.makeBinPath [ python3 ]} \
        --add-flags "$share"/node_modules/tsx/dist/cli.mjs \
        --add-flags "$share"/index.ts

    runHook postInstall
  '';

  passthru.updateScript = nix-update-script { };

  meta = {
    mainProgram = "hypixeldiscordchatbridge";
    description = "A two-way chat bridge between Hypixel guild chat and a Discord channel. The application utilizes discord.js v14 for communicating with Discord, and mineflayer for communicating with Hypixel";
    homepage = "https://github.com/DuckySoLucky/hypixel-discord-chat-bridge";
    platforms = lib.platforms.all;
  };
})
