import React from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { BsChevronDoubleDown, BsChevronDoubleLeft, BsChevronDoubleRight, BsChevronDoubleUp } from 'react-icons/bs';
import { set_amount } from "../redux/reducers/adjustComponentSlice";

function AdjustComponent(props) {
    const characteristic = useSelector((state) => state.leBluetooth.characteristic)
    const amount = useSelector((state) => state.adjustComponent.amount)
    const dispatch = useDispatch()
    function handleAmountChange(result) {
        dispatch(set_amount(result.target.value))
    }
    const encoder = new TextEncoder();
    async function handleSubmit(coord) {
        const arr = {
            calibrate: true,
            loop: false,
            final: true,
            array: [{...coord, id:0, rpm:1}]
        }
        await characteristic.writeValue(encoder.encode(JSON.stringify(arr)))
    }

    return (
        <div className="AdjustComponent">
            <div className="AdjustComponent--Row">
                <div className="AdjustComponent--Cell"/>
                <div className="AdjustComponent--Cell">
                    <Button onClick={(x) => handleSubmit({"x": 0, "y": amount})} variant="dark" className="AdjustComponent--Button"><BsChevronDoubleUp /></Button>
                </div>
                <div className="AdjustComponent--Cell"/>
            </div>
            <div className="AdjustComponent--Row">
                <div className="AdjustComponent--Cell">
                    <Button onClick={(x) => handleSubmit({"x": -amount, "y": 0})} variant="dark" className="AdjustComponent--Button"><BsChevronDoubleLeft /></Button>
                </div>
                <div className="AdjustComponent--Cell">
                    <div className="AdjustComponent--Input"><input type="number" min="0" max="360" step="0.1" value={amount} onChange={handleAmountChange}/></div>
                </div>
                <div className="AdjustComponent--Cell">
                    <Button onClick={(x) => handleSubmit({"x": amount, "y": 0})} variant="dark" className="AdjustComponent--Button"><BsChevronDoubleRight /></Button>
                </div>
            </div>
            <div className="AdjustComponent--Row">
                <div className="AdjustComponent--Cell"/>
                <div className="AdjustComponent--Cell">
                    <Button onClick={(x) => handleSubmit({"x": 0, "y": -amount})} variant="dark" className="AdjustComponent--Button"><BsChevronDoubleDown /></Button>
                </div>
                <div className="AdjustComponent--Cell"/>
            </div>
        </div>
    );
}

export default AdjustComponent;