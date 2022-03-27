import { Button } from "react-bootstrap";
import { BsX } from "react-icons/bs";
import ItemComponetn from "./ItemComponetn";

function RowComponent(props) {
    return (
        <div className="RowComponent">
            <ItemComponetn min={0} max={360} id={props.id} onChange={props.onEdit} name="x" value={props.x} show_range={true}/>
            <ItemComponetn min={0} max={360} id={props.id} onChange={props.onEdit} name="y" value={props.y} show_range={true}/>
            <ItemComponetn min={0} max={100} id={props.id} onChange={props.onEdit} name="rpm" value={props.rpm}/>
            <Button variant="dark" className="RowComponent--Button" onClick={(e) => props.onDelete(e, props.id)}><BsX/></Button>
        </div>
    );
}

export default RowComponent;
