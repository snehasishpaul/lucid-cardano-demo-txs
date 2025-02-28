import { Lucid, Blockfrost, fromText } from "lucid-cardano";
import dotenv from "dotenv";

dotenv.config();

const BLOCKFROST_API = process.env.BLOCKFROST_API;
const PROJECT_ID = process.env.PROJECT_ID;

const mintNft = async () => {
  try {
    const lucid = await Lucid.new(
      new Blockfrost(BLOCKFROST_API, PROJECT_ID),
      "Preprod" // Change to "Mainnet" if deploying live
    );

    const mnemonic = process.env.SEED_PHRASE;

    lucid.selectWalletFromSeed(mnemonic);

    const { paymentCredential } = lucid.utils.getAddressDetails(
      await lucid.wallet.address()
    );

    // ✅ Define the Minting Policy
    const mintingPolicy = lucid.utils.nativeScriptFromJson({
      type: "all",
      scripts: [
        { type: "sig", keyHash: paymentCredential.hash }, // Requires wallet signature
        {
          type: "before",
          slot: lucid.utils.unixTimeToSlot(Date.now() + 1000000), // Time-lock
        },
      ],
    });

    // ✅ Define NFT Details
    const asset_name = "LappyBearNFT";
    const policyId = lucid.utils.mintingPolicyToId(mintingPolicy);
    const unit = policyId + fromText(asset_name);

    const metadata = {
      [policyId]: {
        [asset_name]: {
          name: "Bear with a Laptop NFT",
          description: "Intellectual Bear using Laptop",
          email: "weishenpov@gmail.com",
          id: "1",
          image: "ipfs://QmQ2uwK3AiPCGPT3JS2F7yBYit89rc9muS1P1DEuBBPk9y", // ✅ Add ipfs://
          files: [
            {
              mediaType: "image/png", // ✅ Ensure correct MIME type
              name: "Intellectual Bear using Laptop",
              src: "ipfs://QmQ2uwK3AiPCGPT3JS2F7yBYit89rc9muS1P1DEuBBPk9y", // ✅ Explicit file link
              image: "ipfs://QmQ2uwK3AiPCGPT3JS2F7yBYit89rc9muS1P1DEuBBPk9y",
            },
          ],
        },
      },
    };

    // ✅ Build and Submit the Transaction
    const tx = await lucid
      .newTx()
      .mintAssets({ [unit]: BigInt(1) }) // Mint 1 NFT
      .attachMetadata(721, metadata) // ✅ Correct metadata format
      .validTo(Date.now() + 200000) // Transaction expiry
      .attachMintingPolicy(mintingPolicy) // Attach policy
      .complete();

    const signedTx = await tx.sign().complete();
    const txHash = await signedTx.submit();

    console.log(`✅ NFT Minted Successfully! txHash: ${txHash}`);
  } catch (error) {
    console.error("🚨 Error minting NFT:", error);
  }
};

// Start Minting
mintNft();
