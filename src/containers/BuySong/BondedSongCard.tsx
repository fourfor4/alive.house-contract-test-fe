import {
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  InputNumber,
  notification,
  Typography,
} from "antd";
import React, { useState, useEffect } from "react";
import { formatAddress } from "../../utils";
import { BigNumber, Contract, ethers, Signer } from "ethers";
import {
  getAliveBondedSongAbi,
  getAliveBondedSongV2Abi,
  getAliveFixedSongAbi,
  getAliveRegistryAbi,
} from "../../utils/abis";
import { getAliveRegistryAddress } from "../../utils/contractAddress";

type Props = {
  contractAddress: string;
  songType: number;
};

const BondedSongCard: React.FC<Props> = ({ contractAddress, songType }) => {
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  let signer = provider.getSigner();
  let aliveRegistryContract = new ethers.Contract(
    getAliveRegistryAddress(),
    getAliveRegistryAbi(),
    signer
  );
  let songContract = new ethers.Contract(
    contractAddress,
    getAliveBondedSongAbi(),
    signer
  );
  const [isBuy, setIsBuy] = useState(false);
  const [initialPrice, setInitialPrice] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [upcountRate, setUpcountRate] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [maxMintAmount, setMaxMintAmount] = useState(0);

  const [currentVersion, setCurrentVersion] = useState(0);
  const [admin, setAdmin] = useState("");
  const [account, setAccount] = useState("blank");

  const [isNewUpcountRate, setIsNewUpcountRate] = useState(false);

  const getBalance = async () => {
    try {
      setAccount(await signer.getAddress());
      let admin = await aliveRegistryContract.adminAddress();
      setAdmin(admin);
      let songInfo = await aliveRegistryContract.getAliveSongImp(2);
      console.log("song info : ", songInfo);
      setCurrentVersion(Number(songInfo.songVersion));
      if (Number(songInfo.songVersion) === 1) {
        songContract = new ethers.Contract(
          contractAddress,
          getAliveBondedSongAbi(),
          signer
        );
      }
      if (Number(songInfo.songVersion) === 2) {
        songContract = new ethers.Contract(
          contractAddress,
          getAliveBondedSongV2Abi(),
          signer
        );
      }
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

  const setNewUpcountRate = async (value: any) => {
    let newUpcountRate = Number(value.newupcountrate);
    console.log(newUpcountRate, typeof newUpcountRate);
    setIsNewUpcountRate(true);
    try {
      songContract = new ethers.Contract(
        contractAddress,
        getAliveBondedSongV2Abi(),
        signer
      );
      let updateUpcountRateTx = await songContract.setUpcountRate(
        newUpcountRate
      );
      await updateUpcountRateTx.wait();
      getBalance();
    } catch (error: any) {
      console.log(error);
      notification.error({
        message: error["reason"],
      });
    }
    setIsNewUpcountRate(false);
  };

  useEffect(() => {
    getBalance();
  }, []);

  return (
    <Card
      title={"Bonded-" + currentVersion + " " + formatAddress(contractAddress)}
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
        <Descriptions.Item label={"Upcount Rate"}>
          {upcountRate}
        </Descriptions.Item>
        <Descriptions.Item label={"Count"}>
          {totalSupply}/{maxMintAmount}
        </Descriptions.Item>
      </Descriptions>
      {account === admin && currentVersion != 1 && (
        <div className="mt-4">
          <Typography.Title level={5}>New Upcount Reate</Typography.Title>
          <Form onFinish={setNewUpcountRate}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Please input times!",
                },
              ]}
              name={"newupcountrate"}
              label={"Multiple Times"}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item className="text-right">
              <Button
                type="primary"
                htmlType="submit"
                loading={isNewUpcountRate}
              >
                Set Upcount Rate
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </Card>
  );
};

export default BondedSongCard;
