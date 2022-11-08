import { Button, Form, Typography, Input, notification } from "antd";
import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import {
  getAliveRegistryAbi,
  getAliveRegistryV2Abi,
  getProxyAdminAbi,
} from "../../utils/abis";
import { getAliveRegistryAddress } from "../../utils/contractAddress";

const UpgradeBondedSong: React.FC = () => {
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  let signer = provider.getSigner();

  let aliveRegistryContract = new ethers.Contract(
    getAliveRegistryAddress(),
    getAliveRegistryAbi(),
    signer
  );

  const [isUpgrade, setIsUpgrade] = useState(false);
  const [currentVersion, setCurrentVersion] = useState(0);
  const [upcountRate, setUpcountRate] = useState(0);

  const handleUpgradeRegistry = async (value: any) => {
    console.log(value.upgradedband);
    let newbonded = value.newbonded;
    setIsUpgrade(true);
    try {
      let upgradeBondedSongTx = await aliveRegistryContract.upgradeAliveSongImp(
        2,
        newbonded
      );
      await upgradeBondedSongTx.wait();
      notification.success({
        message: "Upgrade Bonded Song Contract Successfully!",
      });
      getBalance();
    } catch (error: any) {
      notification.error({
        message: error["reason"],
      });
    }
    setIsUpgrade(false);
  };

  const getBalance = async () => {
    try {
      let bondedSong = await aliveRegistryContract.getAliveSongImp(2);
      setCurrentVersion(Number(bondedSong.songVersion));
    } catch (error: any) {
      console.log(error);
      notification.error({
        message: error["reason"],
      });
    }
  };

  useEffect(() => {
    getBalance();
  }, []);

  return (
    <div>
      <Typography.Title level={3}>
        Upgrade Bonded Song (Current Version - {currentVersion})
      </Typography.Title>
      <div className="flex justify-around mb-4"></div>
      <Form onFinish={handleUpgradeRegistry}>
        <Form.Item
          rules={[
            {
              required: true,
              message: "Please input new contract for upgrade!",
            },
          ]}
          name={"newbonded"}
          label={"Upgrade Bonded Song Address"}
        >
          <Input />
        </Form.Item>
        <Form.Item className="text-right">
          <Button type="primary" htmlType="submit" loading={isUpgrade}>
            Upgrade
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default UpgradeBondedSong;
