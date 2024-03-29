# Sui Telegram Framework

This repository provides common functions for building Telegram applications for
the Sui blockchain. It includes pre-built components for the popular [grammyjs](https://github.com/grammyjs/grammY),
Telegram bot library.

# Components

Directory: `packages/flows-grammy`

This directory contains menus and conversations for common Sui app functions,
including creating and managing Sui accounts, sending sui, and watching
transaction status.

# Signing a transaction/watching transaction status

File: `packages/flows-grammy/src/conversation/sendSui.ts`

This conversation contains an example for signing transaction blocks and
notifying a user about transaction status.

# Key Storage

Directory: `packages/storage`

This directory contains a storage interface designed for secure key
storage. Two storage implementations are provided:

- `packages/storage-impl-memory` - an in-memory storage backend intended for development
- `packages/storage-impl-s3` - an S3 storage backend suitable for production. The `terraform` directory contains an example of production-ready Terraform configuration for this backend.

# Developing

Create a bot (https://t.me/BotFather) and set the following environment variables:

```
export SUI_NETWORK=devnet
export BOT_TOKEN=
```

Run

```
; yarn install
; yarn demo dev
```

# Gated Community

Optionally start the bot with `--gate-on-struct-type` or provide
`GATE_ON_STRUCT_TYPE` in the environment to gate group access based on object
ownership, eg, NFTs. Add the bot to your group, then add the bot to the Admin
list to enable this feature.

```
$ export GATE_ON_STRUCT_TYPE='0x2::coin::Coin<0x2::sui::SUI>'
$ yarn demo dev
#> Gating community access on struct type 0x2::coin::Coin<0x2::sui::SUI>
#> Starting bot...
```
