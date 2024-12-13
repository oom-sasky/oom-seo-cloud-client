import React from "react";

const ItemsInList = ({items}) => {
    return (
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  };

export default ItemsInList;