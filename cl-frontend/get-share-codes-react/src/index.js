import React from 'react';
import ReactDOM from 'react-dom';
import { ShareCodesPage } from './share';


function App() {
    return(
        <ShareCodesPage/>
    );
}

const root = ReactDOM.createRoot(
    document.getElementById('react-target-2')
);

root.render(App());