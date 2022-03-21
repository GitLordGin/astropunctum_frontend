import React from "react";

export const InputDegree = ({
  min,
  max,
  step,
  name,
  show_range,
  onChange,
  value,
}) => {
  return (
    <div className="ManualInput--Single">
      <p className="ManualInput--Single--Text">{name}:</p>
      <input className="ManualInput--Single--Number"
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
      />
      {show_range ? (
        <input className="ManualInput--Single--Range"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
        />
      ) : (
        <></>
      )}
    </div>
  );
};
