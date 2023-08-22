import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import '../css/drag.css'

const initialItems = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
const initialTarget = [];

export default function AnswerDrag () {
    const [items, setItems] = useState(initialItems);
    const [targetItems, setTargetItems] = useState(initialTarget);
  
    const handleOnDragEnd = (result) => {
      if (!result.destination) return;
  
      if (result.source.droppableId === 'items' && result.destination.droppableId === 'targetItems') {
        const itemToMove = items[result.source.index];
        setItems(old => old.filter((item, idx) => idx !== result.source.index));
        setTargetItems(old => [...old, itemToMove]);
        return;
      }
  
      if (result.source.droppableId === 'targetItems' && result.destination.droppableId === 'items') {
        const itemToMove = targetItems[result.source.index];
        setTargetItems(old => old.filter((item, idx) => idx !== result.source.index));
        setItems(old => [...old, itemToMove]);     
      }
    };
  
    return (
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="items">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef} style={{ backgroundColor: 'lightblue' }}>
              {items.map((item, index) => (
                <Draggable key={item} draggableId={item} index={index}>
                  {(provided) => (
                    <li
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                    >
                      {item}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
  
        <Droppable droppableId="targetItems">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef} style={{ backgroundColor: 'black', minHeight: '100px', color: 'white' }}>
              {targetItems.map((item, index) => (
                <Draggable key={item} draggableId={item} index={index}>
                  {(provided) => (
                    <li
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                    >
                      {item}                      
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    );
};
