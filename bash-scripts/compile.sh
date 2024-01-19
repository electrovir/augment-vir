#!/usr/bin/env bash

echo "hold on while we reinstall everything..."

find . -name node_modules -type d -exec rm -rf {} \;

set -e;
npm i;

echo "compiling common...";

# We specifically have to compile the common package first because mono-vir depends on it and we
# override all @augment-vir/* package versions in this mono-repo's package.json.
cd packages/common;
npm run compile;
cd -;

sleep 1;
echo "compiling everything else...";
mono-vir for-each npm run compile;