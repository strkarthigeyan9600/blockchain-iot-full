const express = require("express");
const cors = require("cors");
const { Web3 } = require("web3");
const abi = require("./abi.json");

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Local Hardhat / Ganache RPC
const web3 = new Web3("http://127.0.0.1:8545");

// ✅ PUT YOUR REAL DEPLOYED CONTRACT ADDRESS HERE
// Example: 0x5FbDB2315678afecb367f032d93F642f64180aa3
const contractAddress = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";



// 🛑 Safety check (prevents crash)
if (!web3.utils.isAddress(contractAddress)) {
  console.error("❌ Invalid contract address!");
  console.error("➡️ Deploy the contract and paste the real address.");
  process.exit(1);
}

// 🧠 Contract instance
const contract = new web3.eth.Contract(abi, contractAddress);

// 🔐 API: Log IoT event to blockchain
app.post("/log", async (req, res) => {
  const { from, device, action } = req.body;

  if (!from || !device || !action) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!web3.utils.isAddress(from)) {
    return res.status(400).json({ error: "Invalid sender address" });
  }

  try {
    const tx = await contract.methods
      .logEvent(device, action)
      .send({
        from,
        gas: 300000
      });

    res.json({
      success: true,
      txHash: tx.transactionHash
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// 🚀 Start server
app.listen(5000, () => {
  console.log("✅ Backend running on http://localhost:5000");
});
