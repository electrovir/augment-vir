#!/usr/bin/env bash

rm -rf packages/*/node_modules/@augment-vir >/dev/null 2>&1;

set -e;

rm -rf node_modules/@augment-vir;
rm -rf packages/*/dist;
rm -f packages/*/tsconfig.tsbuildinfo;
npm i;

echo "compiling...";

tsc-mono packages for-each npm run compile;