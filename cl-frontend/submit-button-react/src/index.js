import React from 'react';
import ReactDOM from 'react-dom';
import { SubmitButton } from './apply';


function App() {
    return(
        <SubmitButton/>
    );
}

const root = ReactDOM.createRoot(
    document.getElementById('react-target-3')
);

root.render(App());