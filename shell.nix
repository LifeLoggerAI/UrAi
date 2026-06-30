{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  packages = with pkgs; [
    nodejs_20
    glib
    nss
    nspr
    dbus
    atk
    at-spi2-atk
    cups
    libdrm
    gtk3
    pango
    cairo
    xorg.libX11
    xorg.libXcomposite
    xorg.libXdamage
    xorg.libXext
    xorg.libXfixes
    xorg.libXrandr
    xorg.libxcb
    xorg.libxkbfile
    alsa-lib
    libxcrypt
    mesa
  ];

  shellHook = ''
    export PLAYWRIGHT_BROWSERS_PATH="$HOME/.cache/ms-playwright"
  '';
}
