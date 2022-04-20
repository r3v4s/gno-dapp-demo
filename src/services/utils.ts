import { coins, Token } from "../config";
import { StdSignDoc, StdSignature } from "@cosmjs/amino";

export function formatAddress(wallet: string): string {
  return ellideMiddle(wallet, 24);
}

export function ellideMiddle(str: string, maxOutLen: number): string {
  if (str.length <= maxOutLen) {
    return str;
  }
  const ellide = "…";
  const frontLen = Math.ceil((maxOutLen - ellide.length) / 2);
  const tailLen = Math.floor((maxOutLen - ellide.length) / 2);
  return str.slice(0, frontLen) + ellide + str.slice(str.length - tailLen, str.length);
}

export function getTokenConfig(denom: string): Token|undefined {
  return coins.find((c: any) => c.denom === denom);
}

export function formatPrice(price: {amount: string, denom: string}): string {
  const coin = getTokenConfig(price.denom)!;
  const amount = parseInt(price.amount) / Math.pow(10, coin.decimals);

  return amount + " " + coin.name;
}

export function toMinDenom(amount: number, denom: string): string {
  const coin = getTokenConfig(denom)!;
  return Math.floor(amount * Math.pow(10, coin.decimals)).toString();
}

export function makeGnoStdTx(
  content: StdSignDoc,
  signature: StdSignature,
) {

  return {
    msg: content.msgs.map((m: any) => ({
      '@type': m.type,
      ...m.value
    })),
    fee: {
      gas_wanted: content.fee.gas,
      gas_fee: `${content.fee.amount[0].amount}${content.fee.amount[0].denom}`,
    },
    signatures: [
      {
        pub_key: {
          "@type": "/tm.PubKeySecp256k1",
          value: signature.pub_key.value,
        },
        signature: signature.signature,
      }
    ],
    memo: content.memo,
  };
}