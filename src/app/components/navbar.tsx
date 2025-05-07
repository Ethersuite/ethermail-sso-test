'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  EtherMailSignInOnSuccessEvent,
  EtherMailTokenErrorEvent,
  SSOPermissionType,
} from '@/intefaces/web3.interfaces';
import jwt from 'jsonwebtoken';
import { EtherMailProvider } from '@ethermail/ethermail-wallet-provider';
import { BrowserProvider } from 'ethers';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { _web3Provider, web3ProviderSlice } from '@/lib/reducers/web3ProviderSlice';
import { _ethermailProvider } from '@/lib/reducers/ethermailProviderSlice';
import { _loginDataProvider } from '@/lib/reducers/loginDataProviderSlice';
import Script from 'next/script';
import { Chain } from '@/intefaces/web3.interfaces';
import { usePathname, useRouter } from 'next/navigation';
import { EthermailLoginData } from '@/intefaces/ethermail.interfaces';
import Web3 from "web3";
import { _web3TestProvider } from '@/lib/reducers/web3TestProviderSlice';
import { JwtUtils } from '@/utils/jwt.utils';

export default function NavBar() {
  const router = useRouter();
  const path = usePathname();

  const web3Provider = useAppSelector(state => state.web3Provider.value) as BrowserProvider | undefined;
  const ethermailProvider = useAppSelector(state => state.ethermailProvider.value) as EtherMailProvider | undefined;
  const loginData = useAppSelector(state => state.loginData.value) as EthermailLoginData | undefined;
  const dispatch = useAppDispatch();

  const [ssoPermission, setSsoPermission] = useState('write');
  const [chains, setChains] = useState<Chain[]>([{ name: 'Ethereum', chainId: 1 }, {
    name: 'Polygon',
    chainId: 137,
  }, { name: 'Arbitrum', chainId: 42161 },
    { name: 'Sepolia', chainId: 11155111}
  ]);
  const [chain, setChain] = useState<Chain | undefined>();
  const [loginType, setLoginType] = useState('wallet');

  useEffect(() => {
    toast.success('Setting Event Listeners!');
    window.addEventListener('EtherMailSignInOnSuccess', async (event) => {
      const __loginEvent = event as EtherMailSignInOnSuccessEvent;

      const jwtUtils = new JwtUtils();

      const __sessionToken = __loginEvent.detail.token;

      // const validToken = await jwtUtils.verifyToken(__sessionToken);
      // if (!validToken) {
      //   throw new Error('Invalid Token!');
      // }

      const __loginData = jwtUtils.decodeToken(__sessionToken) as EthermailLoginData;
      console.log(__loginData);

      const __ethermailProvider = new EtherMailProvider({
        websocketServer: `wss://${process.env.NEXT_PUBLIC_ETHERMAIL_API_DOMAIN}/events`,
        appUrl: `https://${process.env.NEXT_PUBLIC_ETHERMAIL_DOMAIN}`,
      });
      const __browserProvider = new BrowserProvider(__ethermailProvider);

      const web3 = new Web3(__ethermailProvider);

      __ethermailProvider.on('disconnect', () => {
        toast('Disconnect event heard!');
      });

      __ethermailProvider.on('chainChanged', () => {
        toast('Changed chain event heard!');
      });

      __ethermailProvider.on('message', () => {
        toast('Message event heard!');
      });

      dispatch(_loginDataProvider.setData(__loginData as EthermailLoginData));
      dispatch(_ethermailProvider.setProvider(__ethermailProvider));
      dispatch(_web3Provider.setProvider(__browserProvider));
      dispatch(_web3TestProvider.setProvider(web3));
    });

    window.addEventListener('EtherMailTokenError', (event: Event) => {
      console.log(event);
      const errorEvent = event as EtherMailTokenErrorEvent;
      if (errorEvent.detail.type === 'expired') {
        toast.error('Expired Session!');
      } else if (errorEvent.detail.type === 'permissions') {
        toast.error('Permissions Error!');
      }
    });
  }, []);

  function handleSSOPermissionChange(event: React.ChangeEvent<HTMLSelectElement>) {
    try {
      const selectedValue = event.target.value;

      if (!selectedValue) throw Error('Must select a valid permission');

      setSsoPermission(selectedValue as SSOPermissionType);
      router.refresh();
      toast.success('SSO Permissions Changed!');
    } catch (err: any) {
      toast.error(err.message);
      console.log(err);
    }
  }

  async function handleChainChange(event: React.ChangeEvent<HTMLSelectElement>) {
    try {
      const chainId = +event.target.value;

      if (!ethermailProvider) throw new Error('Connect wallet before');

      await ethermailProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainId }],
      });

      setChain(chains.find(chain => chain.chainId === chainId) ?? undefined);
      toast.success('Chain changed!');
    } catch (err: any) {
      event.target.value = '';
      toast.error(err.message);
      console.log(err);
    }
  }

  async function handleDisconnect() {
    try {
      if (!ethermailProvider) throw new Error('No Provider!');


      await (ethermailProvider as EtherMailProvider).disconnect();

      dispatch(_web3Provider.reset());
      dispatch(_ethermailProvider.reset());
      dispatch(_loginDataProvider.reset());
      toast.success('Wallet disconnected!');
    } catch (err: any) {
      toast.error(err.message);
      console.log(err);
    }
  }

  function handlePageChange(event: React.ChangeEvent<HTMLSelectElement>) {
    try {
      const newPage = event.target.value;

      if (newPage === path) throw new Error('Already on selected page');

      router.replace(newPage);
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    }
  }

  function handleLoginTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setLoginType(event.target.value);
  }

  return (
    <>
      <nav className="flex justify-between p-6">
        <div>
          <h1>EtherMail SSO Test</h1>
        </div>
        <div className="flex items-center justify-between gap-4 text-black">
          <div className="flex gap-2">
            <select onChange={handlePageChange}>
              <option key="labelOption" value="">--- Change Page ---</option>
              {
                ['/', '/token', '/nfts'].map(page => {
                  return <option key={'page-' + page}
                                 value={page}>{page === '/' ? 'Home' : page.slice(1)}{page === path ? ' (Current)' : ''}</option>;
                })
              }
            </select>
            {loginData ?
              '' :
              <select onChange={handleSSOPermissionChange}>
                <option key="labelOption" value="">--- Change SSO Permissions ---</option>
                {
                  ['write', 'read', 'none'].map(permission => {
                    return <option key={'ssoOption-' + permission}
                                   value={permission}>{permission}{ssoPermission === permission ? ' (Current)' : ''}</option>;
                  })
                }
              </select>
            }
            <select onChange={handleChainChange}>
              <option key="labelOption" value="">--- Change Chain ---</option>
              {
                chains.map(_chain => {
                  return <option key={'chain-' + _chain.chainId}
                                 value={_chain.chainId}>{_chain.name + '-' + _chain.chainId}{_chain.chainId === chain?.chainId ? ' (Current)' : ''}</option>;
                })
              }
            </select>
            <select onChange={handleLoginTypeChange} value={loginType}>
              <option value="wallet">Wallet</option>
              <option value="sso">SSO</option>
            </select>
          </div>
          <div>
            {loginData ?
              <div className="flex justify-between gap-2">
                <div className="flex flex-col gap-2">
                  <h3>EtherMail Signer:</h3>
                  <p>{loginData.wallet}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <h3>Signer Permissions:</h3>
                  <p>{loginData.permissions}</p>
                </div>
                <button onClick={handleDisconnect}>Disconnect</button>
              </div>
              :
              <ethermail-login style={{
                width: '150px',
                backgroundColor: 'black',
                color: 'white',
                fontWeight: 700,
                borderRadius: '1rem',
              }} widget={process.env.NEXT_PUBLIC_WIDGET_ID} type={loginType}
                               permissions={ssoPermission} label="Connect Wallet"></ethermail-login>
            }
          </div>
        </div>
      </nav>
    </>
  );
}