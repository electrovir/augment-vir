#!/usr/bin/env bash

set -e;
echo "hold on while we reinstall everything..."


if ! virmator deps regen git; then
    npm ci
fi

echo "compiling...";

# We specifically have to compile the common package first because mono-vir depends on it and we
# override all @augment-vir/* package versions in this mono-repo's package.json.
cd packages/common;
npm run compile;
cd -;

mono-vir for-each npm run compile;