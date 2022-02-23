import React, { Component } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  SearchbarHeader,
  Form,
  FormButton,
  ButtonLabel,
  FormInput,
} from "./Searchbar.styled";
import { GrFormSearch } from "react-icons/gr";
import PropTypes from "prop-types";

export default class Searchbar extends Component {
  state = {
    searchQuery: "",
  };

  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  };

  handleInputChange = (evt) => {
    this.setState({ searchQuery: evt.currentTarget.value.toLowerCase() });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    if (this.state.searchQuery.trim() === "") {
      return toast.error("No input");
    }
    this.props.onSubmit(this.state.searchQuery);
    this.setState({ searchQuery: "" });
  };

  render() {
    return (
      <SearchbarHeader>
        <Form onSubmit={this.handleSubmit}>
          <FormButton type="submit">
            <GrFormSearch size={40} />
            <ButtonLabel>Search</ButtonLabel>
          </FormButton>

          <FormInput
            className="input"
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            value={this.state.searchQuery}
            onChange={this.handleInputChange}
          />
        </Form>
      </SearchbarHeader>
    );
  }
}
