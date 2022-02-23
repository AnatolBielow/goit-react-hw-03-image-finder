import React, { Component } from "react";
import { createPortal } from "react-dom";
import { ModalContent, Overlay } from "./Modal.styled";
import PropTypes from "prop-types";

const modalRoot = document.querySelector("#modal-root");

export default class Modal extends Component {
  static propTypes = { children: PropTypes.node.isRequired };

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeydown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeydown);
  }

  handleKeydown = (e) => {
    if (e.code === "Escape") {
      this.props.onClose();
    }
  };

  handleBackdropClick = (e) => {
    if (e.currentTarget === e.target) {
      this.props.onClose();
    }
  };

  render() {
    return createPortal(
      <Overlay onClick={this.handleBackdropClick}>
        <ModalContent>{this.props.children}</ModalContent>
      </Overlay>,
      modalRoot
    );
  }
}
