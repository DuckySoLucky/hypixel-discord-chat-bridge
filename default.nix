{
  pkgs ? import <nixpkgs> { },
}:

{
  bridgebot = pkgs.callPackage ./package.nix { };
}
