import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import React, {useState} from "react";
import InputPointParams from "./InputPointParams";

function InputPoints(props) {
    const [pointParams, updatePointParams] = useState([{id:0,x:0,y:0,rpm:0}])

    function handleOnDragEnd(result) {
        if(!result.destination) return;
        const items = Array.from(pointParams);
        const [reorderItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderItem);
        updatePointParams(items);
    }

    function handleOnAdd(result) {
        const id = Math.max(...pointParams.map((x) => x.id)) + 1;
        const element = pointParams.slice(-1)[0]
        const newElement = { id, x: element.x, y:element.y, rpm: element.rpm }
        updatePointParams([...pointParams, newElement]);
    }

    const handleOnEdit = (e, id) => {
        const element = pointParams.findIndex(item => item.id === id);
        if (element === -1) return;
        const newArr = [...pointParams];
        newArr[element][e.target.name] = e.target.value;
        updatePointParams(newArr);
    }

    const handleOnDelete = (e, id) => {
        const newArr = pointParams.filter(item => item.id !== id);
        updatePointParams(newArr);
    }

    const encoder = new TextEncoder();
    const handleOnUpload = async (result) => {
        const tmpp = {loop: checked, final: true, array: pointParams}
        console.log(JSON.stringify(tmpp))
        const res = await props.characteristic.writeValue(
            encoder.encode(JSON.stringify(tmpp))
        )
        console.log(res)
    }

    const [checked, updateChecked] = useState(false)
    const handleOnLoop = (result) => {
        updateChecked(result.target.checked)
    }

    return (
        <div>
            <input type="checkbox" onChange = {handleOnLoop}/>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="MyList">
                    {(provided) => (
                        <ul {...provided.droppableProps} ref={provided.innerRef}>
                            {
                                pointParams.map((x, index) => {
                                    return (
                                        <Draggable key={x.id} draggableId={x.id.toString()} index={index}>
                                            {(provided) => (
                                                <li {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                    <InputPointParams id={x.id} x={x.x} y={x.y} rpm={x.rpm} onEdit={handleOnEdit} onDelete={handleOnDelete}/>
                                                </li>
                                            )}
                                        </Draggable>
                                    )
                                })
                            }
                            {
                                provided.placeholder
                            }
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
            <button onClick={handleOnAdd}>Add</button>
            <button onClick={handleOnUpload}>Upload</button>
        </div>
    );
}

export default InputPoints;
