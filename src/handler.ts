import fs from "fs";
var web3 = require("@solana/web3.js");

export const convertToCompatibleFormat = (pathToFile)  => {
    var list =JSON.parse(fs.readFileSync(pathToFile, {encoding:'utf8', flag:'r'}))
    var data = [];
    const propertyNames = Object.keys(list);
    for (const item of propertyNames) {
      var c = {};
      //@ts-ignore
      c.pubKey = item;
      //@ts-ignore
      c.count = list[item]['mintTokens'].length;
      data.push(c)
    }

    if (!fs.existsSync("./results")) {
        fs.mkdirSync("./results");
      }
      
    fs.writeFileSync("./results/airdrop_pubKeys.json", JSON.stringify(data));
}

export const totalItemCounts = () => {
    var data = JSON.parse(fs.readFileSync('./results/airdrop_pubKeys.json', {encoding:'utf8', flag:'r'}));
    //@ts-ignore
    console.log(data.reduce(function (accumulator, item) {
        return accumulator + item.count;
      }, 0))
}

export const countTotalWallet = () => {
    var data = JSON.parse(fs.readFileSync('./results/airdrop_pubKeys.json', {encoding:'utf8', flag:'r'}));
    //@ts-ignore
    console.log("Total wallets to be airdropped : " + data.length);
}


export const removeFromList = (pathToFile) => {
    var removeData = JSON.parse(fs.readFileSync(pathToFile, {encoding:'utf8', flag:'r'}));
    var data = JSON.parse(fs.readFileSync('./results/airdrop_pubKeys.json', {encoding:'utf8', flag:'r'}));
    data = data.filter(function( obj ) {
        return removeData.indexOf(obj.pubKey) < 0 ;
    });

    fs.writeFileSync("./results/airdrop_pubKeys.json", JSON.stringify(data));
}

export const calculatePerWallet = (keypairPath,env) => {
    var data = JSON.parse(fs.readFileSync('./results/airdrop_pubKeys.json', {encoding:'utf8', flag:'r'}));
    //@ts-ignore
    var count =data.reduce(function (accumulator, item) {
        return accumulator + item.count;
      }, 0);
    var wallet = web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync(keypairPath).toString())));
    var balance = new web3.Connection(web3.clusterApiUrl(env)).getBalance(wallet.publicKey).then(
               (i) => {
                   console.log("Balance " + i/ web3.LAMPORTS_PER_SOL);
                   console.log("Items " + count);
                   console.log("Each wallet will receive per Item (In SOL) (PS - Save this and provide at do_airdrop cmd)" + ((i/count)/web3.LAMPORTS_PER_SOL))
                }
    );
}

export const verifyBalance = (keypairPath,env) => {
    var data = JSON.parse(fs.readFileSync('./results/airdrop_pubKeys.json', {encoding:'utf8', flag:'r'}));
    //@ts-ignore
    var count =data.reduce(function (accumulator, item) {
        return accumulator + item.count;
      }, 0);
    var wallet = web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync(keypairPath).toString())));
    var balance = new web3.Connection(web3.clusterApiUrl(env)).getBalance(wallet.publicKey).then(
        (i) => {
                var totalSum = (i/count)/web3.LAMPORTS_PER_SOL;
                var total = data.map(i => i.count * totalSum);
                console.log("Total - " + total.reduce(function (accumulator, item) {
                    return accumulator + item;
                  }, 0))
        }
    );
}


export const removeSuccess = () => {
    var data = JSON.parse(fs.readFileSync('./results/airdrop_pubKeys.json', {encoding:'utf8', flag:'r'}));
    var transaction =  JSON.parse(fs.readFileSync('./results/transaction.json', {encoding:'utf8', flag:'r'}));
    var error = JSON.parse(fs.readFileSync('./results/error.json', {encoding:'utf8', flag:'r'}));
    var tx = transaction.map(i => i.pubKey);
    //@ts-ignore
    data = data.filter(function(obj) {
        return tx.indexOf(obj.pubKey) < 0 ;
    });

    var removeTx = error.filter((k) => {
       return k.error.includes("Check signature");
    });
    var err = removeTx.map(i => i.pubKey);
    data = data.filter(function(obj) {
        return err.indexOf(obj.pubKey) < 0 ;
    });

    fs.writeFileSync("./results/airdrop_error.json", JSON.stringify(removeTx));
    fs.writeFileSync("./results/airdrop_pubKeys.json", JSON.stringify(data));
    
}

export const verifyCurrentToGiveout = (price) => {
    var data = JSON.parse(fs.readFileSync('./results/airdrop_pubKeys.json', {encoding:'utf8', flag:'r'}));
    //@ts-ignore
    var count =data.reduce(function (accumulator, item) {
        return accumulator + item.count;
      }, 0);
      var totalSum = price;
      var total = data.map(i => i.count * totalSum);
      console.log("Total - " + total.reduce(function (accumulator, item) {
          return accumulator + item;
        }, 0))
}


export const sendSolToWallet = (pricePerItem, keypairPath) => {
    var res, isCreateNewFile = false ;
    if (!fs.existsSync('./results/response.json')) {
        var data = [];
        fs.writeFile('./results/response.json', JSON.stringify(data), function (err) {
            if (err) throw err;
          });
        res = [];
        isCreateNewFile = true;
    }

    console.log("Send to per wallet per item : " + pricePerItem + " SOL");
    var items = JSON.parse(fs.readFileSync('./results/airdrop_pubKeys.json', {encoding:'utf8', flag:'r'}));
    console.log("Total to run before removing success ones: " + items.length);
    

    var res = isCreateNewFile ? res : JSON.parse(fs.readFileSync("./results/response.json", {encoding:'utf8', flag:'r'}));
    if(res.length){
        var filterSuccess = res.filter(function(obj) {
            return obj.isSuccess;
        });
        
        var removeFiltered = filterSuccess.map(i => i.pubKey);

        console.log("Total Success in response.json : " + removeFiltered.length);

        items = items.filter(function( obj ) {
            return removeFiltered.indexOf(obj.pubKey) < 0 ;
        });

        console.log("Total to run final : " + items.length);
    }

    for (const item of items){
        var price = pricePerItem * item.count  //IN SOL 
        try{
            var result = require('child_process').execSync(`solana transfer -k ${keypairPath} ${item.pubKey} ${price} --allow-unfunded-recipient`);
            var response = {}

            //@ts-ignore
            response.pubKey = item.pubKey;
            //@ts-ignore
            response.price = price ;
            //@ts-ignore
            response.signature = result.toString();
             //@ts-ignore
            response.isSuccess = true;
            console.log("Airdropped : "+ price + " SOL to "+ item.pubKey + " for " + item.count +" items");
            res.push(response);
        }catch(ex){
            var response = {}
            //@ts-ignore
            response.pubKey = item.pubKey;
            //@ts-ignore
            response.price = price ;
            //@ts-ignore
            response.error = ex.message.toString() + ex.output[2].toString();
            //@ts-ignore
            response.isSuccess = false;
            console.log("PubKey : " + item.pubKey);
            res.push(response);
       }
       fs.writeFileSync("./results/response.json", JSON.stringify(res));
    }
}
