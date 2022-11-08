import gameVersion from "./gameVersion";

export const jsonRpc = () => {
  if (gameVersion == "test") {
    return "https://matic-mumbai.chainstacklabs.com";
  } else if (gameVersion == "main") {
    return "https://polygon-rpc.com/";
  }
};
