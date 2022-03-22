import './App.css';
import InputPoints from './components/InputPoints';
import React, {useState} from "react";
import ConnectDevice from './components/ConnectDevice';
import AdminView from './components/AdminView';

function App() {
  const [characteristic, setCharacteristic] = useState(null);
  return (
    <div>
      <AdminView characteristic={characteristic}/>
      <ConnectDevice characteristic={characteristic} setCharacteristic={setCharacteristic}/>
      <InputPoints characteristic={characteristic}/>
    </div>
  );
}

export default App;
