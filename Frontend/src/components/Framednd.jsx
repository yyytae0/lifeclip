import { useState, useEffect } from "react";
import {DragDropContext, Droppable, Draggable} from 'mhe-react-beautiful-dnd';
import classNames from 'classnames2';
import "./style.css"

function Framednd(){
  const [state, setState] = useState({
    choices: getItems(4, 0, 0),
    responses: getItems(0, 5, 4)
  });
  const [draggedFrom, setDraggedFrom] = useState(null);

  useEffect(() => {},[draggedFrom])


  function getItems(count, offset, noOfPlaceholders){
    let items = Array.from({length: count}, (v, k) => k).map(k => {
      return {
        key: `choices: ${k + offset}`,
        text: `item ${k + offset}`
      };
    });

    for (let i = 0; i < noOfPlaceholders; i++){
      items.push({
        key: `placeholders:${i}`,
        text: `placeholder ${i}`
      });
    }
    return items;
  }

  function getMatchPromptSection(){
    return (
      <div className="match-prompt">
        <div className="match-prompt-label">Just some info</div>
      </div>
    )
  }

  function getDraggable(item, uniqueKey, index){
    let isPlaceHolder = item.key.includes('placeholders')
    return (
      <div className="dropWrapper">
        <div className="dropHolder">
          <Draggable
            key={uniqueKey}
            draggableId={uniqueKey}
            index={index}
            isDragDisabled={isPlaceHolder}>
            {(draggable, now) => {
              return (
                <div
                  className={classNames({
                    '-dragging': now.isDragging,
                    '-placeholder': isPlaceHolder,
                    'choice-item-wrapper': true,
                  })}
                  id={uniqueKey}
                  ref={draggable.innerRef}
                  {...draggable.draggableProps}
                  {...draggable.dragHandleProps}
                  key={uniqueKey}>
                  <span className="choice-item">{item && item.text}</span>
                  {draggable.placeholder}
                </div>
              )
            }}
          </Draggable>
        </div>
      </div>
    )
  }

  function getChoiceItem(item, uniqueKey, index){
    return (
      <div className="match-row">
        {getMatchPromptSection()}
        {getDraggable(item, uniqueKey, index)}
      </div>
    )
  }

  function getResponsesList(){
    return (
      <Droppable droppableId={`matchable:responses`}>
        {(droppable, now) => {
          return (
            <div
              className={classNames({
                "-draggingChoice": draggedFrom === "choices",
                "-draggingOver": now.isDraggingOver,
                "-draggingResponse": draggedFrom === 'responses',
                "responses-container": true
              })}
              ref={droppable.innerRef}>
              <div className="match-responses-list">
                {state.responses.map((response, index) => {
                  return getChoiceItem(response, response.key, index)
                })}
              </div>
              {draggedFrom !== "choices" && droppable.placeholder}
            </div>
          );
        }}
      </Droppable>
    );
  }

  function getChoicesList(){
    return (
      <Droppable droppableId={`matchable:choices`}>
        {(droppable, now) => {
          return (
            <div
              className={classNames({
                "-draggingChoice": draggedFrom === "choices",
                "-draggingOver": now.isDraggingOver,
                "-draggingResponse": draggedFrom === "responses",
                "choices-container": true
              })}
              ref={droppable.innerRef}>
              <div className="match-choices-list">
                {state.choices.map((choice, index) => {
                  return getDraggable(choice, choice.key, index);
                })}
              </div>
            </div>
          )
        }}
      </Droppable>
    )
  }

  function handleDragEnd(result){
    if (result.destination) {
      updateResponse(result);
    }
    setDraggedFrom(null);
    // forceUpdate();
  }

  function handleDragStart(initial, initDraggedFrom){
    setDraggedFrom(initDraggedFrom);
    // forceUpdate();
  }

  function updateResponse(result){
    const responseKey = result.draggableId.split(":")[1];
    const droppedAt = result.destination.droppableId.split(":")[1];

    state[draggedFrom].splice(result.source.index, 1);
    state[droppedAt].splice(result.destination.index, 0, {
      key: `choices:${responseKey}`,
      text: `item ${responseKey}`
    });

    if (draggedFrom !== droppedAt) {
      if (droppedAt === 'responses') {
        const itemToRemove = state[droppedAt].splice([result.destination.index+1], 1)[0];
        if (!itemToRemove.key.includes("placeholders")){
          state[draggedFrom].splice(
            result.source.index,
            0,
            itemToRemove
          );
        }
      }

      if (droppedAt === "choices") {
        const currentPlaceholders = state[draggedFrom].filter(el =>
          el.key.includes('placeholders')
        );
        let currentPlaceholderIndex = currentPlaceholders
          .map(el => parseInt(el.key.split(':')[1]))
          .sort()
          .splice(-1, 1)[0];
        let newPlaceHolderIndex = currentPlaceholderIndex + 1;
        state[draggedFrom].splice(result.source.index, 0, {
          key: `placeholders:${newPlaceHolderIndex}`,
          text: `placeholders ${newPlaceHolderIndex}`
        });
      }
    }
    setState({
      choices: state.choices,
      responses: state.responses
      });
    }

  return (
    <div>
      <DragDropContext
        onDragEnd={result => {
          handleDragEnd(result);
        }}
        onDragStart={initial => {
          const initDraggedFrom = initial.source.droppableId.split(":")[1];
          handleDragStart(initial, initDraggedFrom)
        }}>
        <div className="matching-component sortable-component -testing">
          {getResponsesList()}
          {getChoicesList()}
        </div>
      </DragDropContext>
    </div>
  ) 
}

export default Framednd;