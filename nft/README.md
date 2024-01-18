## Publish

sui client publish --gas-budget 100000000 --skip-dependency-verification

## Mint NFT

```
export PACKAGE_ID=0x3ee940d9aa48cf8eae389e3ae66cb4b9a1d7bf9d94e09bc9044b7ef6d77956b0
sui client call --package $PACKAGE_ID --module nft --function mint --gas-budget 10000000 --args "Name" "Description" "URL"
```
