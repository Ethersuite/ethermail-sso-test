'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import NavBar from '@/app/components/navbar';
import StoreProvider from '@/app/StoreProvider';
import { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    (function({ ...args }) {
      if (!document.getElementById('ethermail-sdk-script')) {
        var p = document.createElement('script');
        p.id = 'ethermail-sdk-script';
        p.src = 'https://cdn-email.ethermail.io/sdk/v2/staging-ethermail.js';
        document.body.appendChild(p);
        p.setAttribute('a', args.afid);
        p.setAttribute('b', args.communityAlias);
        // @ts-ignore
        p.setAttribute('c', args.features);
      }
    })({
      afid: '65de00d53b06f3268d27ecbc',
      communityAlias: 'ethermail',
      features: ['login'],
    });
  }, []);

  return (
    <html lang="en">
    <body className={inter.className}>
    <StoreProvider>
      <div>
        <NavBar />
        {children}
      </div>
    </StoreProvider>
    </body>
    </html>
  );
}