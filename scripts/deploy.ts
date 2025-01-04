import { ethers } from "hardhat";

async function main() {
  // Deploy LogicV1
  const LogicV1 = await ethers.getContractFactory("LogicV1");
  const logicV1 = await LogicV1.deploy();
  await logicV1.waitForDeployment();
  console.log(`LogicV1 deployed to: ${await logicV1.getAddress()}`);

  // Deploy ProxyAdmin
  const ProxyAdmin = await ethers.getContractFactory("ProxyAdmin");
  const [deployer] = await ethers.getSigners();
  const proxyAdmin = await ProxyAdmin.deploy(deployer.address);
  await proxyAdmin.waitForDeployment();
  console.log(`ProxyAdmin deployed to: ${await proxyAdmin.getAddress()}`);

  // Deploy TransparentUpgradeableProxy pointing to LogicV1
  const TransparentUpgradeableProxy = await ethers.getContractFactory(
    "TransparentUpgradeableProxy"
  );
  const proxy = await TransparentUpgradeableProxy.deploy(
    await logicV1.getAddress(),
    await proxyAdmin.getAddress(),
    "0x"
  );
  await proxy.waitForDeployment();
  const proxyAddress = await proxy.getAddress();
  console.log(`Proxy deployed to: ${proxyAddress}`);
  console.log(
    `Proxy is pointing to implementation: ${await logicV1.getAddress()}`
  );

  // Attach LogicV1 ABI to Proxy
  const proxyAsLogicV1 = await ethers.getContractAt("LogicV1", proxyAddress);

  // Set a number via the proxy
  let tx = await proxyAsLogicV1.setNumber(42);
  await tx.wait();
  console.log("Number set to 42 via proxy");

  // Get the number via the proxy
  let number = await proxyAsLogicV1.getNumber();
  console.log(`Number retrieved via proxy: ${number}`);

  // Deploy LogicV2
  const LogicV2 = await ethers.getContractFactory("LogicV2");
  const logicV2 = await LogicV2.deploy();
  await logicV2.waitForDeployment();
  console.log(`LogicV2 deployed to: ${await logicV2.getAddress()}`);

  // Upgrade the proxy to point to LogicV2 using ProxyAdmin
  const proxyAdminContract = await ethers.getContractAt(
    "ProxyAdmin",
    await proxyAdmin.getAddress()
  );
  const upgradeTx = await proxyAdminContract
    .connect(deployer)
    .upgrade(proxyAddress, await logicV2.getAddress());
  await upgradeTx.wait();
  console.log(
    `Proxy upgraded to point to LogicV2 at: ${await logicV2.getAddress()}`
  );

  // Attach LogicV2 ABI to Proxy
  const proxyAsLogicV2 = await ethers.getContractAt("LogicV2", proxyAddress);

  // Set a number via the proxy using LogicV2
  tx = await proxyAsLogicV2.setNumber(42);
  await tx.wait();
  console.log("Number set to 42 via proxy using LogicV2");

  // Get the number via the proxy using LogicV2
  number = await proxyAsLogicV2.getNumber();
  console.log(`Number retrieved via proxy using LogicV2: ${number}`);

  // Get double the number via the proxy using LogicV2
  const doubleNumber = await proxyAsLogicV2.getDouble();
  console.log(
    `Double number retrieved via proxy using LogicV2: ${doubleNumber}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
