import { Button } from "antd";
import { ethers } from "ethers";
import React, { useEffect } from "react";
import { getAccount } from "../../utils";
import { useNavigate } from "react-router";
import gameVersion from "../../utils/gameVersion";

const Login: React.FC = () => {
  const navigate = useNavigate();

  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  let signer = provider.getSigner();

  const connectMetamask = async () => {
    await getAccount();
    if ((await getAccount()) !== "") {
      navigate("/create/band");
    }
  };

  // const handleSwitchNetwork = async () => {
  //   if (gameVersion == "test") {
  //     // @ts-ignore
  //     await window.ethereum.request({
  //       method: "wallet_addEthereumChain",
  //       params: [
  //         {
  //           chainId: "0x13881",
  //           rpcUrls: ["https://matic-mumbai.chainstacklabs.com/"],
  //           chainName: "Polygon Testnet",
  //           nativeCurrency: {
  //             name: "MATIC",
  //             symbol: "MATIC",
  //             decimals: 18,
  //           },
  //           blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
  //         },
  //       ],
  //     });
  //   } else if (gameVersion == "main") {
  //     // @ts-ignore
  //     await window.ethereum.request({
  //       method: "wallet_addEthereumChain",
  //       params: [
  //         {
  //           chainId: "0x13881",
  //           rpcUrls: ["https://polygon-rpc.com/"],
  //           chainName: "Polygon",
  //           nativeCurrency: {
  //             name: "MATIC",
  //             symbol: "MATIC",
  //             decimals: 18,
  //           },
  //           blockExplorerUrls: ["https://polygonscan.com/"],
  //         },
  //       ],
  //     });
  //   }
  // };

  const login = async () => {
    try {
      await provider.send("eth_requestAccounts", []);
      console.log(provider["_network"]);
      // if (!provider) {
      //   handleSwitchNetwork();
      // }
      // if (gameVersion == "test" && provider._network.chainId !== 80001) {
      //   handleSwitchNetwork();
      // } else if (provider._network.chainId !== 137) {
      //   handleSwitchNetwork();
      // }
      navigate("/bands");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    login();
    // connectMetamask();
  }, []);
  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <Button type={"primary"} onClick={() => login()}>
        Connect Metamask
      </Button>
    </div>
  );
};

export default Login;
