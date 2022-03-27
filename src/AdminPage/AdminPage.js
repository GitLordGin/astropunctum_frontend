import React from "react";
import Menu from "../Menu";
import { useSelector } from 'react-redux'
import AdjustComponent from "./AdjustComponent";
import ListComponent from "./ListComponent";

function AdminPage(props) {
    const characteristic = useSelector((state) => state.leBluetooth.characteristic)
    return (
        <>
            <Menu/>
            <div className="Atooltip">
                Calibrate laser possition
                <span className="Atooltiptext">Adjust laser possition without chaging it's coordinates</span>
            </div>
            <AdjustComponent/>
            <br/>
            <div className="Atooltip">
                Move laser to possition
                <span className="Atooltiptext">Define list of coordinates and upload them to device.
                If Loop is true, then the list of coordinates will loop.
                Go to (0;0) sets laser to 0, 0</span>
            </div>
            <ListComponent/>
        </>
    );
}

export default AdminPage;