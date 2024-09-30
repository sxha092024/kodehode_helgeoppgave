{
  description = "Static github pages for a deliverable";

  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = nixpkgs.legacyPackages.${system};
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [];

          nativeBuildInputs = with pkgs; [
            git
            # javascript repl
            deno
          ];
          shellHook = ''
            echo "Flake shell active..."
          '';
        };
      }
    );
}
