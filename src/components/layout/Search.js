import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

class SearchBooks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: undefined,
      loading: false,
      searchTerm: undefined,
      searchData: undefined,
      page: this.props.match.params.page
    };
  }

  componentDidMount() {
    this.state.page = this.props.match.params.page;
  }

  handleChange = e => {
    let value = e.target.value;
    this.setState({ searchTerm: value }, () => {
      this.searchBooks();
    });
  };

  onSubmit(e) {
    e.preventDefault();
  }
  async searchBooks() {
    if (this.state.searchTerm) {
      let url = null;
      let api = "https://www.googleapis.com/books/v1/volumes/?q=";
      let page = this.state.page;
      if (page == 0 || page == undefined) {
        url = api + this.state.searchTerm + "&startIndex=0&maxResults=20";
      } else {
        url =
          api +
          this.state.searchTerm +
          "&startIndex=" +
          page * 20 +
          "&maxResults=20";
      }
      try {
        const response = await axios.get(url);
        console.log(response);
        this.setState({ searchData: response.data });
      } catch (e) {
        console.log(e);
      }
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      prevState !== undefined &&
      nextProps.match.params.page !== prevState.page
    ) {
      return { page: nextProps.match.params.page };
    } else return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.page !== this.props.match.params.page) {
      this.searchBooks();
    }
  }
  render() {
    let body = null;
    let li = null;
    let nextPage;
    let previousPage;
    let currPage = this.state.page;

    if (this.state.searchData) {
      if (currPage > 0) {
        previousPage = <Link to={`${parseInt(currPage) - 1}`}>Previous</Link>;
      }
      nextPage = <Link to={`${parseInt(currPage) + 1}`}>Next</Link>;
    }
    li =
      this.state.searchData &&
      this.state.searchData.items.map(book => {
        // let book = books.book;

        return (
          <li key={book.id}>
            <Link to={`/books/${book.id}`}>{book.volumeInfo.title}</Link>
          </li>
        );
      });
    body = (
      <div>
        <form method="POST" name="formName" onSubmit={this.onSubmit}>
          <label>
            {" "}
            Search Term:
            <input type="text" name="searchTerm" onChange={this.handleChange} />
          </label>
        </form>
        <ul className="list-unstyled">{li}</ul>
        {previousPage}
        {nextPage}
      </div>
    );

    return body;
  }
}

export default SearchBooks;
