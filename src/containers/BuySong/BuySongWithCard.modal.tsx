import React, { useState, useEffect } from "react";

import WertModule from "@wert-io/module-react-component";
import WertWidget from "@wert-io/widget-initializer";
import { signSmartContractData } from "@wert-io/widget-sc-signer";
import { v4 as uuidv4 } from "uuid";

import { Buffer } from "buffer";
import { Modal } from "antd";
import { getAliveFixedSongAbi } from "../../utils/abis";
import { ethers } from "ethers";

type Props = {
  contractAddress: string;
  price: number;
  quantity: number;
  account: string;
  isWertShow: boolean;
  setIsWertShow: Function;
  inputData: string;
  getBalance: Function;
};

window.Buffer = Buffer;

const BuySongWithCard: React.FC<Props> = ({
  contractAddress,
  price,
  quantity,
  account,
  isWertShow,
  setIsWertShow,
  inputData,
  getBalance,
}) => {
  console.log(inputData)
  const privateKey = process.env.REACT_APP_WERT_PRIVATE_KEY + "";
  const signedData = signSmartContractData(
    {
      address: account,
      commodity: "MATIC",
      commodity_amount: Math.ceil(price * 10 ** 6) / 10 ** 6,
      pk_id: "key1",
      sc_address: contractAddress,
      sc_id: uuidv4(), // must be unique for any request
      sc_input_data: inputData,
    },
    privateKey
  );
  const otherWidgetOptions = {
    partner_id: "01GANY76QGCHJTC2M9W0SVG18H",
    container_id: `wert-widget-${contractAddress.slice(0, 4)}`,
    click_id: uuidv4(), // unique id of purhase in your system
    origin: "https://widget.wert.io/", // this option needed only for this example to work
    width: 400,
    height: 600,
    listeners: {
      loaded: () => console.log("loaded"),
      position: (info: any) => {
        console.log("position ---- ", info);
      },
      close: (info: any) => {
        console.log("close---, ", info);
      },
      error: (error: any) => {
        console.log("error ---, ", error);
      },
      "payment-status": (info: any) => {
        console.log("payment-status- ----, ", info);
      },
    },
  };

  const wertWidget = new WertWidget({
    ...signedData,
    ...otherWidgetOptions,
  });

  console.log(wertWidget);

  useEffect(() => {
    // if (isWertShow) {
    //   console.log("mount");
    // wertWidget.mount();
    // wertWidget.open();
    // }
  }, []);

  return (
    // <Modal visible={isWertShow}>
    <div>
      <div id={`wert-widget-${contractAddress}`}>
        {isWertShow && (
          <WertModule
            options={{
              ...signedData,
              ...otherWidgetOptions,
            }}
          />
        )}
      </div>
    </div>
    // </Modal>
  );
};

export default BuySongWithCard;
