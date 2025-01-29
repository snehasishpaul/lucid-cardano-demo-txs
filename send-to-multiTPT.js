import { Lucid, Blockfrost } from 'lucid-cardano';
import * as fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();

const BLOCKFROST_API = process.env.BLOCKFROST_API;
const PROJECT_ID = process.env.PROJECT_ID;
const WALLET1_SK_PATH = process.env.WALLET1_SK_PATH;
const WALLET2_ADDR_PATH = process.env.WALLET2_ADDR_PATH;
const ETERNL_WALLET_ADDR = process.env.ETERNL_WALLET_ADDR;

const sendToMultiMetadata = async () => {
    try {
        // Initialize Lucid instance with Blockfrost provider for testnet or mainnet
        const lucid = await Lucid.new(
            new Blockfrost(BLOCKFROST_API, PROJECT_ID),
            "Preprod",
        );

        const privateKey = await fs.readFile(WALLET1_SK_PATH, "utf-8");
        console.log(privateKey);

        lucid.selectWalletFromPrivateKey(privateKey);

        const wallet2Addr = await fs.readFile(WALLET2_ADDR_PATH, "utf-8");
        console.log(wallet2Addr);

        const metadata = "cardano demo metadata";

        const tx = await lucid.newTx()
            .payToAddress(wallet2Addr, { lovelace: 10000000n })
            .payToAddress(wallet2Addr, { lovelace: 10000000n })
            .payToAddress(wallet2Addr, { lovelace: 10000000n })
            .payToAddress(wallet2Addr, { lovelace: 10000000n })
            .payToAddress(wallet2Addr, { lovelace: 10000000n })
            .payToAddress(ETERNL_WALLET_ADDR.trim(), { lovelace: 10000000n }) //eternl wallet
            .attachMetadata(674, metadata)  //label , metadata
            .complete();

        const signedTx = await tx.sign().complete();

        const txHash = await signedTx.submit();

        if(txHash) {
            console.log(`Transaction with multiple successful with metadata: txHash: ${txHash}`);
        } else {
            console.log("Transaction Failed...");
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

sendToMultiMetadata();
