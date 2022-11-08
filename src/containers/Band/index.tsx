import React, { useState, useEffect } from "react";
import { Button, Form, Input, Typography, Row, Col, Card } from "antd";
import { Contract, ethers, Signer } from "ethers";
import {
  getAliveBandAbi,
  getAliveHouseAbi,
  getAliveRegistryAbi,
} from "../../utils/abis";
import {
  getAliveHouseAddress,
  getAliveRegistryAddress,
} from "../../utils/contractAddress";
import { useParams } from "react-router-dom";
import CreateSong from "../CreateSong";
import { formatAddress } from "../../utils";

const Band: React.FC = () => {
  const { bandId } = useParams();
  const [band, setBand] = useState<any>({});
  const [songs, setSongs] = useState([]);

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

  const [currentVersion, setCurrentVersion] = useState(0);

  const getBand = async () => {
    try {
      let band = await aliveHouseContract.getBandById(bandId);
      setBand(band);
      let allband = await aliveHouseContract.getallBands();
     console.log(allband)
      let currentVersion = await aliveRegistryContract.bandVersion();
      setCurrentVersion(Number(currentVersion));
    } catch (error) {}
  };

  const getAllSongs = async () => {
    try {
      let aliveBandContract = new ethers.Contract(
        band.bandAddress,
        getAliveBandAbi(),
        signer
      );
      let allSongs = await aliveBandContract.getAllSongs();
      let bandId = await aliveBandContract.bandId();
      console.log(bandId);
      console.log(allSongs);
      setSongs(allSongs);
    } catch (error) {
      console.log(error);
    }
  };

  const songTitle = (song: any) => {
    switch (Number(song.songType)) {
      case 1:
        return Number(song.songType) + ": Fixed";
      case 2:
        return Number(song.songType) + ": Bonded";
      case 3:
        return Number(song.songType) + ": Dutch";
      case 4:
        return Number(song.songType) + ": New Type";
      default:
        break;
    }
  };

  useEffect(() => {
    getBand();
  }, []);

  useEffect(() => {
    if (band.bandAddress) {
      getAllSongs();
    }
  }, [band]);

  return (
    <div>
      <div className="flex items-baseline">
        <Typography.Title level={3}>
          Band {bandId} : {band.bandName}
        </Typography.Title>
        <Typography.Title level={5} className="ml-4">
          (Band Address: {formatAddress(band.bandAddress)}, Creator:{" "}
          {formatAddress(band.bandAdmin)}, Version: {currentVersion})
        </Typography.Title>
      </div>

      <div className="mt-4">
        <CreateSong
          band={band}
          getAllSongs={getAllSongs}
          bandVersion={"v" + currentVersion}
        />
      </div>
      <div className="mt-4">
        <Typography.Title level={3}>Songs</Typography.Title>
        <Row gutter={16}>
          {songs.map((song: any, index) => (
            <Col span={6} key={index}>
              <Card title={songTitle(song)}>
                <Typography.Text className="text-center">
                  {formatAddress(song.songContract)}
                </Typography.Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Band;
