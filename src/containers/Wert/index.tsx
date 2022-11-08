import React, { useState, useEffect } from "react";
import WertModule from "@wert-io/module-react-component";
import WertWidget from "@wert-io/widget-initializer";
import { signSmartContractData } from "@wert-io/widget-sc-signer";
import { v4 as uuidv4 } from "uuid";

import { Buffer } from "buffer";
import { getAliveFixedSongAbi } from "../../utils/abis";
import { ethers } from "ethers";

window.Buffer = Buffer;

const Wert: React.FC = () => {
  const privateKey =
    "0x57466afb5491ee372b3b30d82ef7e7a0583c9e36aef0f02435bd164fe172b1d3";
  let account = "0xf741a8520B467f099F9646a533DB13031518ee69";
  let abi = getAliveFixedSongAbi();
  let iface = new ethers.utils.Interface(abi);
  let encodeVal = iface.encodeFunctionData("mint", [account, 1]);
  console.log(encodeVal);
  // iface.functions.mint.encode([
  //   account,
  //   ethers.utils.parseEther(price.toString()),
  // ]);
  console.log(iface);

  const signedData = signSmartContractData(
    {
      address: "0x96D5990185022212d367A0e09263B12Dbb4EE06A",
      commodity: "MATIC",
      commodity_amount: 3,
      pk_id: "key1",
      sc_address: "0xC545CEae428785a5AE77bfF262600deC7F7d76d2",
      sc_id: uuidv4(), // must be unique for any request
      sc_input_data:
        "0x9dae76ea000000000000000000000000000000000000000000000000000000000000003700000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001",
    },
    privateKey
  );
  const otherWidgetOptions = {
    partner_id: "01G7Y8HD6FGZPG7V6JNAHFWR8R",
    container_id: "widget",
    click_id: uuidv4(), // unique id of purhase in your system
    origin: "https://sandbox.wert.io", // this option needed only for this example to work
    width: 400,
    height: 600,
    listeners: {
      loaded: () => console.log("loaded"),
    },
  };

  // const wertWidget = new WertWidget({
  //   ...signedData,
  //   ...otherWidgetOptions,
  // });

  useEffect(() => {
    // wertWidget.mount();
  }, []);

  return (
    <div>
      <WertModule
        options={{
          ...signedData,
          ...otherWidgetOptions,
        }}
      />
      <WertModule
        options={{
          partner_id: "01G7Y8HD6FGZPG7V6JNAHFWR8R",
          container_id: "wert-widget",
          origin: "https://sandbox.wert.io",
          theme: "white",
          height: 580,
          width: 780,
        }}
      />
    </div>
  );
};

export default Wert;
