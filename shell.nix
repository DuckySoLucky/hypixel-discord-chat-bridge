{ pkgs }:

pkgs.mkShell {
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
    libuuid
    pnpm
  ];

  APPEND_LIBRARY_PATH = pkgs.lib.makeLibraryPath [
    pkgs.libGL
    pkgs.libuuid
  ];

  shellHook = ''
    export LD="$CC"
    export LD_LIBRARY_PATH="$APPEND_LIBRARY_PATH:$LD_LIBRARY_PATH"
  '';
}
