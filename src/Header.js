import React from "react";
import { useWallet } from "@vechain/vechain-kit-react";

export default function Header() {
  const { wallet, isConnecting, connect, disconnect } = useWallet();

  return (
    <header style={{
      width: "100%", display: "flex", justifyContent: "flex-end",
      alignItems: "center", padding: "16px 32px", background: "rgba(0,0,0,0.2)", position: "sticky", top: 0, zIndex: 100
    }}>
      {!wallet ? (
        <button
          onClick={connect}
          disabled={isConnecting}
          style={{
            background: "#2563eb",
            color: "#fff",
            borderRadius: "24px",
            padding: "10px 20px",
            border: "none",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      ) : (
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          background: "#222", color: "#a7f3d0", borderRadius: "24px",
          padding: "10px 20px"
        }}>
          <span>
            {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
          </span>
          <button
            style={{
              marginLeft: 8,
              background: "transparent",
              color: "#a7f3d0",
              border: "none",
              textDecoration: "underline",
              cursor: "pointer"
            }}
            onClick={disconnect}
          >Disconnect</button>
          <button
            style={{
              marginLeft: 8,
              background: "transparent",
              color: "#a7f3d0",
              border: "none",
              textDecoration: "underline",
              cursor: "pointer"
            }}
            onClick={connect}
          >Reconnect</button>
        </div>
      )}
    </header>
  );
}
