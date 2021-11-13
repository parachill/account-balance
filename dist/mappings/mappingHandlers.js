"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleEvent = void 0;
const types_1 = require("../types");
function createSumBalance(accountId) {
    const entity = new types_1.Account(accountId);
    entity.totalBalance = BigInt(0);
    return entity;
}
async function handleEvent(event) {
    const { event: { data: [account, balance] } } = event;
    //Create a new Account entity with ID using block hash
    //let entity = new Account(event.extrinsic.block.block.header.hash.toString());
    let entity = await types_1.Account.get(account.toString());
    if (entity === undefined) {
        // in early stage of kusama, some validators didn't need to bond to start staking
        // to not break our code, we will create a SumReward record for them and log them in NoBondRecordAccount
        entity = createSumBalance(account.toString());
    }
    //let entity = await Account.get(account.toString());
    // Assign the Polkadot address to the account field
    entity.account = account.toString();
    // Assign the balance to the balance field "type cast as Balance"
    entity.totalBalance = entity.totalBalance + balance.toBigInt();
    await entity.save();
}
exports.handleEvent = handleEvent;
