import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  notification,
  Row,
  Typography,
} from "antd";
import { Contract, ethers, Signer } from "ethers";
import React, { useEffect, useState } from "react";
import { formatAddress, getAccount } from "../../utils";
import { getAliveHouseAbi, getAliveRegistryAbi } from "../../utils/abis";
import {
  getAliveHouseAddress,
  getAliveRegistryAddress,
} from "../../utils/contractAddress";
import { jsonRpc } from "../../utils/JsonRpc";
import { useNavigate } from "react-router";
import { NavLink } from "react-router-dom";
import { EyeOutlined } from "@ant-design/icons";

const Bands: React.FC = () => {
  const navigation = useNavigate();
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  let signer = provider.getSigner();
  let aliveHouseContract = new ethers.Contract(
    getAliveHouseAddress(),
    getAliveHouseAbi(),
    signer
  );

  let aliveRegistryContract = new ethers.Contract(
    getAliveRegistryAddress(),
    getAliveRegistryAbi(),
    signer
  );
  // const provider = new ethers.providers.JsonRpcProvider(
  //   process.env.REACT_APP_MATICMUMBAI
  // );
  // const signer = new ethers.Wallet(
  //   process.env.REACT_APP_PRIVATE_KEY + "",
  //   provider
  // );
  // let aliveHouseContract = new ethers.Contract(
  //   getAliveHouseAddress(),
  //   getAliveHouseAbi(),
  //   signer
  // );

  const [bandName, setBandName] = useState("");
  const [isCreateBand, setIsCreateBand] = useState(false);
  const [bands, setBands] = useState([]);
  const [currentVersion, setCurrentVersion] = useState(0);

  useEffect(() => {
    getAllBands();
  }, []);

  const onFinish = async (values: any) => {
    console.log(values);
    console.log(jsonRpc());
    // @ts-ignore
    await handleCreateBand();
  };

  const onValuesChange = (values: any) => {
    setBandName(values.bandname);
  };

  const handleCreateBand = async () => {
    try {
      setIsCreateBand(true);
      const createBand = await aliveHouseContract.createAliveBand(
        signer.getAddress(),
        bandName
      );
      await createBand.wait();
      notification.success({
        message: "Create Band Successfully!",
      });
      setBandName("");
      setIsCreateBand(false);
      await getAllBands();
    } catch (error: any) {
      notification.error({
        message: error["reason"],
      });
      setIsCreateBand(false);
    }
  };

  const getAllBands = async () => {
    try {
      const bands = await aliveHouseContract.getAllBands();
      setBands(bands);
      const currentVersion = await aliveRegistryContract.bandVersion();
      setCurrentVersion(Number(currentVersion));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto">
      <Typography.Title level={3}>
        Create Band - (Current Version - {currentVersion})
      </Typography.Title>
      <Form onFinish={onFinish} onValuesChange={onValuesChange}>
        <Form.Item
          name={"bandname"}
          label={"Band Name"}
          rules={[
            {
              required: true,
              message: `Please input Band Name!`,
            },
          ]}
        >
          <Input value={bandName} />
        </Form.Item>
        <Form.Item className="text-right">
          <Button type="primary" htmlType="submit" loading={isCreateBand}>
            Create Band
          </Button>
        </Form.Item>
      </Form>
      <Divider />
      <Typography.Title level={3}>Bands</Typography.Title>
      <div>
        <Row gutter={16}>
          {bands.map((band: any, index: number) => (
            <Col span={6} key={index} className="mb-4">
              <Card
                title={band.bandName}
                extra={
                  <NavLink to={`/band/${parseInt(band.bandId)}`}>
                    <EyeOutlined />
                  </NavLink>
                }
              >
                <Typography.Text className="text-center">
                  {formatAddress(band.bandAddress)}
                </Typography.Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Bands;
