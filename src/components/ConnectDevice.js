function ConnectDevice(props) {
    const handleOnConnect = async (e) => {
        if(!navigator.bluetooth) {
            alert("This web browser doesn't support web bluetooth!")
        }
        else {
            if(!props.characteristic) {
                try {
                    const device = await navigator.bluetooth.requestDevice({
                        filters: [{name: "AstroPunctum"}],
                        optionalServices: ["4fafc201-1fb5-459e-8fcc-c5c9c331914b"]
                    })
                    await device.gatt.connect()
                    const service = await device.gatt.getPrimaryService("4fafc201-1fb5-459e-8fcc-c5c9c331914b")
                    const characteristic = await service.getCharacteristic("beb5483e-36e1-4688-b7f5-ea07361b26a8")
                    props.setCharacteristic(characteristic)
                } catch (error) {
                    console.log(error)
                }
            }
        }
    }
    const handleOnDisconnect = async (e) => {
        if(props.characteristic) {
            props.characteristic.service.device.gatt.disconnect()
            props.setCharacteristic(null)
        }
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const handleOnTest = async(e) => {
        console.log(props.characteristic)
        const res = await props.characteristic.writeValue(encoder.encode(JSON.stringify({x:115})))
        console.log(res)
        const ress = await props.characteristic.readValue()
        console.log(ress.buffer)
        console.log(decoder.decode(ress))
    }

    return (
        <div>
            <button onClick={handleOnConnect}>Connect</button>
            <button onClick={handleOnDisconnect}>Disconnect</button>
            <button onClick={handleOnTest}>TEST</button>
            <p>{props.characteristic ? "CONNECTED" : "DISCONNECTED"}</p>
        </div>
      );
}

export default ConnectDevice;