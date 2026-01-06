import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import web3 from "./web3";
import "./styles.css";

function App() {
  const [account, setAccount] = useState("");
  const [status, setStatus] = useState("");
  const videoRef = useRef(null);

  // 🎥 Start Camera
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied");
      }
    }
    startCamera();
  }, []);

  // 🔐 Connect Wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not detected");
      return;
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
  };

  // 🔗 Send action to blockchain
  const controlDevice = async (device, action) => {
    if (!account) {
      alert("Connect wallet first");
      return;
    }

    try {
      setStatus(`Sending ${action} for ${device}...`);
      await axios.post("http://localhost:5000/log", {
        from: account,
        device,
        action
      });
      setStatus(`✅ ${device} → ${action} logged on blockchain`);
    } catch (err) {
      console.error(err);
      setStatus("❌ Transaction failed");
    }
  };

  return (
    <div className="container">
      <h1>🔐 Blockchain-Based IoT Control Panel</h1>

      {/* Wallet */}
      <div className="card">
        {!account ? (
          <button className="primary" onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <p><b>Connected:</b> {account}</p>
        )}
      </div>

      {/* Camera */}
      <div className="card">
        <h2>📷 Security Camera</h2>
        <video ref={videoRef} autoPlay muted className="camera" />
        <p>Live feed (simulated)</p>
      </div>

      {/* IoT Devices */}
      <div className="grid">
        <Device name="Smart Door" on={controlDevice} />
        <Device name="Smart Light" on={controlDevice} />
        <Device name="Smart Fan" on={controlDevice} />
        <Device name="Smart Alarm" on={controlDevice} />
      </div>

      {/* Status */}
      {status && <div className="status">{status}</div>}
    </div>
  );
}

// 🔌 Device Card Component
function Device({ name, on }) {
  return (
    <div className="device-card">
      <h3>{name}</h3>
      <button className="success" onClick={() => on(name, "ON")}>ON</button>
      <button className="danger" onClick={() => on(name, "OFF")}>OFF</button>
    </div>
  );
}

export default App;
