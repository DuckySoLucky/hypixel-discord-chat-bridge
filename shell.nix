with import <nixpkgs> { };
stdenv.mkDerivation {
  name = "env";
  nativeBuildInputs = [ pkg-config ];
  buildInputs = [
    python3
    autoreconfHook
    xorg.libX11
    xorg.libXi
    xorg.libXext
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

  APPEND_LIBRARY_PATH = "${lib.makeLibraryPath [
    libGL
    libuuid
  ]}";
  shellHook = ''
    LD=$CC
    export LD_LIBRARY_PATH="$APPEND_LIBRARY_PATH:$LD_LIBRARY_PATH"
  '';
}
