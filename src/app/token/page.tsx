"use client"
import { ethers, BrowserProvider } from 'ethers';
import { Toaster, toast } from "react-hot-toast";
import { useAppSelector } from "@/lib/hooks";
import { Web3Utils } from "@/utils/web3.utils";

export default function TokenPage() {
  const web3Provider = useAppSelector(state => state.web3Provider.value) as BrowserProvider | undefined;
  const ethermailProvider = useAppSelector(state => state.ethermailProvider.value) as BrowserProvider | undefined;
  const web3Utils = new Web3Utils();
  const signMessage = "Sign message with SSO on Tokens!";

  return (
    <>
      <Toaster />
      <main className="flex min-h-screen flex-col items-center p-16 gap-2">
        <h1>Token Page:</h1>
        <div className="flex flex-col gap-4">
          {web3Provider ?
            <section className="flex flex-col">
              <div>
                <div className="flex flex-col align-center justify-center gap-4">
                  <h1>Actions:</h1>
                  <div>
                    <h4>Sign Message:</h4>
                    <button onClick={async () => {await web3Utils.handleSignMessage(signMessage, web3Provider)}}>Sign Message</button>
                  </div>
                  <div>
                    <h4>Claim Token:</h4>
                    <button onClick={async () => {await web3Utils.handleSignMessage(signMessage, web3Provider)}}>Claim</button>
                  </div>
                </div>
              </div>
            </section>
            :
            <section>
              <h3>Connect Wallet Please...</h3>
            </section>
          }
        </div>
      </main>
    </>
  );
}
