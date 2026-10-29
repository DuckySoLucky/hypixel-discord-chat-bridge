{
  pkgs ? import <nixpkgs> { },
  gitRev,
}:

{
  bridgebot = pkgs.callPackage ./package.nix { rev = "${toString gitRev}"; };
}
