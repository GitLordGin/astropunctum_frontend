import React from "react";
import { useState } from "react";
import { InputDegree } from "./InputDegree";

export const InputCoordinates = ({onChange, value}) => {
  const min_deg = 0
  const max_deg = 10
  const factor_deg = 10 ** 2
  const step_deg = 1 / factor_deg;

  const min_rpm = 0
  const max_rpm = 10
  const factor_rpm = 10 ** 2
  const step_rpm = 1 / factor_rpm;

  const [xValue, setXValue] = useState((min_deg + max_deg) / 2);
  const [yValue, setYValue] = useState((min_deg + max_deg) / 2);
  const [rpmValue, setRpmValue] = useState((min_rpm + max_rpm) / 2);
  const onXChange = (e) => {
    setXValue(e.target.value, min_deg, max_deg, factor_deg);
    value.x = xValue;
  };
  const onYChange = (e) => {
    setYValue(e.target.value, min_deg, max_deg, factor_deg);
    value.y = yValue;
  };
  const onRpmChange = (e) => {
    setRpmValue(e.target.value, min_rpm, max_rpm, factor_rpm);
    value.rpm = rpmValue;
  };
  return (
    <div className="ManualInput">
      <InputDegree
        min={min_deg}
        max={max_deg}
        step={step_deg}
        name="x"
        value={xValue}
        onChange={onXChange}
        show_range={true}
      />
      <InputDegree
        min={min_deg}
        max={max_deg}
        step={step_deg}
        name="y"
        value={yValue}
        onChange={onYChange}
        show_range={true}
      />
      <InputDegree
        min={min_rpm}
        max={max_rpm}
        step={step_rpm}
        name="RPM"
        value={rpmValue}
        onChange={onRpmChange}
        show_range={false}
      />
    </div>
  );
};
