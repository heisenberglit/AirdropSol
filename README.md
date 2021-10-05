# Airdrop SOL into wallet based on nft count<br/>

A NodeJS Application to airdrop SOL to users wallet based on NFTs Count for a particular collection.

Contact @statikdev for snapshot of wallets for a particular collection<br/><br/>


Usecase - If you have a royalty wallet for NFT holders and have snapshot of wallets taken and wants to airdrop SOL then use this repo.

This has been tested on Devnet only. 


## Must have installed

Solana CLI<br/>
NodeJS<br/>


## How to use

- yarn 
- yarn build


## How to use commands

- create_compatible_format -Contact @statikdev for snaphot for the particular collection and then create a folder and use that path to create a compatible format to airdrop.
- count_total_items - Counts the total number of items which is generally equals to collection size
- remove_from_list - Create a JSON file with bunch of addresses which needs to be removed from this before processing. Add secondary wallet addresses <br/><br/>
            Digital Eyes -  F4ghBzHFNgJxV4wEQDchU5i7n4XWWMBSaq7CuswGiVsr<br/>
            Magic Eden - GUfCR9mK6azb9vcpsxgXyj7XRPAKJd4KMHTTVvtncGgp<br/>
            Solanart -3D49QorJyNaL4rcpiynbuS3pRH4Y7EXEM6v6ZGaqfFGK<br/><br/>
- count_wallets - Counts the total number of users which are getting airdropped
- calculate_per_wallet_drop - Calculate the number which each wallet will get generally its  (ROYALTY_WALLET_BALANCE / No. Of Items) In SOL
- verify_balance - Just for verification
- send_sol - To airdrop users SOL based on NFTs they have. Enter the price in this command which we got from calculate_per_wallet_drop.


## Commands : 

```nodejs
1. node build/cli.js create_compatible_format -p {FILE_PATH} <br/>
2. node build/cli.js count_total_items<br/>
3. node build/cli.js remove_from_list -r {FILE_PATH} <br/>
4. node build/cli.js count_total_items<br/>
5. node  build/cli.js count_wallets
6. node build/cli.js calculate_per_wallet_drop -k {WALLET_PATH} -e "devnet"<br/>
7. node build/cli.js verify_balance -k {WALLET_PATH} -e "devnet"<br/>
8. node build/cli.js send_sol -p  {PRICE_PER_WALLET_PER_ITEM} -k {WALLET_PATH} <br/>

```

## Logging

- A results folder would be created which contains the response.json which have all the failed and success tx with signature.
 
 
  Contents of response.json file for Success :
   ```json
  
   {
        "pubKey": "2mwMU2WTW5vG6z16xx68Ys5BNkmAe5voU7aHZwLbxdMA",
        "price": 0.01,
        "signature": "\nSignature: 3rtUax1eDJr6w8TJv35cE26qjuvpGfTwGC3xy8MbkEGo9iQeZvVyujpQtDpg6kSuKQxhNYWV3iLXe7TvCPanAmNz\n\n",
        "isSuccess": true
    }
    ```
    Contents of response.json file for Failure :<br/>
  
  ```json
    
   {
        "pubKey": "2mwMU2WTW5vG6z16xx68Ys5BNkmAe5voU7aHZwLbxdMA",
        "price": 0.000030000000000000004,
        "error": "Command failed: solana transfer -k ./wallet/wallet.json 3tLbZqkECtj66aaLizJUusqbikMNtdi86iSey56L5eEA 4 
            --allow-unfunded-recipient\nError: Account 9vpsmXhZYMpvhCKiVoX5U8b1iKpfwJaFpPEEXF7hRm9N has insufficient funds for spend (4 SOL) + fee (0.000005)",
        "isSuccess": false
    }
    
    ```
    
 ## Need to work upon
- Better error handling 
- Use sendTransactionWithRetry
    
 ## License
   [MIT](https://github.com/heisenberglit/AirdropSol/blob/main/LICENSE/)
   
 ## Contributing        
   Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
    
 ## Tip
 
  If you found out it useful :  Send a tip to  - 87LZXRGmK5h6FCbaS9gHXZZQMaU7BKFEN5rQkRB1NeyT (SOLANA ADDRESS)
   
