import fs from "fs";

export const sendSPLToWallet = (filepath,keypairPath) => {
    var res, isCreateNewFile = false ;
    if (!fs.existsSync('./results/airdrop_spl.json')) {
        var data = [];
        fs.writeFile('./results/airdrop_spl.json', JSON.stringify(data), function (err) {
            if (err) throw err;
          });
        res = [];
        isCreateNewFile = true;
    }

    var items = JSON.parse(fs.readFileSync(filepath, {encoding:'utf8', flag:'r'}));
    console.log("Total to run before removing success ones: " + items.length);
    

    var res = isCreateNewFile ? res : JSON.parse(fs.readFileSync("./results/airdrop_spl.json", {encoding:'utf8', flag:'r'}));

    for (const item of items) {

        var element = res.find((i) => {
            return i.address == item.address; 
        });

        if(element && element.isSuccess === true)
                continue;

        let response = {
                address : '',
                signature : '',
                isSuccess : true,
                error : ''
             }

        try {
            console.log(`spl-token transfer ${item.mint} 1 ${item.address} --owner ${keypairPath} --fund-recipient`);
             let result = require('child_process').execSync(`spl-token transfer ${item.mint} 1 ${item.address} --owner ${keypairPath} --fund-recipient`);
             response.address = item.address;
             response.signature = result.toString();
             response.isSuccess = true;
             res.push(response);
        }
        catch(ex){
             response.address = item.address;
             response.error = ex.message.toString() + ex.output[2].toString();
             response.isSuccess = false;
             res.push(response);
        }
        fs.writeFileSync("./results/airdrop_log.json", JSON.stringify(res));
    }
}