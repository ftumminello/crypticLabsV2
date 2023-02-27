import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectWalletView } from '';


function App() {
    return(
        <ConnectWalletView />
    );
}

const root = ReactDOM.createRoot(
    document.getElementById('react-target')
);

root.render(App());