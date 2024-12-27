import { expect } from "chai";
import { ethers } from "hardhat";

describe("Proxy Contract", function () {
  let logicV1: any;
  let logicV2: any;
  let proxy: any;
  let owner: any;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();

    // Desplegar LogicV1
    const LogicV1 = await ethers.getContractFactory("LogicV1");
    logicV1 = await LogicV1.deploy();
    await logicV1.waitForDeployment();
    console.log("LogicV1 deployed at:", await logicV1.getAddress());

    // Desplegar Proxy apuntando a LogicV1
    const Proxy = await ethers.getContractFactory("Proxy");
    proxy = await Proxy.deploy(await logicV1.getAddress());
    await proxy.waitForDeployment();
    console.log("Proxy deployed at:", await proxy.getAddress());

    // Desplegar LogicV2
    const LogicV2 = await ethers.getContractFactory("LogicV2");
    logicV2 = await LogicV2.deploy();
    await logicV2.waitForDeployment();
    console.log("LogicV2 deployed at:", await logicV2.getAddress());
  });

  it("should delegate calls to LogicV1 and LogicV2", async function () {
    // Conectar el Proxy como si fuera LogicV1
    const logicV1Proxy = new ethers.Contract(await proxy.getAddress(), logicV1.interface, owner);

    // Establecer número a través del proxy usando LogicV1
    await logicV1Proxy.setNumber(42);
    expect(await logicV1Proxy.getNumber()).to.equal(42);

    // Actualizar el proxy para apuntar a LogicV2
    await proxy.connect(owner).upgrade(await logicV2.getAddress());

    // Conectar el Proxy como si fuera LogicV2
    const logicV2Proxy = new ethers.Contract(await proxy.getAddress(), logicV2.interface, owner);

    // Establecer número con nueva lógica usando LogicV2
    await logicV2Proxy.setNumber(42);
    expect(await logicV2Proxy.getNumber()).to.equal(42 * 2);

    // Usar función adicional en LogicV2
    expect(await logicV2Proxy.getDouble()).to.equal(42 * 2 * 2);
  });
});
