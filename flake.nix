{
  description = "# Hypixel Discord Chat Bridge";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
  };

  outputs =
    inputs@{ flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];

      perSystem =
        { pkgs, system, ... }:
        let
          pkgs' = import inputs.nixpkgs {
            inherit system;
          };
        in
        {
          devShells.default = pkgs'.mkShell {
            packages = with pkgs; [
              python3
              pkg-config
              autoreconfHook
              libX11
              libXi
              libXext
              libGLU
              zlib
              glibc.out
              glibc.static
              libpng
              nasm
              cairo
              pango
              libuuid # required for canvas
            ];

            APPEND_LIBRARY_PATH = pkgs.lib.makeLibraryPath [
              pkgs.libGL
              pkgs.libuuid
            ];

            shellHook = ''
              export LD="$CC"
              export LD_LIBRARY_PATH="$APPEND_LIBRARY_PATH:$LD_LIBRARY_PATH"
            '';
          };
        };
    };
}
