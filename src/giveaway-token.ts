import fs from "fs";
var web3 = require("@solana/web3.js");


var keypair, PRICE_PER_ITEM, list, from , arr;
var data = [], connection, error; 


export const processAirdrop = (pathToWallet, pricePerItem, env) => {
    list = JSON.parse(fs.readFileSync('./results/airdrop_pubKeys.json', {encoding:'utf8', flag:'r'}));
    keypair = pathToWallet;
    PRICE_PER_ITEM = pricePerItem;
    from =  web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync(keypair).toString())));
    arr = list ;
    data = [];
    error = []
    connection = new web3.Connection(web3.clusterApiUrl(env));;
    processChunk();
}


async function processChunk() {
     for (const item of list) {
        try{
            var success = {};
            var to = item.pubKey;
            var transaction = new web3.Transaction().add(
                web3.SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                //@ts-ignore
                lamports: PRICE_PER_ITEM * item.count * web3.LAMPORTS_PER_SOL,
                })
            );
            // Sign transaction, broadcast, and confirm
            var signature = await web3.sendAndConfirmTransaction(
                connection,
                transaction,
                [from]
            );
            //@ts-ignore
            success.signature = signature;
            //@ts-ignore
            success.pubKey  = to;
            //@ts-ignore
            success.sol = PRICE_PER_ITEM * item.count;
            
            data.push(success);
        
            console.log(signature);
        
            fs.writeFileSync("./results/transaction.json", JSON.stringify(data));
            setTimeout(() => {},2000);
     }  
      catch(ex) {
        console.log("Error : "+ ex);
          var err = {};
          //@ts-ignore
          err.pubKey  = to;
          //@ts-ignore
          err.sol = PRICE_PER_ITEM * item.count;
          //@ts-ignore
          err.error = ex.message;
          
          error.push(err);
        fs.writeFileSync("./results/error.json", JSON.stringify(error));
      }
    }
}



