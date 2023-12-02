"use client";
import { useReducer } from "react";
interface TasksTypes {
  id: number;
  description: string;
  isDone: boolean;
}
[];

interface TodosValuesTypes {
  total: number;
  complete: number;
  notComplete: number;
  inputValues?: string | "";
  tasks?: TasksTypes | [];
}
const initialValues: TodosValuesTypes = {
  total: 0,
  complete: 0,
  notComplete: 0,
  inputValues: "",
  tasks: [],
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "ADD_TASK":
      const task: TasksTypes = {
        id: action.payload,
        description: state.inputValues,
        isDone: false,
      };
      return {
        ...state,
        total: state.total + 1,
        notComplete: state.notComplete + 1,
        tasks: [...[task], ...state?.tasks],
      };
      break;
    case "DONE_TASK":
      if (action.payload) {
        return {
          ...state,
          complete: state.complete + 1,
          notComplete: state.notComplete - 1,
          tasks: state.tasks.map((item: TasksTypes) =>
            item.id === action.payload ? { ...item, isDone: true } : item
          ),
        };
      }

      break;
    case "UNDO_TASK":
      if (action.payload) {
        return {
          ...state,
          complete: state.complete - 1,
          notComplete: state.notComplete + 1,
          tasks: state.tasks.map((item: TasksTypes) =>
            item.id === action.payload ? { ...item, isDone: false } : item
          ),
        };
      }
    case "DELETE_TASK":
      if (action.payload) {
        const findTask = state.tasks.filter(
          (item: TasksTypes) => item.id === action.payload
        );
        return {
          ...state,
          total: state.total - 1,
          complete: findTask[0]?.isDone ? state.complete - 1 : state.complete,
          notComplete: !findTask[0]?.isDone
            ? state.notComplete - 1
            : state.notComplete,
          tasks: state.tasks.filter(
            (item: TasksTypes) => item.id !== action.payload
          ),
        };
      }
    case "INPUT_CHANGES":
      return {
        ...state,
        inputValues: action.payload,
      };
    default:
      break;
  }
};
export default function Todo() {
  const [state, dispatch] = useReducer(reducer, initialValues);
  const changeHandler = (e: any) => {
    dispatch({
      type: "INPUT_CHANGES",
      payload: e.target.value,
    });
  };
  const generateId = () => new Date().getTime();

  const saveHandler = (e: any) => {
    dispatch({
      type: "ADD_TASK",
      payload: generateId(),
    });
  };
  const undoHandler = (id: number) => {
    dispatch({
      type: "UNDO_TASK",
      payload: id,
    });
  };
  const doneHandler = (id: number) => {
    dispatch({
      type: "DONE_TASK",
      payload: id,
    });
  };
  const deleteHandler = (id: number) => {
    dispatch({
      type: "DELETE_TASK",
      payload: id,
    });
  };
  return (
    <div className="container">
      <div className="row">
        <span>Total: {state.total}</span>
        <span>Complete: {state.complete}</span>
        <span>Uncomplete: {state.notComplete}</span>
      </div>
      <div className="row">
        <input
          placeholder="Please details task"
          onChange={changeHandler}
          value={state.inputValues}
        />
        <div className="btn">
          <button onClick={saveHandler}>Save</button>
        </div>
      </div>
      <div className="row vertical">
        {state.tasks.map((item: TasksTypes, key: number) => (
          <div className={`task ${item.isDone ? "done" : ""}`} key={key}>
            <span>
              <span className="counter">{key + 1}.</span>
              {item.description}
            </span>
            <div className="btn-container">
              {item.isDone ? (
                <button
                  className="btn-danger"
                  onClick={() => undoHandler(item.id)}
                >
                  Undo
                </button>
              ) : (
                <button
                  className="btn-success"
                  onClick={() => doneHandler(item.id)}
                >
                  Done
                </button>
              )}
              <button
                className="btn-delete"
                onClick={() => deleteHandler(item.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
