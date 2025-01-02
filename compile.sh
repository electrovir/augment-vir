#!/bin/bash

set -e

cd packages/assert
rm -rf dist && rm -f tsconfig.tsbuildinfo && tsc -b --pretty
cd ../common
rm -rf dist && rm -f tsconfig.tsbuildinfo && tsc -b --pretty
cd ../core
rm -rf dist && rm -f tsconfig.tsbuildinfo && tsc -b --pretty
cd ../node
rm -rf dist && rm -f tsconfig.tsbuildinfo && tsc -b --pretty
cd ../scripts
rm -rf dist && rm -f tsconfig.tsbuildinfo && tsc -b --pretty
cd ../test
rm -rf dist && rm -f tsconfig.tsbuildinfo && tsc -b --pretty
cd ../web
rm -rf dist && rm -f tsconfig.tsbuildinfo && tsc -b --pretty