import React, { useState, useEffect } from 'react';
import { PeraWalletConnect } from "@perawallet/connect";

const peraWallet = new PeraWalletConnect();

export default function PeraWalletConnectComponent() {
  const [accountAddress, setAccountAddress] = useState("");
  const [codeValue, setCodeValue] = useState("");

  useEffect(() => {
    reconnectSession();
    return () => {
      peraWallet.disconnect();
    };
  }, []);

  const reconnectSession = async () => {
    try {
      const accounts = await peraWallet.reconnectSession();
      if (accounts.length) {
        setAccountAddress(accounts[0]);
      }
    } catch (error) {
      console.error("Reconnect error:", error);
    }
  };

  const handleConnectWalletClick = async () => {
    try {
      const newAccounts = await peraWallet.connect();
      setAccountAddress(newAccounts[0]);
    } catch (error) {
      if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
        console.error("Connection error:", error);
      }
    }
  };

  const handleDisconnectWalletClick = async () => {
    try {
      await peraWallet.disconnect();
      setAccountAddress("");
    } catch (error) {
      console.error("Disconnection error:", error);
    }
  };

  return (
    <div>
      <button
        onClick={accountAddress ? handleDisconnectWalletClick : handleConnectWalletClick}
        style={{
          backgroundColor: '#6B46FE', // Pera Wallet's primary color
          color: '#FFFFFF',
          padding: '12px 20px',
          border: 'none',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 6px rgba(107, 70, 254, 0.2)',
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#5438CB'; // Darker shade of Pera Wallet color
          e.target.style.boxShadow = '0 6px 8px rgba(107, 70, 254, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#6B46FE';
          e.target.style.boxShadow = '0 4px 6px rgba(107, 70, 254, 0.2)';
        }}
      >
        {accountAddress 
          ? `${accountAddress.slice(0, 4)}...${accountAddress.slice(-4)}` 
          : 'Connect Wallet'}
      </button>
    </div>
  );
}