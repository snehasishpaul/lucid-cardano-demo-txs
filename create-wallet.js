import { Lucid, Blockfrost } from "lucid-cardano";
import * as fs from "fs/promises";

import dotenv from "dotenv";

dotenv.config();

const BLOCKFROST_API = process.env.BLOCKFROST_API;
const PROJECT_ID = process.env.PROJECT_ID;

const createWallet = async () => {
  try {
    // Initialize Lucid instance with Blockfrost provider for testnet or mainnet
    const lucid = await Lucid.new(
      new Blockfrost(BLOCKFROST_API, PROJECT_ID),
      "Preprod"
    );

    // console.log(typeof lucid)
    // return;

    // Generate private key
    const privateKey = lucid.utils.generatePrivateKey(); // Bech32 encoded private key
    console.log(privateKey);

    // const restoredWallet = lucid.selectWalletFromSeed(process.env.SEED_PHRASE);
    // // console.log(restoredWallet);
    // const walletAddress = await lucid.wallet.address();
    // const balance = await lucid.wallet.getUtxos();
    // console.log(walletAddress);
    // console.log(balance);
    // return;

    // Save private key to a file
    await fs.writeFile("wallet2.sk", privateKey);

    // Get address from private key
    if (privateKey) {
      var wallet = await lucid.selectWalletFromPrivateKey(privateKey);
    }
    const address = await wallet.wallet.address();

    // Save address to a file
    await fs.writeFile("wallet2.addr", address);

    console.log("Wallet generated successfully!");
  } catch (error) {
    console.error("Error:", error);
  }
};

createWallet();
