import { Form, Typography, Input, Button, notification } from "antd";
import { ethers } from "ethers";

import React, { useState, useEffect } from "react";
import { getAliveRegistryAbi } from "../../utils/abis";
import { getAliveRegistryAddress } from "../../utils/contractAddress";

const AddSongImp: React.FC = () => {
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  let signer = provider.getSigner();
  let aliveRegistryContract = new ethers.Contract(
    getAliveRegistryAddress(),
    getAliveRegistryAbi(),
    signer
  );

  const [isAddNewSong, setIsAddNewSong] = useState(false);
  const [totalSongTypes, setTotalSongTypes] = useState(0);

  const handleAddNewSong = async (value: any) => {
    let newAddress = value.newsong;
    console.log(newAddress);
    setIsAddNewSong(true);
    try {
      let addNewSongTx = await aliveRegistryContract.addNewSongImp(
        newAddress,
        Number(44)
      );
      await addNewSongTx.wait();
      notification.success({
        message: "Add New type of Song Imp successfully!",
      });
    } catch (error: any) {
      notification.error({
        message: error["reason"],
      });
    }
    setIsAddNewSong(false);
  };

  const getBalance = async () => {
    try {
      let songTypes = await aliveRegistryContract.totalSongTypes();
      setTotalSongTypes(Number(songTypes));
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
        Add New Song Imp - Total Song Types : {totalSongTypes}
      </Typography.Title>
      <Form onFinish={handleAddNewSong}>
        <Form.Item
          name={"newsong"}
          label={"New Song Imp"}
          rules={[
            {
              required: true,
              message: `Please input New Song Imp Address!`,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item className="text-right">
          <Button type="primary" htmlType="submit" loading={isAddNewSong}>
            Add New Song Imp
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddSongImp;
