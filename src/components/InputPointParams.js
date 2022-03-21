import InputPointParam from "./InputPointParam";

function InputPointParams(props) {
    return (
        <div className="ManualInput">
            <InputPointParam min={0} max={360} id={props.id} onChange={props.onEdit} name="x" value={props.x} show_range={true}/>
            <InputPointParam min={0} max={360} id={props.id} onChange={props.onEdit} name="y" value={props.y} show_range={true}/>
            <InputPointParam min={0} max={100} id={props.id} onChange={props.onEdit} name="rpm" value={props.rpm}/>
            <button onClick={(e) => props.onDelete(e, props.id)}>X</button>
        </div>
    );
}

export default InputPointParams;
