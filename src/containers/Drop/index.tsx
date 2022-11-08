import React, { useState, useEffect } from "react";
import { BigNumber, Contract, ethers, Signer } from "ethers";
import { Col, Collapse, Row, Typography } from "antd";
import { getAliveHouseAddress } from "../../utils/contractAddress";
import { getAliveBandAbi, getAliveHouseAbi } from "../../utils/abis";
import DropCard from "./DropCard";

const { Panel } = Collapse;

const Drop: React.FC = () => {
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  let signer = provider.getSigner();
  let aliveHouseContract = new ethers.Contract(
    getAliveHouseAddress(),
    getAliveHouseAbi(),
    signer
  );

  const [bands, setBands] = useState<any[]>([]);

  const getBalance = async () => {
    try {
      const bands = await aliveHouseContract.getAllBands();
      let tempBands = [];
      for (let i = 0; i < bands.length; i++) {
        let tempBand = {
          bandId: bands[i].bandId,
          bandAddress: bands[i].bandAddress,
          bandAdmin: bands[i].bandAdmin,
          bandName: bands[i].bandName,
          songs: [],
        };
        let aliveBandContract = new ethers.Contract(
          tempBand.bandAddress,
          getAliveBandAbi(),
          signer
        );
        let allSongs = await aliveBandContract.getAllSongs();
        tempBand.songs = allSongs;
        tempBands.push(tempBand);
      }
      console.log(tempBands);
      setBands(tempBands);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBalance();
  }, []);

  const renderSongCard = (songType: number, contractAddress: string) => {
    return (
      <DropCard songType={Number(songType)} contractAddress={contractAddress} />
    );
  };

  return (
    <div className="container mx-auto">
      <Typography.Title level={3}>Drop & Claim & AirDrop</Typography.Title>

      <Collapse defaultActiveKey={["0"]}>
        {bands.map((band: any, index: number) => (
          <Panel
            header={
              <div className="flex justify-between">
                <span>{band.bandName}</span>
              </div>
            }
            key={index}
          >
            <div>
              <Row gutter={16}>
                {band.songs.map((song: any, index: number) => (
                  <Col span={8} key={index}>
                    {renderSongCard(Number(song.songType), song.songContract)}
                  </Col>
                ))}
              </Row>
            </div>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default Drop;
