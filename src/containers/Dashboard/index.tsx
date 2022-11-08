import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import Band from "../Band";
import BuySong from "../BuySong";
import Bands from "../Bands";
import Manager from "../Manager";
import Drop from "../Drop";
import Wert from "../Wert";

const DashBoard: React.FC = (props) => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="bands" element={<Bands />} />
        <Route path="band/:bandId" element={<Band />} />
        <Route path="buy-song" element={<BuySong />} />
        <Route path="manager" element={<Manager />} />
        <Route path="drop" element={<Drop />} />
        <Route path="wert" element={<Wert />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DashBoard;
