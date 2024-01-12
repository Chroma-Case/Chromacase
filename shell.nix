{pkgs ? import <nixpkgs> {}}:
pkgs.mkShell {
  nativeBuildInputs = [pkgs.bashInteractive];
  buildInputs = with pkgs; [
    nodePackages.prisma
    nodePackages."@nestjs/cli"
    nodePackages.npm
    nodePackages.eas-cli
    eslint_d
    nodejs_18
    yarn
    (python3.withPackages (ps: with ps; [requests mido]))
    pkg-config
  ];
  shellHook = with pkgs; ''
    # export PRISMA_MIGRATION_ENGINE_BINARY="${prisma-engines}/bin/migration-engine"
    # export PRISMA_QUERY_ENGINE_BINARY="${prisma-engines}/bin/query-engine"
    export PRISMA_QUERY_ENGINE_LIBRARY="${prisma-engines}/lib/libquery_engine.node"
    export PRISMA_INTROSPECTION_ENGINE_BINARY="${prisma-engines}/bin/introspection-engine"
    export PRISMA_FMT_BINARY="${prisma-engines}/bin/prisma-fmt"
    export DATABASE_URL=postgresql://user:eip@localhost:5432/chromacase
  '';
}
