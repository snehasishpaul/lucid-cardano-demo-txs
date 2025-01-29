import { Lucid, Blockfrost } from 'lucid-cardano';
import * as fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();

const BLOCKFROST_API = process.env.BLOCKFROST_API;
const PROJECT_ID = process.env.PROJECT_ID;
const WALLET1_SK_PATH = process.env.WALLET1_SK_PATH;
const WALLET2_ADDR_PATH = process.env.WALLET2_ADDR_PATH;

const sendTo = async () => {
    try {
        // Initialize Lucid instance with Blockfrost provider for testnet or mainnet
        const lucid = await Lucid.new(
            new Blockfrost(BLOCKFROST_API, PROJECT_ID),
            "Preprod",
        );

        const wallet1PrivateKey = await fs.readFile(WALLET1_SK_PATH, "utf-8");
        console.log("wallet1 privateKey: " +wallet1PrivateKey);

        lucid.selectWalletFromPrivateKey(wallet1PrivateKey);

        const wallet2Addr = await fs.readFile(WALLET2_ADDR_PATH, "utf-8");
        console.log("wallet2 address: " + wallet2Addr);

        const tx = await lucid.newTx()
            .payToAddress(wallet2Addr, { lovelace: 10000000n })
            .complete();

        const signedTx = await tx.sign().complete();

        const txHash = await signedTx.submit();

        if(txHash) {
            console.log(`Transaction successful: txHash: ${txHash}`);
        } else {
            console.log("Transaction Failed...");
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

sendTo();
