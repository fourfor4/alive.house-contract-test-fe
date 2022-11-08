import { Button, Card, Descriptions, notification } from "antd";
import React, { useState, useEffect } from "react";
import { formatAddress } from "../../utils";
import { BigNumber, Contract, ethers, Signer } from "ethers";
import { getAliveDutchSongAbi, getAliveFixedSongAbi } from "../../utils/abis";
import moment from "moment";

type Props = {
  contractAddress: string;
  songType: number;
};

const DutchSongCard: React.FC<Props> = ({ contractAddress, songType }) => {
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  let signer = provider.getSigner();
  let songContract = new ethers.Contract(
    contractAddress,
    getAliveDutchSongAbi(),
    signer
  );

  const [isBuy, setIsBuy] = useState(false);
  const [startingPrice, setStartingPrice] = useState(0);
  const [floorPrice, setFloorPrice] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [startedAt, setStartedAt] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [maxMintAmount, setMaxMintAmount] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  const getBalance = async () => {
    try {
      let startingPrice = await songContract.ceilPrice();
      setStartingPrice(Number(ethers.utils.formatEther(startingPrice)));
      let floorPrice = await songContract.floorPrice();
      setFloorPrice(Number(ethers.utils.formatEther(floorPrice)));
      let discountRate = await songContract.discountRate();
      setDiscountRate(Number(ethers.utils.formatEther(discountRate)));
      let startedAt = await songContract.startedAt();
      setStartedAt(Number(startedAt));
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
        value: ethers.utils.parseEther(getCurrentPrice().toString()),
      });
      await mintSong.wait();
      notification.success({
        message: "Mint Dutch Song Successfully!",
      });
      getBalance();
    } catch (error: any) {
      notification.error({
        message: error["reason"],
      });
    }
    setIsBuy(false);
  };

  const getCurrentPrice = () => {
    let currentPrice = 0;
    let timeElapsed = Math.floor(
      (new Date().getTime() - startedAt * 1000) / 1000
    );
    let discount = discountRate * timeElapsed;
    if (discount > startingPrice || floorPrice > startingPrice - discount) {
      currentPrice = floorPrice;
      return floorPrice;
    } else {
      currentPrice = startingPrice - discount;
      return currentPrice;
    }
  };

  useEffect(() => {
    getBalance();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setCurrentTime(new Date());
    }, 1000);
  }, [currentTime]);

  return (
    <Card
      title={"Dutch-" + formatAddress(contractAddress)}
      extra={
        <Button type="primary" onClick={() => handleBuySong()} loading={isBuy}>
          Buy
        </Button>
      }
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label={"currentPrice"}>
          {getCurrentPrice()}
        </Descriptions.Item>
        <Descriptions.Item label={"Starting Price"}>
          {startingPrice}
        </Descriptions.Item>
        <Descriptions.Item label={"Floor Price"}>
          {floorPrice}
        </Descriptions.Item>
        <Descriptions.Item label={"DiscountRate"}>
          {discountRate}
        </Descriptions.Item>
        <Descriptions.Item label={"Started At"}>
          {moment(new Date(startedAt * 1000)).format("YYYY-MM-DD HH:mm:ss")}
        </Descriptions.Item>
        <Descriptions.Item label={"Count"}>
          {totalSupply}/{maxMintAmount}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default DutchSongCard;
