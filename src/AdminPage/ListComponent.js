import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Droppable } from "react-beautiful-dnd";
import { DragDropContext } from "react-beautiful-dnd";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { add_coordinate, delete_coordinate, edit_coordinate, set_loop, swap_coordinate } from "../redux/reducers/ListComponentSlice";
import RowComponent from "./RowComponent";

function ListComponent(props) {
    const characteristic = useSelector((state) => state.leBluetooth.characteristic)
    const coord_list = useSelector((state) => state.ListComponent.coordinates)
    const loop = useSelector((state) => state.ListComponent.loop)
    const dispatch = useDispatch()

    function handleOnDragEnd(e) {
        if (!e.destination) return;
        dispatch(swap_coordinate({ source: e.source.index, destination: e.destination.index }))
    }
    function handleAdd(e) {
        dispatch(add_coordinate())
    }
    function handleEdit(e, id) {
        const target = { row: id, col: e.target.name, value: e.target.value }
        dispatch(edit_coordinate(target))
    }
    function handleDelete(e, id) {
        dispatch(delete_coordinate(id))
    }
    const encoder = new TextEncoder();
    async function handleUpload(e) {
        const arr = {
            calibrate: false,
            loop: loop,
            final: true,
            array: coord_list
        }
        await characteristic.writeValue(encoder.encode(JSON.stringify(arr)))
    }
    async function handle00(e) {
        const arr = {
            calibrate: false,
            loop: false,
            final: true,
            array: [{id:0,x:0,y:0,rpm:1}]
        }
        await characteristic.writeValue(encoder.encode(JSON.stringify(arr)))
    }
    function handleLoop(e) {
        dispatch(set_loop(e.target.checked))
    }
    return (
        <div>
            <div className="ListComponent">
                <DragDropContext onDragEnd={handleOnDragEnd}><Droppable droppableId="MyList">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {coord_list.map((x, index) => {
                                return (
                                    <Draggable key={x.id} draggableId={x.id.toString()} index={index}>
                                        {(provided) => (
                                            <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                <RowComponent id={x.id} x={x.x} y={x.y} rpm={x.rpm} onEdit={handleEdit} onDelete={handleDelete} />
                                            </div>
                                        )}
                                    </Draggable>
                                )
                            })} {provided.placeholder}
                        </div>
                    )}
                </Droppable></DragDropContext>
                <div className="ListComponent--Buttons">
                    <Button onClick={handleAdd}>Add</Button>
                    <Button onClick={handleUpload}>Upload</Button>
                    <Button onClick={handle00}>Go to (0; 0)</Button>
                    <div className="ListComponent--Buttons--p"><p>Loop:</p></div><input onChange={handleLoop} type="checkbox" value={loop}/>
                </div>
            </div>
        </div>
    );
}

export default ListComponent;