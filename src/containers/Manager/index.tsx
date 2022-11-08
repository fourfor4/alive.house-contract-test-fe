import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Input,
  notification,
  Row,
  Typography,
} from "antd";
import { ethers } from "ethers";
import React, { useState } from "react";
// import { start } from "repl";
import {
  getAliveBondedSongAbi,
  getAliveDutchSongAbi,
  getAliveRegistryAbi,
} from "../../utils/abis";
import { getAliveRegistryAddress } from "../../utils/contractAddress";
import { getAliveFixedSongAbi } from "../../utils/abis";
import AddSongImp from "./AddSongImp";
import UpgradeBand from "./UpgradeBand";
import UpgradeBondedSong from "./UpgradeBondedSong";
import UpgradeHouse from "./UpgradeHouse";
import UpgradeRegistry from "./UpgradeRegistry";
import moment from "moment";

const Manager: React.FC = () => {
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  let signer = provider.getSigner();

  let aliveRegistryContract = new ethers.Contract(
    getAliveRegistryAddress(),
    getAliveRegistryAbi(),
    signer
  );

  const [managers, setManagers] = useState<string[]>([""]);
  const [removeList, setRemoveList] = useState<string[]>([""]);
  const [isAdd, setIsAdd] = useState(false);
  const [isRemove, setIsRemove] = useState(false);

  const [startedAtFixed, setStartedAtFixed] = useState<any>(moment(new Date()));
  const [startedAtBonded, setStartedAtBonded] = useState<any>(
    moment(new Date())
  );
  const [startedAtDutch, setStartedAtDutch] = useState<any>(moment(new Date()));

  const [fixedNftAddress, setFixedNftAddress] = useState("");
  const [bondedNftAddress, setBondedNftAddress] = useState("");
  const [dutchNftAddress, setDutchNftAddress] = useState("");

  const [isUpdatingFixedStartedAt, setIsUpdatingFixedStartedAt] =
    useState(false);
  const [isUpdatingBondedStartedAt, setIsUpdatingBondedStartedAt] =
    useState(false);
  const [isUpdatingDutchStartedAt, setIsUpdatingDutchStartedAt] =
    useState(false);

  const updateManagerList = (index: number, address: string) => {
    let tempManagers: string[] = [];
    managers.forEach((item) => tempManagers.push(item));
    tempManagers[index] = address;
    setManagers(tempManagers);
  };

  const addManagerToList = () => {
    let tempManagers: string[] = [];
    managers.forEach((item) => tempManagers.push(item));
    tempManagers.push("");
    setManagers(tempManagers);
  };

  const handleChangeFixedStartTime = async () => {
    setIsUpdatingFixedStartedAt(true);
    try {
      let nftContract = new ethers.Contract(
        fixedNftAddress,
        getAliveFixedSongAbi(),
        signer
      );

      // let songURI = await nftContract.tokenURI(1);
      // let contractURI = await nftContract.contractURI();
      // let currentstartTime = await nftContract.startedAt();
      // console.log(songURI, contractURI, Number(currentstartTime));

      let txnSetTime = await nftContract.updateStartAt(
        Number(Math.floor(new Date(startedAtFixed).getTime() / 1000))
      );
      await txnSetTime.wait(2); // wait 2 confirmations
      notification.success({ message: "Successfully!" });
    } catch (error: any) {
      console.log(error);
      notification.error({ message: error["reason"] });
    }
    setIsUpdatingFixedStartedAt(false);
  };

  const handleChangeBondedStartTime = async () => {
    setIsUpdatingBondedStartedAt(true);
    try {
      let nftContract = new ethers.Contract(
        bondedNftAddress,
        getAliveBondedSongAbi(),
        signer
      );

      // let songURI = await nftContract.tokenURI(1);
      // let contractURI = await nftContract.contractURI();
      // let currentstartTime = await nftContract.startedAt();
      // console.log(songURI, contractURI, Number(currentstartTime));

      let txnSetTime = await nftContract.updateStartAt(
        Number(Math.floor(new Date(startedAtBonded).getTime() / 1000))
      );
      await txnSetTime.wait(2); // wait 2 confirmations
      notification.success({ message: "Successfully!" });
    } catch (error: any) {
      notification.error({ message: error["reason"] });
    }
    setIsUpdatingBondedStartedAt(false);
  };

  const handleChangeDutchStartTime = async () => {
    setIsUpdatingDutchStartedAt(true);
    try {
      let nftContract = new ethers.Contract(
        dutchNftAddress,
        getAliveDutchSongAbi(),
        signer
      );

      // let songURI = await nftContract.tokenURI(1);
      // let contractURI = await nftContract.contractURI();
      // let currentstartTime = await nftContract.startedAt();
      // console.log(songURI, contractURI, Number(currentstartTime));

      let txnSetTime = await nftContract.updateStartAt(
        Number(Math.floor(new Date(startedAtDutch).getTime() / 1000))
      );
      await txnSetTime.wait(2); // wait 2 confirmations
      notification.success({ message: "Successfully!" });
    } catch (error: any) {
      notification.error({ message: error["reason"] });
    }
    setIsUpdatingDutchStartedAt(false);
  };

  const removeManagerFromList = (index: number) => {
    let tempManagers: string[] = [];
    managers.forEach((item: string, itemIdx: number) => {
      if (index !== itemIdx) tempManagers.push(item);
    });
    setManagers(tempManagers);
  };

  const handleAddManagers = async () => {
    let newManagers = managers.filter((item) => item !== "");
    setIsAdd(true);
    try {
      let addManagersTx = await aliveRegistryContract.addMangerWallets(
        newManagers
      );
      await addManagersTx.wait();
    } catch (error) {
      console.log(error);
    }
    setIsAdd(false);
  };

  const updateRemoveManagerList = (index: number, address: string) => {
    let tempManagers: string[] = [];
    removeList.forEach((item) => tempManagers.push(item));
    tempManagers[index] = address;
    setRemoveList(tempManagers);
  };

  const addRemoveManagerToList = () => {
    let tempManagers: string[] = [];
    removeList.forEach((item) => tempManagers.push(item));
    tempManagers.push("");
    setRemoveList(tempManagers);
  };

  const removeManagerFromRemoveList = (index: number) => {
    let tempManagers: string[] = [];
    removeList.forEach((item: string, itemIdx: number) => {
      if (index !== itemIdx) tempManagers.push(item);
    });
    setRemoveList(tempManagers);
  };

  const handleRemoveManagers = async () => {
    let removeManagerList = removeList.filter((item) => item !== "");
    setIsRemove(true);
    try {
      let removeManagersTx = await aliveRegistryContract.removeManagerWallets(
        removeManagerList
      );
      await removeManagersTx.wait();
    } catch (error) {
      console.log(error);
    }
    setIsRemove(false);
  };

  // function setStartTimeFunc(e) {
  //   setStartTime(e.target.value);
  //   console.log(e.target.value);
  // }

  return (
    <div className="container mx-auto">
      <Typography.Title level={3}>Manager</Typography.Title>
      <Typography.Title level={4}>Add Manager</Typography.Title>
      <Row gutter={16}>
        {managers.map((manager: string, index: number) => (
          <Col span={6} key={index} className="mb-2">
            <Input
              placeholder="Manager Address"
              value={manager}
              onChange={(e) => updateManagerList(index, e.target.value)}
              suffix={
                <DeleteOutlined onClick={() => removeManagerFromList(index)} />
              }
            />
          </Col>
        ))}
        <Col
          span={6}
          className="text-center cursor-pointer"
          onClick={() => addManagerToList()}
        >
          <PlusCircleOutlined />
        </Col>
      </Row>
      <div className="flex">
        <Button
          type="primary"
          className="ml-auto"
          onClick={() => handleAddManagers()}
          loading={isAdd}
        >
          Add Managers
        </Button>
      </div>
      <Typography.Title level={4}>Remove Manager</Typography.Title>
      <Row gutter={16}>
        {removeList.map((manager: string, index: number) => (
          <Col span={6} key={index} className="mb-2">
            <Input
              placeholder="Manager Address"
              value={manager}
              onChange={(e) => updateRemoveManagerList(index, e.target.value)}
              suffix={
                <DeleteOutlined
                  onClick={() => removeManagerFromRemoveList(index)}
                />
              }
            />
          </Col>
        ))}
        <Col
          span={6}
          className="text-center cursor-pointer"
          onClick={() => addRemoveManagerToList()}
        >
          <PlusCircleOutlined />
        </Col>
      </Row>
      <div className="flex">
        <Button
          type="primary"
          className="ml-auto"
          onClick={() => handleRemoveManagers()}
          loading={isRemove}
        >
          Remove Managers
        </Button>
      </div>
      <Typography.Title level={4}>Update the started at Fixed</Typography.Title>
      <div className="flex mb-4">
        <DatePicker
          format="YYYY-MM-DD HH:mm:ss"
          showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }}
          onChange={(e) => setStartedAtFixed(e)}
          value={startedAtFixed}
        />
        <Input
          type="text"
          placeholder="input address of nft"
          onChange={(e) => setFixedNftAddress(e.target.value)}
          value={fixedNftAddress}
        />
        <Button
          type="primary"
          className="ml-auto mt-4"
          onClick={() => handleChangeFixedStartTime()}
          loading={isUpdatingFixedStartedAt}
        >
          Change start time
        </Button>
      </div>
      <br />
      <Typography.Title level={4}>
        Update the started at Bonded
      </Typography.Title>
      <div className="flex mb-4">
        <DatePicker
          format="YYYY-MM-DD HH:mm:ss"
          showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }}
          onChange={(e) => setStartedAtBonded(e)}
          value={startedAtBonded}
        />
        <Input
          type="text"
          placeholder="input address of nft"
          onChange={(e) => setBondedNftAddress(e.target.value)}
          value={bondedNftAddress}
        />
        <Button
          type="primary"
          className="ml-auto mt-4"
          onClick={() => handleChangeBondedStartTime()}
          loading={isUpdatingBondedStartedAt}
        >
          Change start time
        </Button>
      </div>
      <br />
      <Typography.Title level={4}>Update the started at Dutch</Typography.Title>
      <div className="flex mb-4">
        <DatePicker
          format="YYYY-MM-DD HH:mm:ss"
          showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }}
          onChange={(e) => setStartedAtDutch(e)}
          value={startedAtDutch}
        />
        <Input
          type="text"
          placeholder="input address of nft"
          onChange={(e) => setDutchNftAddress(e.target.value)}
          value={dutchNftAddress}
        />
        <Button
          type="primary"
          className="ml-auto mt-4"
          onClick={() => handleChangeDutchStartTime()}
          loading={isUpdatingDutchStartedAt}
        >
          Change start time
        </Button>
      </div>
      <br />
      <div className="mt-4">
        <AddSongImp />
      </div>
      <div className="mt-4">
        <UpgradeBand />
      </div>
      <div className="mt-4">
        <UpgradeRegistry />
      </div>
      <div className="mt-4">
        <UpgradeHouse />
      </div>
      <div className="mt-4">
        <UpgradeBondedSong />
      </div>
    </div>
  );
};

export default Manager;
