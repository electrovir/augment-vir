#!/usr/bin/env bash

echo "hold on while we reinstall everything..."

find . -name @augment-vir -type d -exec rm -rf {} \; > /dev/null 2>&1

set -e;

echo "compiling common...";

# We specifically have to compile the common package first because mono-vir depends on it and we
# override all @augment-vir/* package versions in this mono-repo's package.json.
cd packages/common;
npm run compile;
cd -;
npm i;

sleep 1;
echo "compiling everything else...";
mono-vir for-each npm run compile;