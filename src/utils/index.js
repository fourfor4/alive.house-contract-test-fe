export const getAccount = async () => {
  try {
    let ethereum = window.ethereum;
    let accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  } catch (error) {
    return "";
  }
};

export const formatAddress = (address) => {
  if (address)
    return address.substr(0, 6) + "..." + address.substr(address.length - 4, 4);
  else return "";
};
