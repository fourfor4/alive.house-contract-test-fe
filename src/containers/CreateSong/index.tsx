import React, { useState, useEffect } from "react";
import {
  Select,
  Row,
  Col,
  Typography,
  Descriptions,
  Input,
  InputNumber,
  Button,
  DatePicker,
  notification,
} from "antd";
import Styles from "./index.module.css";
import { BigNumber, Contract, ethers, Signer } from "ethers";
import { getAliveBandAbi, getAliveBandV2Abi } from "../../utils/abis";
import moment from "moment";

const { Option } = Select;

type Props = {
  band: any;
  getAllSongs: Function;
  bandVersion: string;
};
const CreateSong: React.FC<Props> = ({ band, getAllSongs, bandVersion }) => {
  // @ts-ignore

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  let signer = provider.getSigner();
  // const provider = new ethers.providers.JsonRpcProvider(
  //   process.env.REACT_APP_MATICMUMBAI
  // );
  // const signer = new ethers.Wallet(
  //   process.env.REACT_APP_PRIVATE_KEY + "",
  //   provider
  // );

  const [isCreateSong, setIsCreateSong] = useState(false);

  const [songType, setSongType] = useState("Fixed");
  const [maxMintAmount, setMaxMintAmount] = useState(100);
  const [initialPrice, setInitialPrice] = useState(1);
  const [upcountRate, setUpcountRate] = useState(1);
  const [discountRate, setDiscountRate] = useState(1);
  const [startingPrice, setStartingPrice] = useState(1);
  const [floorPrice, setFloorPrice] = useState(0);
  const [startedAt, setStartedAt] = useState<any>(moment(new Date()));
  const [songURI, setSongURI] = useState("");
  const [contractURI, setContractURI] = useState("");
  const [artist, setArtist] = useState("");
  const [royaltyFeesInBips, setRoyaltyFeesInBips] = useState(20);
  const [offchainRoyaltyFeesInBips, setOffchainRoyaltyFeesInBips] =
    useState(20);

  const [primarySplitWalletAddress, setPrimarySplitWalletAddress] =
    useState("");
  const [secondarySplitWalletAddress, setSecondarySplitWalletAddress] =
    useState("");

  const onSongTypeChange = (value: string) => {
    setSongType(value);
  };

  const onBandVersionChange = (value: string) => {
    setSongType("Fixed");
  };

  const handleCreateSong = async () => {
    if (band.bandAddress) {
      console.log(band.bandAddress);
      console.log(bandVersion);
      let aliveBandContract = new ethers.Contract(
        band.bandAddress,
        bandVersion === "v1" ? getAliveBandAbi() : getAliveBandV2Abi(),
        signer
      );

      try {
        setIsCreateSong(true);
        switch (songType) {
          case "Fixed":
            console.log("Fixed Start");
            console.log(Number(Math.floor(new Date().getTime() / 1000)));
            let createFixedSong = await aliveBandContract.createFixedSong(
              band.bandAdmin,
              Number(royaltyFeesInBips),
              band.bandAdmin,
              Number(offchainRoyaltyFeesInBips),
              songURI,
              contractURI,
              artist,
              [
                Number(maxMintAmount),
                ethers.utils.parseEther(initialPrice.toString()),
                Number(Math.floor(new Date(startedAt).getTime() / 1000)),
              ]
            );
            await createFixedSong.wait();
            notification.success({
              message: "Create Song Successfully!",
            });
            getAllSongs();
            break;
          case "Bonded":
            console.log("Bonded Start");
            let createBondedSong = await aliveBandContract.createBondedSong(
              band.bandAdmin,
              Number(royaltyFeesInBips),
              band.bandAdmin,
              Number(offchainRoyaltyFeesInBips),
              songURI,
              contractURI,
              artist,
              [
                Number(maxMintAmount),
                ethers.utils.parseEther(initialPrice.toString()),
                ethers.utils.parseEther(upcountRate.toString()),
                Number(Math.floor(new Date(startedAt).getTime() / 1000)),
              ]
            );
            await createBondedSong.wait();
            notification.success({
              message: "Create Song Successfully!",
            });
            getAllSongs();
            break;
          case "Dutch":
            console.log("Dutch Start");
            let createDutchSong = await aliveBandContract.createDutchSong(
              secondarySplitWalletAddress,
              Number(royaltyFeesInBips),
              primarySplitWalletAddress,
              Number(offchainRoyaltyFeesInBips),
              songURI,
              contractURI,
              artist,
              [
                Number(maxMintAmount),
                ethers.utils.parseEther(startingPrice.toString()),
                ethers.utils.parseEther(floorPrice.toString()),
                Number(Math.floor(new Date(startedAt).getTime() / 1000)),
                ethers.utils.parseEther(discountRate.toString()),
              ]
            );
            await createDutchSong.wait();
            notification.success({
              message: "Create Song Successfully!",
            });
            getAllSongs();
            break;
          case "NewType":
            console.log("New Type Start");
            let createNewTypeSong = await aliveBandContract.createNewSong(
              band.bandAdmin,
              Number(royaltyFeesInBips),
              band.bandAdmin,
              Number(offchainRoyaltyFeesInBips),
              songURI,
              contractURI,
              artist,
              [
                Number(maxMintAmount),
                ethers.utils.parseEther(initialPrice.toString()),
                ethers.utils.parseEther(discountRate.toString()),
              ]
            );
            await createNewTypeSong.wait();
            notification.success({
              message: "Create Song Successfully!",
            });
            getAllSongs();
            break;
          default:
            break;
        }
        setIsCreateSong(false);
      } catch (error: any) {
        console.log(error);
        notification.error({
          message: error["reason"],
        });
        setIsCreateSong(false);
      }
    }
  };

  const handleSongInfo = (field: any, value: any) => {
    switch (field) {
      case "maxMintAmount":
        setMaxMintAmount(value);
        break;
      case "initialPrice":
        setInitialPrice(value);
        break;
      case "upcountRate":
        setUpcountRate(value);
        break;
      case "discountRate":
        setDiscountRate(value);
        break;
      case "startingPrice":
        setStartingPrice(value);
        break;
      case "floorPrice":
        setFloorPrice(value);
        break;
      case "startedAt":
        setStartedAt(value);
        break;
      case "songURI":
        setSongURI(value);
        break;
      case "contractURI":
        setContractURI(value);
        break;
      case "artist":
        setArtist(value);
        break;
      case "primarySplitWalletAddress":
        setPrimarySplitWalletAddress(value);
        break;
      case "secondarySplitWalletAddress":
        setSecondarySplitWalletAddress(value);
        break;
      case "royaltyFeesInBips":
        setRoyaltyFeesInBips(value);
        break;
      case "offchainRoyaltyFeesInBips":
        setOffchainRoyaltyFeesInBips(value);
        break;
      default:
        break;
    }
  };

  const renderSongType = () => {
    switch (songType) {
      case "Fixed":
        return (
          <>
            <Descriptions.Item label={"Max Mint Amount"}>
              <InputNumber
                value={maxMintAmount}
                onChange={(e) => handleSongInfo("maxMintAmount", e)}
              />
            </Descriptions.Item>
            <Descriptions.Item label={"Initial Price"}>
              <InputNumber
                value={initialPrice}
                onChange={(e) => handleSongInfo("initialPrice", e)}
              />
            </Descriptions.Item>
            <Descriptions.Item label={"Started At"}>
              <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }}
                onChange={(e) => handleSongInfo("startedAt", e)}
                value={startedAt}
              />
            </Descriptions.Item>
          </>
        );
      case "Bonded":
        return (
          <>
            <Descriptions.Item label={"Max Mint Amount"} span={2}>
              <InputNumber
                value={maxMintAmount}
                onChange={(e) => handleSongInfo("maxMintAmount", e)}
              />
            </Descriptions.Item>
            <Descriptions.Item label={"Initial Price"}>
              <InputNumber
                value={initialPrice}
                onChange={(e) => handleSongInfo("initialPrice", e)}
              />
            </Descriptions.Item>
            <Descriptions.Item label={"Upcount Rate"}>
              <InputNumber
                value={upcountRate}
                onChange={(e) => handleSongInfo("upcountRate", e)}
              />
            </Descriptions.Item>
            <Descriptions.Item label={"Started At"}>
              <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }}
                onChange={(e) => handleSongInfo("startedAt", e)}
                value={startedAt}
              />
            </Descriptions.Item>
          </>
        );
      case "Dutch":
        return (
          <>
            <Descriptions.Item label={"Max Mint Amount"} span={2}>
              <InputNumber
                value={maxMintAmount}
                onChange={(e) => handleSongInfo("maxMintAmount", e)}
              />
            </Descriptions.Item>
            <Descriptions.Item label={"Starting Price"}>
              <InputNumber
                value={startingPrice}
                onChange={(e) => handleSongInfo("startingPrice", e)}
              />
            </Descriptions.Item>
            <Descriptions.Item label={"Decrement"}>
              <InputNumber
                value={discountRate}
                onChange={(e) => handleSongInfo("discountRate", e)}
              />
            </Descriptions.Item>
            <Descriptions.Item label={"Started At"}>
              <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }}
                onChange={(e) => handleSongInfo("startedAt", e)}
                value={startedAt}
              />
            </Descriptions.Item>
            <Descriptions.Item label={"Floor Price"}>
              <InputNumber
                value={floorPrice}
                onChange={(e) => handleSongInfo("floorPrice", e)}
              />
            </Descriptions.Item>
          </>
        );
      case "NewType":
        return (
          <>
            <Descriptions.Item label={"Max Mint Amount"} span={2}>
              <InputNumber
                value={maxMintAmount}
                onChange={(e) => handleSongInfo("maxMintAmount", e)}
              />
            </Descriptions.Item>
            <Descriptions.Item label={"Initial Price"}>
              <InputNumber
                value={initialPrice}
                onChange={(e) => handleSongInfo("initialPrice", e)}
              />
            </Descriptions.Item>
            <Descriptions.Item label={"Discount Rate"}>
              <InputNumber
                value={discountRate}
                onChange={(e) => handleSongInfo("discountRate", e)}
              />
            </Descriptions.Item>
          </>
        );
      default:
        break;
    }
  };

  return (
    <div className={Styles["create-song"]}>
      <Typography.Title level={3}>Create Song</Typography.Title>
      <div>
        <Descriptions bordered column={{ lg: 2, md: 2, sm: 2, xs: 1 }}>
          {/* <Descriptions.Item label={"Band Version"} span={2}>
            <Select
              value={bandVersion}
              style={{ width: 120 }}
              onChange={onBandVersionChange}
            >
              <Option value="v1">V1</Option>
              <Option value="v2">V2</Option>
            </Select>
          </Descriptions.Item> */}
          <Descriptions.Item label={"Song Type"} span={2}>
            <Select
              value={songType}
              style={{ width: 120 }}
              onChange={onSongTypeChange}
            >
              <Option value="Fixed">Fixed</Option>
              <Option value="Bonded">Bonded</Option>
              <Option value="Dutch">Dutch</Option>
              {bandVersion === "v2" && (
                <Option value="NewType">New Type</Option>
              )}
            </Select>
          </Descriptions.Item>
          {renderSongType()}
          <Descriptions.Item span={2} label={"Song URI"}>
            <Input
              value={songURI}
              onChange={(e) => handleSongInfo("songURI", e.target.value)}
            />
          </Descriptions.Item>
          <Descriptions.Item span={2} label={"Contract URI"}>
            <Input
              value={contractURI}
              onChange={(e) => handleSongInfo("contractURI", e.target.value)}
            />
          </Descriptions.Item>
          <Descriptions.Item span={2} label={"Artist"}>
            <Input
              value={artist}
              onChange={(e) => handleSongInfo("artist", e.target.value)}
            />
          </Descriptions.Item>
          <Descriptions.Item span={2} label={"Primary Split Wallet Address"}>
            <Input
              value={primarySplitWalletAddress}
              onChange={(e) =>
                handleSongInfo("primarySplitWalletAddress", e.target.value)
              }
            />
          </Descriptions.Item>
          <Descriptions.Item span={2} label={"Secondary Split Wallet Address"}>
            <Input
              value={secondarySplitWalletAddress}
              onChange={(e) =>
                handleSongInfo("secondarySplitWalletAddress", e.target.value)
              }
            />
          </Descriptions.Item>
          <Descriptions.Item span={2} label={"Secondary Royalty Fees"}>
            <InputNumber
              value={royaltyFeesInBips}
              onChange={(e) => handleSongInfo("royaltyFeesInBips", e)}
            />
          </Descriptions.Item>
          <Descriptions.Item span={2} label={"Offchain Royalty Fees"}>
            <InputNumber
              value={offchainRoyaltyFeesInBips}
              onChange={(e) => handleSongInfo("offchainRoyaltyFeesInBips", e)}
            />
          </Descriptions.Item>
        </Descriptions>
      </div>
      <div className="mt-4 flex">
        <Button
          type="primary"
          className="ml-auto"
          onClick={() => handleCreateSong()}
          loading={isCreateSong}
        >
          Create
        </Button>
      </div>
    </div>
  );
};

export default CreateSong;
