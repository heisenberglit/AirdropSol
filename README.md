# Airdrop SOL into wallet based on nft count<br/>

Contact @statikdev for snapshot of wallets for a particular collection<br/><br/>


Need to work upon - 
- Better error handling 
- Create a file for all failed txn
- Use sendTransactionWithRetry


This has been tested on Devnet only. 

Issues :
- Mainnet-Beta throws some error sometimes related to Node is behind 204 slots


Commands


1. node build/cli.js create_compatible_format -p {FILE_PATH} <br/>
2. node build/cli.js count_total_items<br/>
3. node build/cli.js remove_from_list -r {FILE_PATH} <br/>
4. node build/cli.js count_total_items<br/>
5. node build/cli.js calculate_per_wallet_drop -k {WALLET_PATH} -e "devnet"<br/>
6. node build/cli.js verify_balance -k {WALLET_PATH} -e "devnet"<br/>
7. node build/cli.js do_airdrop -p  "0.00012" -k {WALLET_PATH} -e "devnet"<br/>
