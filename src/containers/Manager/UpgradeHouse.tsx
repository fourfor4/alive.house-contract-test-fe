import { Button, Form, Typography, Input, notification } from "antd";
import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import {
  getAliveRegistryAbi,
  getAliveRegistryV2Abi,
  getProxyAdminAbi,
} from "../../utils/abis";
import {
  getAliveHouseAddress,
  getAliveRegistryAddress,
} from "../../utils/contractAddress";

const UpgradeHouse: React.FC = () => {
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

  const handleUpgradeAliveHouse = async (value: any) => {
    console.log(value.upgradedband);
    let newhouse = value.newhouse;
    setIsUpgrade(true);
    try {
      let upgradeHouseTx = await aliveRegistryContract.upgradeVersion(
        getAliveHouseAddress(),
        newhouse,
        1
      );
      await upgradeHouseTx.wait();
      notification.success({
        message: "Upgrade AliveHouse Contract Successfully!",
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
      let currentVersion = await aliveRegistryContract.houseVersion();
      console.log("currentVersion : ", currentVersion);
      setCurrentVersion(Number(currentVersion));
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
        Upgrade House (Current Version - {currentVersion})
      </Typography.Title>
      <div className="flex justify-around mb-4"></div>
      <Form onFinish={handleUpgradeAliveHouse}>
        <Form.Item
          rules={[
            {
              required: true,
              message: "Please input house contract for upgrade!",
            },
          ]}
          name={"newhouse"}
          label={"Upgrade House Address"}
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
export default UpgradeHouse;
