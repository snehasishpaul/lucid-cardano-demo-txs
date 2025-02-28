// addr_test1qzd98ehvr3uxud05y5ep63ed6pnx264vqafylygsagns2cyfrmawlluj9a4z3jx44usu8wh6l537dyk02c8c0yvdtcgsathcjr
// 9a53e6ec1c786e35f425321d472dd066656aac07524f9110ea270560

import { Lucid } from "lucid-cardano";

const address =
  "addr_test1qzd98ehvr3uxud05y5ep63ed6pnx264vqafylygsagns2cyfrmawlluj9a4z3jx44usu8wh6l537dyk02c8c0yvdtcgsathcjr";
const lucid = await Lucid.new();
const hex = lucid.utils.getAddressDetails(address).paymentCredential.hash;

console.log("Hex:", hex);
