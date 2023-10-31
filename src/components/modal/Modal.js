import React from 'react';
import './Modal.css';

const Modal = ({ children }) => {
  return (
    <div className="modal--background">
      <div className="model--content">{children}</div>
    </div>
  );
};

export default Modal;
