function InputPointParam(props) {
    return (
        <div className="ManualInput--Single">
          <p className="ManualInput--Single--Text">{props.name}:</p>
          <input className="ManualInput--Single--Number"
            name={props.name}
            type="number"
            value={props.value}
            onChange={(e) => props.onChange(e, props.id)}
            min={props.min}
            max={props.max}
            step="0.01"
          />
          {props.show_range ? (
            <input className="ManualInput--Single--Range"
              name={props.name}
              type="range"
              value={props.value}
              onChange={(e) => props.onChange(e, props.id)}
              min={props.min}
              max={props.max}
              step="0.01"
            />
          ) : (
            <></>
          )}
        </div>
      );
}

export default InputPointParam;