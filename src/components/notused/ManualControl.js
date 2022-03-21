import React from "react";
import { useState } from "react";
import { InputCoordinates } from "./InputCoordinates";

export const ManualControl = () => {
  const [value, setValue] = useState();
  const kazkas = { x: '', y: '', z: ''};
  console.log(value);
  return (
    <div>
        <InputCoordinates value={kazkas}/>
    </div>
  );
};
