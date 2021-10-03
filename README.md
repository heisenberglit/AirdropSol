# Airdrop SOL wallets
# Contact @statikdev for snapshot


node build/cli.js create_compatible_format -p ./cubs/cubs.json
node build/cli.js count_total_items
node build/cli.js remove_from_list -r ./cubs/remove.json 
node build/cli.js count_total_items
node build/cli.js calculate_per_wallet_drop -k ./wallet/wallet.json -e "devnet"
node build/cli.js verify_balance -k ./wallet/wallet.json -e "devnet"
node build/cli.js do_airdrop -p  "0.00035" -k ./wallet/wallet.json -e "devnet"