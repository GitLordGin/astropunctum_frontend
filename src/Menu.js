import React from "react";
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector, useDispatch } from 'react-redux'
import {set_characteristic} from "./redux/reducers/leBluetoothSlice";
import { Link } from "react-router-dom";

function Menu(props) {
    const characteristic = useSelector((state) => state.leBluetooth.characteristic)
    const dispatch = useDispatch()
    const handleOnConnect = async (e) => {
        console.log("handleOnConnect")
        if(!navigator.bluetooth) {
            alert("This web browser doesn't support web bluetooth!")
        }
        else {
            if(!characteristic) {
                try {
                    const device = await navigator.bluetooth.requestDevice({
                        filters: [{name: "AstroPunctum"}],
                        optionalServices: ["4fafc201-1fb5-459e-8fcc-c5c9c331914b"]
                    })
                    await device.gatt.connect()
                    const service = await device.gatt.getPrimaryService("4fafc201-1fb5-459e-8fcc-c5c9c331914b")
                    const char = await service.getCharacteristic("beb5483e-36e1-4688-b7f5-ea07361b26a8")
                    dispatch(set_characteristic(char))
                } catch (error) {
                    console.log(error)
                }
            }
        }
    }
    const handleOnDisconnect = async (e) => {
        console.log("handleOnDisconnect")
        if(characteristic) {
            characteristic.service.device.gatt.disconnect()
            dispatch(set_characteristic(null))
        }
    }
    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand as={Link} to="/">Main</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/AdminPage">Admin</Nav.Link>
                    </Nav>
                    {!characteristic ? <Button onClick={handleOnConnect}>Connect</Button> : <Button onClick={handleOnDisconnect}>Disconnect</Button>}
                </Container>
            </Navbar>
        </>
    );
}

export default Menu;