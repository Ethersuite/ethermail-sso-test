'use client';
import {  BrowserProvider } from 'ethers';
import { Toaster } from 'react-hot-toast';
import { useAppSelector } from '@/lib/hooks';
import { Web3Utils } from '@/utils/web3.utils';
import { useState } from 'react';
import WebSocketProvider from 'web3-providers-ws';

export default function Home() {
  const web3Provider = useAppSelector(state => state.web3Provider.value) as BrowserProvider | undefined;
  const webTest3Provider = useAppSelector(state => state.web3TestProvider.value) as WebSocketProvider | undefined;
  const loginData = useAppSelector(state => state.loginData.value);
  const web3Utils = new Web3Utils();
  const signMessage = 'Sign message with SSO';

  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  const isWalletLogin = loginData && loginData.type === 'wallet';

  return (
    <>
      <Toaster />
      <main className="flex min-h-screen flex-col items-center p-16 gap-2">
        <div className="flex flex-col gap-4">
          {web3Provider ?
            <section className="flex flex-col">
              <div>
                <div className="flex flex-col align-center justify-center gap-4">
                  <h1>Actions:</h1>
                  {isWalletLogin && (
                    <div>
                      <div>
                        <h4>Sign Message:</h4>
                        <button onClick={async () => {
                          await web3Utils.handleSignMessage(signMessage, web3Provider);
                        }}>Sign Message
                        </button>
                      </div>

                      <div>
                        <h4>Send Transaction:</h4>
                        <div>
                          <input
                            type="text"
                            placeholder="Recipient Address"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="text-black"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="text-black"
                          />
                        </div>
                        <button onClick={async () => {
                          await web3Utils.handleSendTransaction(recipient, amount, web3Provider);
                        }}>Send Transaction
                        </button>
                      </div>

                      <div>
                        <button onClick={async () => {
                          await web3Utils.handleSendTokens(recipient, amount, web3Provider);
                        }}>Send Tokens
                        </button>
                      </div>

                      <div>
                        <h4>Sign Typed Data v4:</h4>
                        <button onClick={async () => {
                          const typedData = {
                            types: {
                              EIP712Domain: [
                                { name: 'name', type: 'string' },
                                { name: 'version', type: 'string' },
                              ],
                              Person: [
                                { name: 'name', type: 'string' },
                                { name: 'wallet', type: 'address' },
                              ],
                            },
                            primaryType: 'Person',
                            domain: {
                              name: 'Ether Mail',
                              version: '1',
                            },
                            message: {
                              name: 'John Doe',
                              wallet: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
                              date: Date.now()
                            },
                          };
                          await web3Utils.handleSignTypedData(typedData, web3Provider);
                        }}>Sign Typed Data v4
                        </button>
                      </div>
                    </div>
                  )}
                  <div>
                    <h4>Login Data:</h4>
                    <textarea
                      readOnly
                      value={JSON.stringify(loginData, null, 2)}
                      rows={5}
                      cols={30}
                      className="text-black"
                    />
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
