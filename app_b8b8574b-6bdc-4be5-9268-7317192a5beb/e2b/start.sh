#!/bin/sh

cd /top

export PATH="$PWD/node/bin:$PATH"

chown -R user:user /top /efs /generation || true

exec sudo -u user node/bin/pm2-runtime start e2b/ecosystem.config.js
