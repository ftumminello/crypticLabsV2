import React from 'react';
import ReactDOM from 'react-dom';
import { ShareCodesPage } from './share';


function App() {
    return(
        <ShareCodesPage></ShareCodesPage>
    );
}

const root = ReactDOM.createRoot(
    document.getElementById('react-target')
);

root.render(App());