// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";



const RegisterModule = buildModule("RegisterModule", (m) => {


  const register = m.contract("Register");

  return { register };
});

export default RegisterModule;
