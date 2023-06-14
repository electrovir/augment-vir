#!/usr/bin/env bash

echo "hold on while we reinstall everything..."
rm -rf node_modules >/dev/null 2>&1 && rm -rf packages/*/node_modules >/dev/null 2>&1 && rm -f package-lock.json >/dev/null 2>&1

set -e;

npm i;

echo "compiling...";

mono-vir for-each npm run compile;