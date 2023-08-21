import React, { useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { toDoState } from "./Atoms";
import Board from "./Components/Board";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 680px;
  width: 100%;
  height: 100vh;
  margin: 0 auto;
`;
const Boards = styled.div`
  display: grid;
  width: 100%;
  gap: 10px;
  grid-template-columns: repeat(3, 1fr);
`;

const App = () => {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: any) => {
    const { destination, source, draggableId } = info;
    console.log(info);
    if (!destination) return; //예외처리

    //같은 보드안에서 움직이는 경우
    if (destination.droppableId === source.droppableId) {
      setToDos((oldToDos) => {
        const copyToDos = [...oldToDos[source.droppableId]];
        const taskObj = copyToDos[source.index];
        //소스(출발인덱스)아이템 잘라내기
        copyToDos.splice(source.index, 1);
        // 도착지점에 새로운 위치에 삽입
        copyToDos.splice(destination?.index, 0, taskObj);
        return {
          ...oldToDos,
          [source.droppableId]: copyToDos,
        };
      });
    }
    //서로 다른 보드로 움직이는 경우
    if (destination.droppableId !== source.droppableId) {
      setToDos((oldToDos) => {
        const sourceBoard = [...oldToDos[source.droppableId]];
        const destinationBoard = [...oldToDos[destination.droppableId]];
        const taskObj = sourceBoard[source.index];
        //소스(출발인덱스)아이템 잘라내기
        sourceBoard.splice(source.index, 1);
        // 도착지점에 새로운 위치에 삽입
        destinationBoard.splice(destination?.index, 0, taskObj);
        return {
          ...oldToDos,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {Object.keys(toDos).map((boardId) => (
            <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
          ))}
        </Boards>
      </Wrapper>
    </DragDropContext>
  );
};

export default App;
