{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs
  ];

  shellHook = ''
    echo "Create node.js environment with nix-shell on nixos."
    echo "If you see these words, you have run nix-shell"
  '';
}
