import React, { useState, useEffect } from "react";
import { BigNumber, Contract, ethers, Signer } from "ethers";
import { getAliveHouseAddress } from "../../utils/contractAddress";
import { getAliveBandAbi, getAliveHouseAbi } from "../../utils/abis";
import { Col, Collapse, Descriptions, Row, Typography } from "antd";
import { formatAddress } from "../../utils";
import FixedSongCard from "./FixedSongCard";
import BondedSongCard from "./BondedSongCard";
import DutchSongCard from "./DutchSongCard";
import NewTypeSongCard from "./NewTypeSongCard";
import GetSongInfo from "./GetSongInfo";

const { Panel } = Collapse;

const BuySong: React.FC = () => {
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  let signer = provider.getSigner();
  let aliveHouseContract = new ethers.Contract(
    getAliveHouseAddress(),
    getAliveHouseAbi(),
    signer
  );

  const [bands, setBands] = useState<any[]>([]);

  const [allSongs, setAllSongs] = useState<any[]>([]);

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
        // for (let j = 0; j < allSongs.length; j++) {
        // }
      }
      console.log(tempBands);
      let allSongs: any[] = [];
      tempBands.forEach((band) => {
        band.songs.forEach((song) => {
          allSongs.push(song);
        });
      });
      setAllSongs(allSongs);
      setBands(tempBands);
    } catch (error) {
      console.log(error);
    }
  };

  const renderSongCard = (songType: number, contractAddress: string) => {
    switch (songType) {
      case 1:
        return (
          <FixedSongCard
            songType={Number(songType)}
            contractAddress={contractAddress}
          />
        );
      case 2:
        return (
          <BondedSongCard
            songType={Number(songType)}
            contractAddress={contractAddress}
          />
        );
      case 3:
        return (
          <DutchSongCard
            songType={Number(songType)}
            contractAddress={contractAddress}
          />
        );
      case 4:
        return (
          <NewTypeSongCard
            songType={Number(songType)}
            contractAddress={contractAddress}
          />
        );
      default:
        break;
    }
  };

  useEffect(() => {
    getBalance();
  }, []);

  return (
    <div>
      <Typography.Title level={3}>Buy Song</Typography.Title>
      <GetSongInfo />
      <Descriptions bordered column={2} className="mb-4">
        {allSongs.map((song: any, index: number) => (
          <>
            <Descriptions.Item label={"Song Type"}>
              {Number(song.songType) == 1
                ? "Fixed"
                : Number(song.songType) == 2
                ? "Bonded"
                : "Dutch"}
            </Descriptions.Item>
            <Descriptions.Item label={"Contract Address"}>
              {song.songContract}
            </Descriptions.Item>
          </>
        ))}
      </Descriptions>
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

export default BuySong;
