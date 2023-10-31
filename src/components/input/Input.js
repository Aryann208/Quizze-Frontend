import React, { useState } from 'react';
import './Input.css';
const Input = ({
  height = '4.5em',
  inputValue,

  handleInputChange,
  placeholder = '',
}) => {
  return (
    <div>
      <form>
        <input
          placeholder={placeholder}
          className="inputbar"
          style={{ height: `${height}` }}
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
        />
      </form>
    </div>
  );
};

export default Input;
