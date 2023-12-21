## Pre-requirements

- pnpm
- node 20
- docker
- k6 (optional for load test)

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# dependencies
$ pnpm run dc:dependencies up

# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# load test
$ pnpm run test

# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
