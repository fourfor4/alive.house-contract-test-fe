import { Button, Descriptions, Input, notification, Select } from "antd";
import { ethers } from "ethers";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  getAliveBondedSongAbi,
  getAliveDutchSongAbi,
  getAliveFixedSongAbi,
} from "../../utils/abis";

const { Option } = Select;

const GetSongInfo: React.FC = () => {
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  let signer = provider.getSigner();

  const [contractAddress, setContractAddress] = useState("");
  const [songType, setSongType] = useState("fixed");

  const [currentPrice, setCurrentPrice] = useState(0);
  const [initialPrice, setInitialPrice] = useState(0);
  const [upcountRate, setUpcountRate] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [startingPrice, setStartingPrice] = useState(0);
  const [floorPrice, setFloorPrice] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [maxMintAmount, setMaxMintAmount] = useState(0);
  const [startedAt, setStartedAt] = useState(0);

  const [currentTime, setCurrentTime] = useState(new Date());

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

  const getSongInfo = async () => {
    try {
      if (songType === "fixed") {
        let songContract = new ethers.Contract(
          contractAddress,
          getAliveFixedSongAbi(),
          signer
        );
        let currentPrice = await songContract.initialPrice();
        setCurrentPrice(Number(ethers.utils.formatEther(currentPrice)));
        let totalSupply = await songContract.totalSupply();
        setTotalSupply(Number(totalSupply));
        let maxMintAmount = await songContract.maxMintAmount();
        setMaxMintAmount(Number(maxMintAmount));
        let startedAt = await songContract.startedAt();
        setStartedAt(Number(startedAt));
      }
      if (songType === "bonded") {
        let songContract = new ethers.Contract(
          contractAddress,
          getAliveBondedSongAbi(),
          signer
        );
        let currentPrice = await songContract.currentPrice();
        setCurrentPrice(Number(ethers.utils.formatEther(currentPrice)));
        let initialPrice = await songContract.initialPrice();
        setInitialPrice(Number(ethers.utils.formatEther(initialPrice)));
        let upcountRate = await songContract.upcountRate();
        setUpcountRate(Number(ethers.utils.formatEther(upcountRate)));
        let totalSupply = await songContract.totalSupply();
        setTotalSupply(Number(totalSupply));
        let maxMintAmount = await songContract.maxMintAmount();
        setMaxMintAmount(Number(maxMintAmount));
        let startedAt = await songContract.startedAt();
        setStartedAt(Number(startedAt));
      }
      if (songType === "dutch") {
        let songContract = new ethers.Contract(
          contractAddress,
          getAliveDutchSongAbi(),
          signer
        );
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
      }
      notification.success({ message: "Get info successfully" });
    } catch (error: any) {
      notification.error({ message: error["reason"] });
    }
  };

  const renderSongInfo = () => {
    if (songType === "fixed") {
      return (
        <Descriptions bordered column={1}>
          <Descriptions.Item label={"Current Price"}>
            {currentPrice}
          </Descriptions.Item>
          <Descriptions.Item label={"Started At"}>
            {moment(new Date(startedAt * 1000)).format("YYYY-MM-DD HH:mm:ss")}
          </Descriptions.Item>
          <Descriptions.Item label={"Count"}>
            {totalSupply}/{maxMintAmount}
          </Descriptions.Item>
        </Descriptions>
      );
    }
    if (songType === "bonded") {
      return (
        <Descriptions bordered column={1}>
          <Descriptions.Item label={"Current Price"}>
            {currentPrice}
          </Descriptions.Item>
          <Descriptions.Item label={"Initial Price"}>
            {initialPrice}
          </Descriptions.Item>
          <Descriptions.Item label={"Upcount Rate"}>
            {upcountRate}
          </Descriptions.Item>
          <Descriptions.Item label={"Started At"}>
            {moment(new Date(startedAt * 1000)).format("YYYY-MM-DD HH:mm:ss")}
          </Descriptions.Item>
          <Descriptions.Item label={"Count"}>
            {totalSupply}/{maxMintAmount}
          </Descriptions.Item>
        </Descriptions>
      );
    }
    if (songType === "dutch") {
      return (
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
      );
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setCurrentTime(new Date());
    }, 1000);
  }, [currentTime]);

  return (
    <div className="my-4">
      <div className="flex mb-4">
        <Select value={songType} onChange={(e) => setSongType(e)}>
          <Option value="fixed">Fixed</Option>
          <Option value="bonded">Bonded</Option>
          <Option value="dutch">Dutch</Option>
        </Select>
        <Input
          value={contractAddress}
          placeholder="Contract Address"
          onChange={(e) => setContractAddress(e.target.value)}
        />
        <Button type="primary" onClick={() => getSongInfo()}>
          Get
        </Button>
      </div>
      <div>{renderSongInfo()}</div>
    </div>
  );
};

export default GetSongInfo;
