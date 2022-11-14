# @augment-vir/docker

`augment-vir` is a collection of small helper functions that I constantly use across all my JavaScript and TypeScript repos. I call these functions `augments`. These are things commonly placed within a "util", or "helpers", etc. directory; they don't really have anything in common with each other except that they have almost no dependencies.

This `docker` package is for docker-only augments: they are used for interacting with Docker inside a Node.js environment. Functions exported by this package use the Docker CLI rather than the API.
