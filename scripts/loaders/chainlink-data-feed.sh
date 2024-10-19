# Token Metadata program
export CHAINLINK_STORE_PROGRAM_ID="HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny"
export CHAINLINK_AGGREGATOR_PROGRAM_ID="cjg3oHmg9uuPsP8D6g29NWvhySJkdYdAo9D25PRbKXJ"
export CHAINLINK_USD_SOL_FEED_MAIN="CH31Xns5z3M1cTAbKW34jcxPPciazARpijcHj9rxtemt"
export CHAINLINK_USD_SOL_FEED_DEV="99B2bTijsU6f1GCT73HmdR7HCFFjGMBcPZY6jZ96ynrR"

solana program dump -u m ${CHAINLINK_STORE_PROGRAM_ID} ../../anchor/bpf-programs/chainlink_store.so
solana program dump -u m ${CHAINLINK_AGGREGATOR_PROGRAM_ID} ../../anchor/bpf-programs/chainlink_aggregator.so
solana account -u m ${CHAINLINK_USD_SOL_FEED_MAIN} --output-file ../../anchor/bpf-programs/usd_sol_feed_main.json --output json-compact
solana account -u d ${CHAINLINK_USD_SOL_FEED_DEV} --output-file ../../anchor/bpf-programs/usd_sol_feed_dev.json --output json-compact
