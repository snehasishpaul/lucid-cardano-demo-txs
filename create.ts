import { Lucid, Blockfrost, WalletApi } from "lucid-cardano";
import * as fs from "fs/promises";
import * as dotenv from "dotenv";

dotenv.config();

const BLOCKFROST_API: string | undefined = process.env.BLOCKFROST_API;
const PROJECT_ID: string | undefined = process.env.PROJECT_ID;

if (!BLOCKFROST_API || !PROJECT_ID) {
  throw new Error(
    "BLOCKFROST_API or PROJECT_ID is missing in the environment variables."
  );
}

const createWallet = async (): Promise<void> => {
  try {
    // Initialize Lucid with Blockfrost provider (Preprod network)
    const lucid: Lucid = await Lucid.new(
      new Blockfrost(BLOCKFROST_API, PROJECT_ID),
      "Preprod"
    );

    console.log(lucid);
    return;
    // Generate private key
    const privateKey: string = lucid.utils.generatePrivateKey(); // Bech32 encoded private key

    // Save private key to a file
    await fs.writeFile("wallet2.sk", privateKey, "utf-8");

    // Get address from private key
    const wallet: any = await lucid.selectWalletFromPrivateKey(privateKey);
    const address: string = await wallet.wallet.address();

    // Save address to a file
    await fs.writeFile("wallet2.addr", address, "utf-8");

    console.log("Wallet generated successfully!");
  } catch (error) {
    console.error("Error:", error);
  }
};

// Execute the function
createWallet();
