import React from 'react';
import ReactDOM from 'react-dom';
import { PromoAuthenticate } from './promoAuthenticate';


function App() {
    return(
        <PromoAuthenticate/>
    );
}

const root = ReactDOM.createRoot(
    document.getElementById('react-target')
);

root.render(App());