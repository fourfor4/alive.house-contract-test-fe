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
  getAliveDutchSongAbi,
  getAliveFixedSongAbi,
} from "../../utils/abis";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";

type Props = {
  contractAddress: string;
  songType: number;
};

const DropCard: React.FC<Props> = ({ contractAddress, songType }) => {
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  let signer = provider.getSigner();

  const [totalSupply, setTotalSupply] = useState(0);
  const [maxMintAmount, setMaxMintAmount] = useState(0);
  const [dropAmount, setDropAmount] = useState(0);
  const [allDrops, setAllDrops] = useState([]);
  const [isDrop, setIsDrop] = useState(false);
  const [claimAllTokenId, setClaimAllTokenId] = useState(1);
  const [isClaim, setIsClaim] = useState(false);

  const [airDropList, setAirDropList] = useState<string[]>([""]);
  const [isAirDrop, setIsAirDrop] = useState(false);
  const [amountForEachAirDrop, setAmountForEachAirDrop] = useState(1);

  const setContract = () => {
    switch (songType) {
      case 1:
        return new ethers.Contract(
          contractAddress,
          getAliveFixedSongAbi(),
          signer
        );
      case 2:
        return new ethers.Contract(
          contractAddress,
          getAliveBondedSongAbi(),
          signer
        );
      case 3:
        return new ethers.Contract(
          contractAddress,
          getAliveDutchSongAbi(),
          signer
        );
      default:
        return new ethers.Contract(
          contractAddress,
          getAliveFixedSongAbi(),
          signer
        );
    }
  };

  let songContract = setContract();

  const getSongType = (songType: number) => {
    switch (songType) {
      case 1:
        return "Fixed";
      case 2:
        return "Bonded";
      case 3:
        return "Dutch";
      default:
        break;
    }
  };

  const getBalance = async () => {
    try {
      setTotalSupply(await songContract.totalSupply());
      setMaxMintAmount(await songContract.maxMintAmount());
      let allDrops = await songContract.getAllDrops();
      console.log(allDrops);
      setAllDrops(allDrops);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleDrop = async () => {
    setIsDrop(true);
    try {
      if (dropAmount > 1) {
        let dropTx = await songContract.newDrop({
          value: ethers.utils.parseEther(dropAmount.toString()),
        });
        await dropTx.wait();
        getBalance();
      } else {
        notification.error({
          message: "Drop Amount has to be over 1.",
        });
      }
    } catch (error: any) {
      notification.error({
        message: error["reason"],
      });
    }
    setIsDrop(false);
  };

  const handleClaimAllDrop = async () => {
    setIsClaim(true);
    try {
      let claimStatus = await songContract.getClaimStatusByTokenID(
        claimAllTokenId
      );
      let allClaimStatus = claimStatus.reduce((a: any, b: any) => a * b, true);
      console.log(allClaimStatus);
      if (allClaimStatus === 1) {
        notification.error({
          message: "Claimed all drops already!",
        });
      } else {
        let claimAllDropsTx = await songContract.claimAllDrop(claimAllTokenId);
        await claimAllDropsTx.wait();
        notification.success({
          message: "Claimed all drops successfully!",
        });
      }
      getBalance();
    } catch (error: any) {
      notification.error({
        message: error["reason"],
      });
    }
    setIsClaim(false);
  };

  const handleClaim = async (value: any) => {
    const { dropid, tokenid } = value;
    setIsClaim(true);
    try {
      let claimTx = await songContract.claimDrop(dropid, tokenid);
      await claimTx.wait();
      notification.success({
        message: "Claimed drop successfully",
      });
      getBalance();
    } catch (error: any) {
      notification.error({
        message: error["reason"],
      });
    }
    setIsClaim(false);
  };

  const addAirDropList = () => {
    let tempAirDropList: string[] = [];
    airDropList.forEach((item) => tempAirDropList.push(item));
    tempAirDropList.push("");
    setAirDropList(tempAirDropList);
  };

  const removeFromAirDropList = (index: number) => {
    let tempAirDropList: string[] = [];
    airDropList.forEach((item: string, itemIdx: number) => {
      if (index !== itemIdx) tempAirDropList.push(item);
    });
    setAirDropList(tempAirDropList);
  };

  const updateAirDropList = (index: number, address: string) => {
    let tempAirDropList: string[] = [];
    airDropList.forEach((item) => tempAirDropList.push(item));
    tempAirDropList[index] = address;
    setAirDropList(tempAirDropList);
  };

  const handleAirDrop = async () => {
    let airDropLi = airDropList.filter((item) => item !== "");
    console.log(airDropLi);
    setIsAirDrop(true);
    try {
      let airDropTx = await songContract.batchAirDrop(
        airDropLi,
        amountForEachAirDrop
      );
      await airDropTx.wait();
      notification.success({
        message: "AirDrop Successfully!",
      });
      getBalance();
    } catch (error: any) {
      notification.error({
        message: error["reason"],
      });
    }
    setIsAirDrop(false);
  };

  useEffect(() => {
    getBalance();
  }, []);

  return (
    <div>
      <Card
        title={getSongType(songType)}
        extra={formatAddress(contractAddress)}
      >
        <Typography.Title level={5}>AirDrop</Typography.Title>
        <div className="border border-gray-400 p-2 mb-2">
          {airDropList.map((item, index) => (
            <div className="mb-2" key={index}>
              <Input
                value={item}
                size="small"
                onChange={(e) => updateAirDropList(index, e.target.value)}
                suffix={
                  index !== 0 && (
                    <DeleteOutlined
                      onClick={() => removeFromAirDropList(index)}
                    />
                  )
                }
              />
            </div>
          ))}
          <div className="flex mt-2 items-center">
            AmountForEach :
            <InputNumber
              value={amountForEachAirDrop}
              onChange={(e) => setAmountForEachAirDrop(e)}
            />
            <div className="ml-auto">
              <PlusCircleOutlined
                className="cursor-pointer"
                onClick={() => addAirDropList()}
              />
              <Button
                type="primary"
                className="ml-2"
                onClick={() => handleAirDrop()}
                loading={isAirDrop}
              >
                AirDrop
              </Button>
            </div>
          </div>
        </div>
        <Descriptions bordered column={1}>
          <Descriptions.Item label={"Sup / Max"}>
            {Number(totalSupply) + " / " + maxMintAmount}
          </Descriptions.Item>
        </Descriptions>
        <div className="flex justify-between mt-2">
          Drop Amount
          <InputNumber value={dropAmount} onChange={(e) => setDropAmount(e)} />
          <Button
            type="primary"
            placeholder="Drop Amount"
            onClick={() => handleDrop()}
            loading={isDrop}
          >
            Drop
          </Button>
        </div>
        <div className="flex justify-between mt-2">
          Claim All Token Id
          <InputNumber
            value={claimAllTokenId}
            onChange={(e) => setClaimAllTokenId(Math.floor(e))}
          />
          <Button
            type="primary"
            placeholder="Drop Amount"
            onClick={() => handleClaimAllDrop()}
            loading={isClaim}
          >
            Claim All
          </Button>
        </div>
        <Typography.Title level={5}>Drops</Typography.Title>

        {allDrops.map((drop: any, index: number) => (
          <div className="border border-gray-400 p-2 mb-2" key={index}>
            <Descriptions bordered column={1} className="mb-2">
              <Descriptions.Item label={"Id"}>
                {Number(drop.dropID)}
              </Descriptions.Item>
              <Descriptions.Item label={"TotalAmount"}>
                {Number(ethers.utils.formatEther(drop.dropTotalAmount))}
              </Descriptions.Item>
              <Descriptions.Item label={"AmountPerNFT"}>
                {Number(ethers.utils.formatEther(drop.dropPerNFT))}
              </Descriptions.Item>
              <Descriptions.Item label={"Claime / DropNum"}>
                {Number(drop.totalClaimed) + " / " + Number(drop.dropNumber)}
              </Descriptions.Item>
            </Descriptions>

            <Form
              onFinish={handleClaim}
              initialValues={{
                dropid: Number(drop.dropID),
                tokenid: 1,
              }}
            >
              <Form.Item name={"dropid"} label={"Drop ID"} hidden>
                <Input />
              </Form.Item>
              <Form.Item
                name={"tokenid"}
                label={"Token ID"}
                rules={[
                  {
                    required: true,
                    message: `Please input Band Name!`,
                  },
                ]}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item className="text-right">
                <Button type="primary" htmlType="submit" loading={isClaim}>
                  Claim
                </Button>
              </Form.Item>
            </Form>
          </div>
        ))}
      </Card>
    </div>
  );
};

export default DropCard;
