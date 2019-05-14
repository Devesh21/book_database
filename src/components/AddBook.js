import React, { Component } from "react";
import { Button, Form, FormGroup } from "react-bootstrap";
import { connect } from "react-redux";
import { createBook } from "../store/actions/bookActions";
import uuid from "uuid/v4";
import firebase from "../config/firebaseConfig";

const storage = firebase.storage();

class AddBook extends Component {
  state = {
    bookName: "",
    author: "",
    description: "",
    coverFile: null,
    coverUid: "",
    bookFile: null,
    bookUid: "",
    progressCover: 0,
    progressBook: 0
  };

  handleCoverChange = e => {
    if (e.target.files[0]) {
      const coverFile = e.target.files[0].name;
      //coverFile = coverFile + "";
      console.log(coverFile);
      this.state.coverFile = coverFile;
      var ext = coverFile.split(".").pop();
      //var ext = this.state.coverFile.match(/\.([^\.]+)$/)[1];
      switch (ext) {
        case "jpg":
        case "png":
          alert("Allowed");
          break;
        default:
          alert("Not allowed");
          this.state.coverFile = "";
      }
      console.log(this.state);
    }
  };

  handleBookChange = e => {
    if (e.target.files[0]) {
      const bookFile = e.target.files[0];
      // console.log(bookFile);
      this.state.bookFile = bookFile;
      console.log(this.state);
    }
  };

  handleChange = e => {
    // console.log("in handle change");

    this.setState({
      [e.target.id]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    const img = this.state.coverFile;
    const coverUid = "cover-" + uuid();
    this.setState({ coverUid });
    const upload = storage.ref(`covers/${coverUid}`).put(img);
    upload.on(
      "state_changed",
      snapshot => {
        // progress function :

        const progressCover = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        this.setState({ progressCover });
        // console.log(this.state.progressCover);
      },
      error => {
        // error function
        console.log(error);
      },
      () => {
        // completed function
        storage
          .ref("covers")
          .child(coverUid)
          .getDownloadURL()
          .then(coverFile => {
            this.setState({ coverFile });
            // console.log(this.state);

            const book = this.state.bookFile;
            const bookUid = "book-" + uuid();
            this.setState({ bookUid });
            const uploadBook = storage.ref(`books/${bookUid}`).put(book);
            uploadBook.on(
              "state_changed",
              snapshot => {
                // progress function
                const progressBook = Math.round(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                this.setState({ progressBook });
              },
              error => {
                // error function
                console.log(error);
              },
              () => {
                // completed function
                storage
                  .ref("books")
                  .child(bookUid)
                  .getDownloadURL()
                  .then(bookFile => {
                    this.setState({ bookFile });
                    console.log(this.state);
                    this.props.createBook(this.state);
                    this.props.history.push("/");
                  });
              }
            );
          });
      }
    );
  };

  render() {
    return (
      <div className="AddBook" style={{ margin: "50px" }}>
        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Form.Label style={{ float: "left" }}>Name</Form.Label>
            <Form.Control
              autoFocus
              type="text"
              id="bookName"
              onChange={this.handleChange}
              placeholder="Name"
            />
          </FormGroup>
          <FormGroup>
            <Form.Label style={{ float: "left" }}>Author</Form.Label>
            <Form.Control
              type="text"
              id="author"
              onChange={this.handleChange}
              placeholder="Author"
            />
          </FormGroup>
          <Form.Group>
            <Form.Label style={{ float: "left" }}>Description</Form.Label>
            <Form.Control
              as="textarea"
              id="description"
              onChange={this.handleChange}
              rows="3"
              placeholder="Description"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label style={{ float: "left" }}>Select Cover</Form.Label>
            <input
              type="file"
              id="coverFile"
              name="CoverFile"
              accept=".image/*"
              style={{ position: "left", display: "block", padding: "0 20px" }}
              onChange={this.handleCoverChange}
            />
            <progress value={this.state.progressCover} max="100" />
          </Form.Group>
          <Form.Group>
            <Form.Label style={{ float: "left" }}>Select Book</Form.Label>
            <input
              type="file"
              id="bookFile"
              name="BookFile"
              style={{ position: "left", display: "block", padding: "0 20px" }}
              onChange={this.handleBookChange}
            />
            <progress value={this.state.progressBook} max="100" />
          </Form.Group>
          <Button
            type="submit"
            style={{
              position: "left",
              display: "block",
              padding: "10px 20px",
              clear: "both"
            }}
          >
            Add Book
          </Button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createBook: newBook => dispatch(createBook(newBook))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddBook);
