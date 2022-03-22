import React, {useState} from "react";

function AdminView(props) {
    const [manualLeft, updateManualLeft] = useState(true)
    const handleManualLeft = async (result) => {
        updateManualLeft(result.target.checked)
    }
    const [manualAmount, updateManualAmount] = useState(10)
    const handleManualAmount = async (result) => {
        updateManualAmount(result.target.value)
    }
    const handleOnCalibrate = async (result) => {
        const amount = manualAmount * (manualLeft ? -1 : 1)
        console.log(amount)
        const tmpp = {calibrate: true, loop: false, final: true, array: [{id:0,x:amount,y:0,rpm:0}]}
        await props.characteristic.writeValue(encoder.encode(JSON.stringify(tmpp)))
    }

    const encoder = new TextEncoder();
    const handleOnReset = async (result) => {
        const tmpp = {loop: false, final: true, array: [{id:0,x:0,y:0,rpm:0}]}
        const res = await props.characteristic.writeValue(
            encoder.encode(JSON.stringify(tmpp))
        )
        console.log(res)
    }
    return (
        <div className="AdminView">
            <button onClick={handleOnReset}>Go to 0</button>
            <p>Left</p>
            <input type="checkbox" onChange={handleManualLeft} checked={manualLeft}/>
            <input type="number" onChange={handleManualAmount} value={manualAmount}/>
            <button onClick={handleOnCalibrate}>Calibrate</button>
        </div>
    );
}

export default AdminView;