{
  description = "# Hypixel Discord Chat Bridge";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
      ...
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        packages = {
          default = self.packages.${system}.hypixeldiscordchatbridge;
          hypixeldiscordchatbridge = pkgs.callPackage ./nix/package.nix {
            # Reported by the bot instead of asking git, which isn't available at runtime
            gitCommit = self.rev or self.dirtyRev or "unknown";
            gitDirty = !(self ? rev);
          };
        };
        devShells.default = pkgs.mkShellNoCC {
          # Add all build-time dependencies to the environment
          APPEND_LIBRARY_PATH = pkgs.lib.makeLibraryPath [
            pkgs.libGL
            pkgs.libuuid
          ];
          shellHook = ''
            export LD="$CC"
            export LD_LIBRARY_PATH="$APPEND_LIBRARY_PATH:$LD_LIBRARY_PATH"
          '';
          packages = [
            pkgs.nodejs_24
            pkgs.pnpm_11
            pkgs.python3
          ];
        };
      }
    )
    // {
      hydraJobs.build = self.packages.x86_64-linux.hypixeldiscordchatbridge;
    };
}
