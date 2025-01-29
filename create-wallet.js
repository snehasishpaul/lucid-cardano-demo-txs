import { Lucid, Blockfrost } from 'lucid-cardano';
import * as fs from 'fs/promises';

import dotenv from 'dotenv';

dotenv.config();

const BLOCKFROST_API = process.env.BLOCKFROST_API;
const PROJECT_ID = process.env.PROJECT_ID;

const createWallet = async () => {
  try {
    // Initialize Lucid instance with Blockfrost provider for testnet or mainnet
    const lucid = await Lucid.new(
      new Blockfrost(BLOCKFROST_API, PROJECT_ID),
      "Preprod",
    );

    // Generate private key
    console.log(lucid.utils.generatePrivateKey());
    const privateKey = lucid.utils.generatePrivateKey(); // Bech32 encoded private key
    // console.log(privateKey);

    // Save private key to a file
    await fs.writeFile('wallet2.sk', privateKey);

    // Get address from private key
    if (privateKey) {
      var wallet = await lucid.selectWalletFromPrivateKey(privateKey);
    }
    const address = await wallet.wallet.address();

    // Save address to a file
    await fs.writeFile('wallet2.addr', address);

    console.log('Wallet generated successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

createWallet();

