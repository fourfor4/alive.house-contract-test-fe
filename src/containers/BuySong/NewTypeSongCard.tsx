import { Button, Card, Descriptions, notification } from "antd";
import React, { useState, useEffect } from "react";
import { formatAddress } from "../../utils";
import { BigNumber, Contract, ethers, Signer } from "ethers";
import {
  getAliveBondedSongAbi,
  getAliveFixedSongAbi,
  getAliveNewSongAbi,
} from "../../utils/abis";

type Props = {
  contractAddress: string;
  songType: number;
};

const NewTypeSongCard: React.FC<Props> = ({ contractAddress, songType }) => {
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  let signer = provider.getSigner();
  let songContract = new ethers.Contract(
    contractAddress,
    getAliveNewSongAbi(),
    signer
  );

  const [isBuy, setIsBuy] = useState(false);
  const [initialPrice, setInitialPrice] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [maxMintAmount, setMaxMintAmount] = useState(0);

  const getBalance = async () => {
    try {
      let currentPrice = await songContract.currentPrice();
      setCurrentPrice(Number(ethers.utils.formatEther(currentPrice)));
      let initialPrice = await songContract.initialPrice();
      setInitialPrice(Number(ethers.utils.formatEther(initialPrice)));
      // let discountRate = await songContract.discountRate();
      // console.log(discountRate);
      // setDiscountRate(Number(ethers.utils.formatEther(discountRate)));
      let totalSupply = await songContract.totalSupply();
      setTotalSupply(Number(totalSupply));
      let maxMintAmount = await songContract.maxMintAmount();
      setMaxMintAmount(Number(maxMintAmount));
    } catch (error: any) {
      console.log(error);
      notification.error({ message: error["reason"] });
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
        message: "Mint Bonded Song Successfully!",
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

  return (
    <Card
      title={"NewType-" + formatAddress(contractAddress)}
      extra={
        <Button type="primary" onClick={() => handleBuySong()} loading={isBuy}>
          Buy
        </Button>
      }
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label={"Current Price"}>
          {currentPrice}
        </Descriptions.Item>
        <Descriptions.Item label={"Initial Price"}>
          {initialPrice}
        </Descriptions.Item>
        <Descriptions.Item label={"Discount Rate"}>
          {discountRate}
        </Descriptions.Item>
        <Descriptions.Item label={"Count"}>
          {totalSupply}/{maxMintAmount}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default NewTypeSongCard;
