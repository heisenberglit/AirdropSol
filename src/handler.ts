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
    fs.writeFileSync("./results/airdrop_pubKeys.json", JSON.stringify(data));
}

export const totalItemCounts = () => {
    var data = JSON.parse(fs.readFileSync('./results/airdrop_pubKeys.json', {encoding:'utf8', flag:'r'}));
    //@ts-ignore
    console.log(data.reduce(function (accumulator, item) {
        return accumulator + item.count;
      }, 0))
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
                   console.log("Balance / Total Items (In SOL) " + ((i/count)/web3.LAMPORTS_PER_SOL))
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
