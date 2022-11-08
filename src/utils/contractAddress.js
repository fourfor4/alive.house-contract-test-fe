import gameVersion from "./gameVersion";

export const getAliveRegistryAddress = () => {
  if (gameVersion == "test") {
    return "0x6683a11BA663B02ef5550cDb58dbF7e09f670654";
  } else if (gameVersion == "main") {
    return "0x0788cbb0eDC91F9f1572bE52686F27FF358617FC";
  }
  return "0x0788cbb0eDC91F9f1572bE52686F27FF358617FC";
};

export const getAliveHouseAddress = () => {
  if (gameVersion == "test") {
    return "0x0Cfcb584E38d94DC562139cFD6B6CEba5A5d69cA";
  } else if (gameVersion == "main") {
    return "0x779757fc834d7D1e9bA65b69Ca24A96E8f169e48";
  }
  return "0x779757fc834d7D1e9bA65b69Ca24A96E8f169e48";
};
