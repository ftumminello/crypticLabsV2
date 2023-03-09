import React from 'react';
import ReactDOM from 'react-dom';
import { PromoAuthenticate } from './promoAuthenticate';
import { WagmiConfig, createClient } from 'wagmi'
import { getDefaultProvider } from 'ethers'

 
const client = createClient({
    autoConnect: false,
    provider: getDefaultProvider(),
  })

function App() {
    return(
        <WagmiConfig client={client}>
            <PromoAuthenticate/>
        </WagmiConfig>
    );
}

const root = ReactDOM.createRoot(
    document.getElementById('react-target')
);

root.render(App());