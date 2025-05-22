"use client";
import { useWalletConnectClient } from "@xrpl-walletconnect/react";
import { mainnet, testnet, devnet } from "@xrpl-walletconnect/core";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const { connect, disconnect, accounts, chains, setChains, signTransaction } =
    useWalletConnectClient();
  const [result, setResult] = useState<Record<string, any>>();
  const [transactionData, setTransactionData] = useState<string>("");
  const network = [mainnet, testnet, devnet];

  useEffect(() => {
    setChains([testnet.id]);
  }, [setChains]);

  const selectNetwork = (chainId: string) => {
    setChains([chainId]);
  };

  const testTransaction = async () => {
    try {
      const parsedJson = JSON.parse(transactionData);

      setResult(undefined);
      const result = await signTransaction(chains[0], parsedJson);
      setResult(result);
    } catch (e) {
      alert("error parsing json");
      console.log(e);
    }
  };

  useEffect(() => {
    setResult(undefined);
  }, [accounts]);

  return (
    <main className="flex flex-col min-h-screen gap-2 p-24 justify-center items-center">
      <Image
        width="192"
        height="133"
        src="walletconnect.svg"
        alt="walletconnect"
      />
      <div className="m-10 text-center">
        <span className="text-4xl md:text-6xl">XRPL WalletConnect</span>
      </div>
      <div className="text-end">
        {network.map((net) => (
          <div key={net.id} className="form-control">
            <label className="label cursor-pointer gap-2">
              <span className="label-text">{net.name}</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={chains.includes(net.id)}
                onChange={() => selectNetwork(net.id)}
              />
            </label>
          </div>
        ))}
      </div>

      <div className="flex gap-2 m-2">
        <button
          className="btn btn-primary"
          disabled={!chains.length || !!accounts.length}
          onClick={() => connect()}
        >
          Connect
        </button>
        <button
          className="btn btn-secondary"
          disabled={!accounts.length}
          onClick={() => disconnect()}
        >
          Disconnect
        </button>
      </div>
      {accounts.length > 0 && (
        <div className="text-center">
          <span className="text-xl">Connected Accounts:</span>
          {accounts.map((account) => (
            <div key={account}>{account}</div>
          ))}
          <input onChange={(e) => setTransactionData(e.target.value)}></input>
          <button
            className="btn btn-accent mt-2"
            onClick={() => testTransaction()}
          >
            Create Transaction
          </button>
        </div>
      )}
      {result && (
        <div className="max-w-full">
          <pre className="overflow-x-scroll ">
            <code>{JSON.stringify(result, null, 2)}</code>
          </pre>
        </div>
      )}
    </main>
  );
}
