import AliveHouse from "../config/abis/AliveHouse.json";
import AliveRegistry from "../config/abis/AliveRegistry.json";
import AliveBand from "../config/abis/AliveBand.json";
import AliveFixedSong from "../config/abis/AliveFixedSong.json";
import AliveBondedSong from "../config/abis/AliveBondedSong.json";
import AliveDutchSong from "../config/abis/AliveDutchSong.json";

import AliveBandV2 from "../config/abis/AliveBandV2.json";
import AliveNewSong from "../config/abis/AliveNewSong.json";

import ProxyAdmin from "../config/abis/ProxyAdmin.json";

import AliveRegistryV2 from "../config/abis/AliveRegistryV2.json";
import AliveBondedSongV2 from "../config/abis/AliveBondedSongV2.json";

export const getAliveHouseAbi = () => {
  return AliveHouse.abi;
};

export const getAliveRegistryAbi = () => {
  return AliveRegistry.abi;
};

export const getAliveBandAbi = () => {
  return AliveBand.abi;
};

export const getAliveFixedSongAbi = () => {
  return AliveFixedSong.abi;
};

export const getAliveBondedSongAbi = () => {
  return AliveBondedSong.abi;
};

export const getAliveDutchSongAbi = () => {
  return AliveDutchSong.abi;
};

export const getAliveBandV2Abi = () => {
  return AliveBandV2.abi;
};

export const getAliveNewSongAbi = () => {
  return AliveNewSong.abi;
};

export const getProxyAdminAbi = () => {
  return ProxyAdmin.abi;
};

export const getAliveRegistryV2Abi = () => {
  return AliveRegistryV2.abi;
};

export const getAliveBondedSongV2Abi = () => {
  return AliveBondedSongV2.abi;
};
