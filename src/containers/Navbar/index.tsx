import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { ethers } from "ethers";
import { getAccount } from "../../utils";

const NavBar: React.FC = () => {
  const [account, setAccount] = useState("");

  const connectMetamask = async () => {
    // @ts-ignore
    new ethers.providers.Web3Provider(window.ethereum);
    getSignerAddress();
  };

  const getSignerAddress = async () => {
    let account = await getAccount();
    setAccount(account);
  };

  useEffect(() => {
    getSignerAddress();
  }, []);

  return (
    <div className="container mx-auto m-8 flex">
      <Button
        className="ml-auto"
        type="primary"
        onClick={() => connectMetamask()}
      >
        {account !== ""
          ? account.substr(0, 6) + "..." + account.substr(account.length - 4, 4)
          : "Connect Wallet"}
      </Button>
    </div>
  );
};

export default NavBar;
