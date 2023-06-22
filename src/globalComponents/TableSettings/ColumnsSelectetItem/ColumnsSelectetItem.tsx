import {
  DraggableProvidedDraggableProps,
  DraggableProvidedDragHandleProps,
} from "react-beautiful-dnd";
import Field from "../../../../electron/interfaces/TableFields/Field";
import "./ColumnsSelectetItem.css";

function ColumnsSelectetItem(props: ColumnsSelectetInterface) {
  console.log(props);
  const { data, innerRef, draggableProps, dragHandleProps } = props;

  return (
    <div
      className="columns-selected-item"
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
    >
      <img src="./assets/img/Layers.svg" className="columns-selected-img"></img>
      <span className="text-white-medium">{data.title ? data.title : data.type}</span>
    </div>
  );
}

type ColumnsSelectetInterface = {
  data: Field;
  innerRef: any;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | undefined;
};

export default ColumnsSelectetItem;
