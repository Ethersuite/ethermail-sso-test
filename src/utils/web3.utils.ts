import { toast } from 'react-hot-toast';
import { BrowserProvider, ethers, JsonRpcSigner } from 'ethers';

export class Web3Utils {
  constructor() {
  }

  public async handleSignMessage(message: string, web3Provider: BrowserProvider | undefined) {
    try {
      if (!web3Provider) throw Error('Need provider to sign!');

      const signer = await web3Provider.getSigner();

      if (!signer) throw Error('No signer!');

      const signedMessage = await signer.signMessage(message);
      toast.success(`Signed Message: ${signedMessage}`, { duration: 8000 });
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  public async handleSendTransaction(recipient: string, amount: string, web3Provider: BrowserProvider | undefined) {
    try {
      if (!web3Provider) throw Error('Need provider to send transaction!');

      const signer = await web3Provider.getSigner();

      if (!signer) throw Error('No signer!');

      const tx = await signer.sendTransaction({
        to: recipient,
        value: ethers.parseEther(amount),
      });

      toast.success(`Transaction Sent: ${tx}`, { duration: 8000 });
    } catch (err: any) {
      toast.error(err.message);
      console.log(err);
    }
  }

  public async handleSendTokens(recipient: string, amount: string, web3Provider: BrowserProvider) {
    try {
      const smartContractAddress = '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8'; // UDSC on sepolia

      if (!web3Provider) throw Error('Need provider to send transaction!');

      const erc20Abi = [
        {
          'constant': false,
          'inputs': [
            {
              'name': '_to',
              'type': 'address',
            },
            {
              'name': '_value',
              'type': 'uint256',
            },
          ],
          'name': 'transfer',
          'outputs': [
            {
              'name': '',
              'type': 'bool',
            },
          ],
          'payable': false,
          'stateMutability': 'nonpayable',
          'type': 'function',
        },
      ];

      const signer: JsonRpcSigner = await web3Provider.getSigner();

      const abi = new ethers.Interface(erc20Abi);
      const data = abi.encodeFunctionData('transfer', [recipient, amount]);

      const gasEstimate = await web3Provider.estimateGas({
        from: signer.address,
        to: recipient,
        data: data,
      });

      const tx = await signer.sendTransaction({
        to: smartContractAddress,
        data: data,
        gasLimit: gasEstimate,
        gasPrice: ethers.parseUnits('50', 'gwei'),
      });

      toast.success(`Sent: ${tx}`, { duration: 8000 });
    } catch (err: any) {
      toast.error(err.message);
      console.log(err);
    }
  }

  public async handleSignTypedData(data: any, web3Provider: BrowserProvider | undefined) {
    try {
      if (!web3Provider) throw Error('Need provider to sign!');

      const signer = await web3Provider.getSigner();

      if (!signer) throw Error('No signer!');

      const address = await signer.getAddress();
      const signature = await web3Provider.send('eth_signTypedData_v4', [address, JSON.stringify(data)]);

      toast.success(`Signed Typed Data: ${signature}`, { duration: 8000 });
    } catch (err: any) {
      toast.error(err.message);
      console.log(err);
    }
  }
}