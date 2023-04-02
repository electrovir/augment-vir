#!/usr/bin/env bash

rm -rf packages/*/node_modules/@augment-vir >/dev/null 2>&1;

set -e;

rm -rf node_modules/@augment-vir;
rm -rf packages/*/dist;
npm i;

echo "compiling...";

tsc-mono for-each npm run compile;