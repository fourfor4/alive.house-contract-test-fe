import { Button, Card, Descriptions, notification } from "antd";
import React, { useState, useEffect } from "react";
import { formatAddress } from "../../utils";
import { BigNumber, Contract, ethers, Signer } from "ethers";
import { getAliveFixedSongAbi } from "../../utils/abis";
import BuySongWithCard from "./BuySongWithCard.modal";

type Props = {
  contractAddress: string;
  songType: number;
};

const FixedSongCard: React.FC<Props> = ({ contractAddress, songType }) => {
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  let signer = provider.getSigner();
  let songContract = new ethers.Contract(
    contractAddress,
    getAliveFixedSongAbi(),
    signer
  );

  const [isBuy, setIsBuy] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [maxMintAmount, setMaxMintAmount] = useState(0);
  const [account, setAccount] = useState("");

  const [isWertShow, setIsWertShow] = useState(false);
  const [ecodedInputData, setEncodedInputData] = useState("");
  const [testPrice, setTestPrice] = useState(10);

  const getBalance = async () => {
    try {
      setAccount(await signer.getAddress());
      let currentPrice = await songContract.initialPrice();
      setCurrentPrice(Number(ethers.utils.formatEther(currentPrice)));
      let totalSupply = await songContract.totalSupply();
      setTotalSupply(Number(totalSupply));
      let maxMintAmount = await songContract.maxMintAmount();
      setMaxMintAmount(Number(maxMintAmount));
    } catch (error: any) {
      notification.error({
        message: error["reason"],
      });
    }
  };

  const handleBuySong = async () => {
    setIsBuy(true);
    try {
      let signerAddress = await signer.getAddress();
      let mintSong = await songContract.mint(signerAddress, 1, {
        value: ethers.utils.parseEther(currentPrice.toString()),
      });
      await mintSong.wait();
      notification.success({
        message: "Mint Fixed Song Successfully!",
      });
      getBalance();
    } catch (error: any) {
      notification.error({
        message: error["reason"],
      });
    }
    setIsBuy(false);
  };

  useEffect(() => {
    getBalance();
  }, []);

  useEffect(() => {
    if (account != "") {
      // setIsWertShow(true);
    }
  }, [account]);

  return (
    <Card
      title={"Fixed-" + formatAddress(contractAddress)}
      extra={
        <div>
          <Button
            type="primary"
            onClick={() => handleBuySong()}
            loading={isBuy}
          >
            Buy
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setIsWertShow(!isWertShow);
              let abi = getAliveFixedSongAbi();
              let iface = new ethers.utils.Interface(abi);
              let encodeVal = iface.encodeFunctionData("mint", [account, 1]);
              let testprice = (new Date().getTime() % 10) * 10 + 10;
              console.log(encodeVal);
              setTestPrice(testprice);
              setEncodedInputData(encodeVal);
            }}
          >
            Buy With Wert
          </Button>
        </div>
      }
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label={"Current Price"}>
          {currentPrice}
        </Descriptions.Item>
        <Descriptions.Item label={"Count"}>
          {totalSupply}/{maxMintAmount}
        </Descriptions.Item>
      </Descriptions>
      <BuySongWithCard
        contractAddress={contractAddress}
        price={currentPrice}
        quantity={1}
        account={account}
        isWertShow={isWertShow}
        setIsWertShow={setIsWertShow}
        inputData={ecodedInputData}
        getBalance={getBalance}
      />
    </Card>
  );
};

export default FixedSongCard;
