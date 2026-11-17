import { useRef, useState } from "react";
import "./kanbanboard.css";

interface IOption {
  value: string;
  label: string;
}

interface Iitem {
  id: string;
  task: string;
}

interface ISingelObjStruct {
  label: string;
  items: Iitem[];
}

interface IColumns {
  todo: ISingelObjStruct;
  inProgress: ISingelObjStruct;
  completed: ISingelObjStruct;
}

const options: IOption[] = [
  { value: "todo", label: "To do" },
  { value: "inProgress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

interface IDraggedRef {
  id: string;
  sourceColumn: keyof IColumns;
}

const columnKeys: (keyof IColumns)[] = ["todo", "inProgress", "completed"];

const KanbanBoard: React.FC = () => {
  const [task, setTask] = useState<string>("");
  const [dropDownValue, setDropDownValue] = useState<keyof IColumns>("todo");
  const draggedRef = useRef<IDraggedRef | null>(null);
  const [columns, setColumns] = useState<IColumns>({
    todo: {
      label: "To do",
      items: [
        { id: "1", task: "Develop Auth screen" },
        { id: "2", task: "Develop payment screen" },
      ],
    },
    inProgress: {
      label: "In Progress",
      items: [{ id: "3", task: "Collect Product Requirements" }],
    },
    completed: {
      label: "Completed",
      items: [{ id: "4", task: "Discuss filtering solution" }],
    },
  });

  const addTask = () => {
    if (!task) return;

    let updateColumns: IColumns = { ...columns };

    let date = new Date();

    updateColumns[dropDownValue].items.push({
      id: date.getTime().toString(),
      task: task,
    });

    setColumns(updateColumns);
    setTask("");
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    id: string,
    sourceColumn: keyof IColumns,
  ) => {
    draggedRef.current = { id, sourceColumn };
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropEnd = (
    e: React.DragEvent<HTMLDivElement>,
    targetColumn: keyof IColumns,
  ) => {
    e.preventDefault();

    const draggedTask = draggedRef.current;
    const sourceColumn = draggedTask?.sourceColumn;

    if (!draggedTask || sourceColumn === targetColumn) return;

    let updatedColumns = { ...columns };

    const itemToBePushed = updatedColumns[
      sourceColumn as keyof IColumns
    ].items.find((item) => {
      return item.id === draggedTask.id;
    });

    if (!itemToBePushed) return;

    updatedColumns[targetColumn].items.push(itemToBePushed);

    const filteredItems = updatedColumns[
      sourceColumn as keyof IColumns
    ].items.filter((val) => val.id !== itemToBePushed.id);

    updatedColumns[sourceColumn as keyof IColumns].items = filteredItems;

    setColumns(updatedColumns);
  };

  return (
    <>
      <h1 className="kanbanBoard">React Kanban Board</h1>
      {/* Input section with a dropdown and a button */}
      <div className="kanbanBoard">
        <input
          value={task}
          onChange={(e) => {
            setTask(e.target.value);
          }}
          className="inputBox"
          type="text"
        ></input>
        <select
          onChange={(e) => {
            setDropDownValue(e.target.value as keyof IColumns);
          }}
          className="select"
        >
          {options.map((val) => (
            <option className="option" key={val.value} value={val.value}>
              {val.label}
            </option>
          ))}
        </select>

        <button
          className="addBtn"
          onClick={() => {
            addTask();
          }}
        >
          Add
        </button>
      </div>
      {/* Task board section */}

      <div className="taskBoard">
        {columnKeys.map((val) => {
          return (
            <div
              onDragOver={handleDragOver}
              onDrop={(e) => {
                handleDropEnd(e, val);
              }}
              key={val}
              className="singleBox"
            >
              <h4 className="headerStyle">
                {columns[val].label}: {columns[val].items.length}
              </h4>

              {columns[val].items.map((item) => {
                return (
                  <p
                    onDragStart={(e) => {
                      handleDragStart(e, item.id, val);
                    }}
                    draggable
                    key={item.id}
                    className="taskStyle"
                  >
                    {item.task}
                  </p>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default KanbanBoard;
