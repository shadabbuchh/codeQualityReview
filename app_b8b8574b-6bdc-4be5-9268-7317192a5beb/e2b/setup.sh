#!/bin/sh

set -eux

apt-get update && apt-get install -y curl python3 python3-pip || true

# Create /usr/local/bin directory first
mkdir -p /usr/local/bin

# Install Caddy
curl --location --fail 'https://github.com/caddyserver/caddy/releases/download/v2.10.0/caddy_2.10.0_linux_amd64.tar.gz' \
  | tar -C /usr/local/bin -xz caddy

# Install Node.js
mkdir -p node
arch="$(uname -m | sed 's/x86_64/x64/; s/aarch64/arm64/')"
curl -sS "https://nodejs.org/dist/v22.17.1/node-v22.17.1-linux-$arch.tar.gz" \
  | tar -xz -C node --strip-components 1

# Add node/bin to PATH for this session
export PATH="$PWD/node/bin:$PATH"

# Install PM2
npm install -g pm2

# Generated code requires pnpm "~9.15.9" (see app-template/package.json engines field)
npm install -g @anthropic-ai/claude-code pnpm@9.15.9

# Create symlinks for all node/bin executables (including pm2 and pnpm)
# include both files (-type f) and symlinks (-type l)
find "$PWD/node/bin" -maxdepth 1 \( -type f -o -type l \) -exec ln -vsf '{}' /usr/local/bin/ ';'

# Test that tools are working via symlinks
node --version
pnpm --version
pm2 --version

# Create python symlink for convenience
ln -sf /usr/bin/python3 /usr/local/bin/python

# Install Python packages
pip3 install --no-cache-dir sqlfluff

# Test Python and SQLFluff installation
python3 --version
sqlfluff --version

# Clean up pip and build dependencies to keep container lightweight
# Note: python3-setuptools and python3-wheel are auto-installed with python3-pip
apt-get remove -y python3-pip
apt-get autoremove -y  # Removes orphaned dependencies like setuptools, wheel, and build tools
apt-get clean          # Clears apt cache

# Create essential directories for file synchronization
# These directories need to be writable by the user for proper file operations
mkdir -p /efs
# Note: Permissions will be set at runtime in start.sh

# Install dependencies at workspace root
cd /top && pnpm install
