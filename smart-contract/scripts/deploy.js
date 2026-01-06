async function main() {
  const IoTAccess = await ethers.getContractFactory("IoTAccess");
  const contract = await IoTAccess.deploy();
  await contract.waitForDeployment();
  console.log("Contract deployed at:", await contract.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
