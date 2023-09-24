import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThirdwebProvider, useContract } from '@thirdweb-dev/react';
import { ScrollSepoliaTestnet } from "@thirdweb-dev/chains";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThirdwebProvider activeChain={ ScrollSepoliaTestnet } 
      clientId="1e11f5ed7379e8b2e3305a4bf4ebe2db">
    <App />
    </ThirdwebProvider>
  </React.StrictMode>
  
);

function Component() {
  const { contract, isLoading } = useContract("0xf7cFC8c624b386aC05de7154c5E4593C3C735B7A");
}