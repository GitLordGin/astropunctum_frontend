import './App.css';
import InputPoints from './components/InputPoints';
import React, {useState} from "react";
import ConnectDevice from './components/ConnectDevice';

function App() {
  const [characteristic, setCharacteristic] = useState(null);
  return (
    <div>
      <ConnectDevice characteristic={characteristic} setCharacteristic={setCharacteristic}/>
      <InputPoints characteristic={characteristic}/>
    </div>
  );
}

export default App;
