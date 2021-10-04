# Airdrop SOL into wallet based on nft count<br/>

Contact @statikdev for snapshot of wallets for a particular collection<br/><br/>


1. node build/cli.js create_compatible_format -p ./cubs/cubs.json <br/>
2. node build/cli.js count_total_items<br/>
3. node build/cli.js remove_from_list -r ./cubs/remove.json <br/>
4. node build/cli.js count_total_items<br/>
5. node build/cli.js calculate_per_wallet_drop -k ./wallet/wallet.json -e "devnet"<br/>
6. node build/cli.js verify_balance -k ./wallet/wallet.json -e "devnet"<br/>
7. node build/cli.js do_airdrop -p  "0.00012" -k ./wallet/wallet.json -e "devnet"<br/>
