import { Button, Form, Typography, Input, notification } from "antd";
import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import {
  getAliveRegistryAbi,
  getAliveRegistryV2Abi,
  getProxyAdminAbi,
} from "../../utils/abis";
import { getAliveRegistryAddress } from "../../utils/contractAddress";

const UpgradeRegistry: React.FC = () => {
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
  const [isTest, setIsTest] = useState(false);

  const handleUpgradeRegistry = async (value: any) => {
    console.log(value.upgradedband);
    let upgradedRegistryAddress = value.newregistry;
    setIsUpgrade(true);
    try {
      console.log(Number(await aliveRegistryContract.feePercent()), await aliveRegistryContract.aliveHouseRoyaltyReceiver());
      
      let upgradeRegistryTx = await aliveRegistryContract.upgradeVersion(
        getAliveRegistryAddress(),
        upgradedRegistryAddress,
        0
      );
      await upgradeRegistryTx.wait();
      notification.success({
        message: "Upgrade Registry Contract Successfully!",
      });
      getBalance();
    } catch (error: any) {
      console.log(error);
      notification.error({
        message: error["reason"],
      });
    }
    setIsUpgrade(false);
  };

  const getBalance = async () => {
    try {
      let currentVersion = await aliveRegistryContract.registryVersion();
      console.log("currentVersion : ", currentVersion);
      setCurrentVersion(Number(currentVersion));
    } catch (error: any) {
      console.log(error);
      notification.error({
        message: error["reason"],
      });
    }
  };

  const getTestVal = async () => {
    try {
      aliveRegistryContract = new ethers.Contract(
        getAliveRegistryAddress(),
        getAliveRegistryV2Abi(),
        signer
      );
      let val = await aliveRegistryContract.versionTest();
      notification.success({
        message: val,
      });
    } catch (error: any) {
      console.log(error);
      notification.error({
        message: error["reason"],
      });
    }
  };

  const setTestVal = async (value: any) => {
    setIsTest(true);
    try {
      let testval = value.testval;

      aliveRegistryContract = new ethers.Contract(
        getAliveRegistryAddress(),
        getAliveRegistryV2Abi(),
        signer
      );

      let setValTx = await aliveRegistryContract.setVersionTest(testval);
      await setValTx.wait();
      notification.success({
        message: "Set Test Successfully!",
      });
    } catch (error: any) {
      console.log(error);
      notification.error({
        message: error["reason"],
      });
    }
    setIsTest(false);
  };

  useEffect(() => {
    getBalance();
  }, []);

  return (
    <div>
      <Typography.Title level={3}>
        Upgrade Registry (Current Version - {currentVersion})
      </Typography.Title>
      <div className="flex justify-around mb-4"></div>
      <Form onFinish={handleUpgradeRegistry}>
        <Form.Item
          rules={[
            {
              required: true,
              message: "Please input registry contract for upgrade!",
            },
          ]}
          name={"newregistry"}
          label={"Upgrade Registry Address"}
        >
          <Input />
        </Form.Item>
        <Form.Item className="text-right">
          <Button type="primary" htmlType="submit" loading={isUpgrade}>
            Upgrade
          </Button>
        </Form.Item>
      </Form>
      {currentVersion > 1 && (
        <div>
          <Typography.Title level={5}>Test Version 2</Typography.Title>
          <Button type="primary" onClick={() => getTestVal()}>
            Version Test
          </Button>
          <Form onFinish={setTestVal}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Please input test Val!",
                },
              ]}
              name={"testval"}
              label={"Test Val"}
            >
              <Input />
            </Form.Item>
            <Form.Item className="text-right">
              <Button type="primary" htmlType="submit" loading={isTest}>
                Set Test Val
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
};
export default UpgradeRegistry;
