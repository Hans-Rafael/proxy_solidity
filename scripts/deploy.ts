import { ethers } from "hardhat";

async function main() {
  // Desplegamos LogicV1
  const LogicV1 = await ethers.getContractFactory("LogicV1");
  const logicV1 = await LogicV1.deploy();
  //await logicV1.deployed();
  console.log("LogicV1 deployed to:", logicV1.target);//new version of logicV1.address

  // Desplegamos el Proxy apuntando a LogicV1
  const Proxy = await ethers.getContractFactory("Proxy");
  const proxy = await Proxy.deploy(logicV1.target);
  console.log("Proxy deployed to:", proxy.target);

  // Desplegamos LogicV2 (opcional, para pruebas de actualización)
  const LogicV2 = await ethers.getContractFactory("LogicV2");
  const logicV2 = await LogicV2.deploy();
  console.log("LogicV2 deployed to:", logicV2.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
