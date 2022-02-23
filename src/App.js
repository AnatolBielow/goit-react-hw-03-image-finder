import React, { Component } from "react";
import "./App.css";
import { ImageGallery } from "./Components/ImageGallery/ImageGallery";
import Searchbar from "./Components/Searchbar/Searchbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "./services/api";
import { LoadMoreButton } from "./Components/Button/Button";
import { Spinner } from "./Components/Spinner/Spinner";
import Modal from "./Components/Modal/Modal";

export default class App extends Component {
  state = {
    pictures: [],
    searchQuery: "",
    page: 1,
    totalPages: 0,
    status: "idle",
    showModal: false,
    modalImg: null,
    modalAlt: null,
  };

  async componentDidUpdate(prevProps, prevState) {
    const prevStateQuery = prevState.searchQuery;
    const searchQuery = this.state.searchQuery;
    const prevPage = prevState.page;
    const page = this.state.page;

    if (prevStateQuery !== searchQuery || prevPage !== page) {
      this.setState({ status: "pending" });

      try {
        const response = await API(searchQuery, page);
        console.log(response);
        const { total, hits } = response;
        const selectedPictures = response.hits.map(
          ({ id, webformatURL, largeImageURL, tags }) => {
            return { id, webformatURL, largeImageURL, tags };
          }
        );

        if (total === 0) {
          this.setState({ status: "reject" });
          return toast.error(`No "${searchQuery}" query found!`);
        }
        if (total !== 0 && page === 1) {
          toast.success(`We found ${total} images according to your query!`);
          this.setState({ totalPages: Math.ceil(total / hits.length) });
        }
        this.setState((prevState) => ({
          pictures: [...prevState.pictures, ...selectedPictures],
          status: "resolved",
        }));

        this.scrollToBottom();
      } catch (error) {
        toast.error("Sorry, something went wrong!");
        this.setState({ status: "rejected" });
      }
    }
  }

  handleFormSubmit = (searchQuery) => {
    if (searchQuery === this.state.searchQuery) {
      return;
    }
    this.setState({ searchQuery, pictures: [], page: 1 });
  };

  incrementPage = () => {
    this.setState((prevState) => ({ page: prevState.page + 1 }));
  };

  togleModal = () => {
    this.setState(({ showModal }) => ({ showModal: !showModal }));
  };

  handleModal = (src, alt) => {
    this.togleModal();
    this.setState({ modalImg: src, modalAlt: alt });
  };

  scrollToBottom = () => {
    this.endContainer.scrollIntoView({ behavior: "smooth" });
  };

  render() {
    const {
      pictures,
      status,
      showModal,
      modalImg,
      modalAlt,
      totalPages,
      page,
    } = this.state;

    return (
      <div className="App">
        <Searchbar onSubmit={this.handleFormSubmit} />
        {status === "idle" && <div>Please search images</div>}
        {pictures.length > 0 && (
          <ImageGallery pictures={pictures} onClick={this.handleModal} />
        )}
        {status === "pending" && <Spinner />}
        <div
          style={{ float: "left", clear: "both" }}
          ref={(el) => {
            this.endContainer = el;
          }}
        ></div>
        {status === "resolved" && page < totalPages && (
          <LoadMoreButton onClick={this.incrementPage} />
        )}
        {status === "reject" && <div>Nic nie znaleziono</div>}
        {showModal && (
          <Modal onClose={this.handleModal}>
            <img src={modalImg} alt={modalAlt} />
          </Modal>
        )}
        <ToastContainer />
      </div>
    );
  }
}
