import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import {
  BarChartOutlined,
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, MenuProps } from "antd";

// import "./index.scss";
import { getAccount } from "../../../utils";

const { Header, Content, Footer, Sider } = Layout;
const items = [
  {
    icon: BarChartOutlined,
    label: "Alive",
    key: "alive",
    children: [
      {
        key: "alive-bands",
        label: <NavLink to="bands">Bands</NavLink>,
      },
      {
        key: "buy-alive-song",
        label: <NavLink to="buy-song">Buy Song</NavLink>,
      },
      {
        key: "alive-manager",
        label: <NavLink to="manager">Manager</NavLink>,
      },
      {
        key: "alive-drop",
        label: <NavLink to="drop">Drop</NavLink>,
      },
      {
        key: "alive-wert",
        label: <NavLink to="wert">Wert</NavLink>,
      },
    ],
  },
];

const items2: MenuProps["items"] = items.map(
  ({ icon, key: key1, label, children }) => {
    return {
      key: `${key1}`,
      icon: React.createElement(icon),
      label,
      children: children.map(({ key: key2, label: label2 }) => ({
        key: key2,
        label: label2,
      })),
    };
  }
);

const DashboardLayout: React.FC<{ children: any }> = (props) => {
  const [account, setAccount] = useState("");
  const navigate = useNavigate();

  const setSignerAddress = async () => {
    let account = await getAccount();
    console.log(account);
    if (account === "") {
      navigate("/login");
    }
    setAccount(account);
  };

  useEffect(() => {
    setSignerAddress();
  }, []);
  return (
    <Layout hasSider>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="dashboard-logo">
          <img
            src="/assets/alive-logo.png"
            style={{ height: "64px", margin: "auto" }}
          />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["4"]}
          items={items2}
        />
      </Sider>
      <Layout
        className="site-layout"
        style={{
          marginLeft: 200,
          background: "white",
        }}
      >
        <Header
          className="site-layout-background text-right"
          style={{
            padding: 0,
          }}
        >
          <Button className="mr-3" icon={<UserOutlined />}>
            {account.substr(0, 6) +
              "..." +
              account.substr(account.length - 4, 4)}
          </Button>
        </Header>
        <Content
          style={{
            margin: "24px 16px 0",
            overflow: "initial",
          }}
        >
          {props.children}
        </Content>
        <Footer
          className="mt-4"
          style={{
            textAlign: "center",
          }}
        >
          Alive ©2022 Created by @@@
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
