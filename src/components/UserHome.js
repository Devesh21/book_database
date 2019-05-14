import React, {Component} from "react";
import { Container, Row, Col} from "react-bootstrap";
import { Redirect } from 'react-router-dom';
import Favourite from "./Favourite.js";
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import firebase from '../config/firebaseConfig';
const firestore = firebase.firestore();


class UserHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      books: []
    };
  }

  componentDidMount(){
    const books = [];
    firestore.collection('books').get().then((snapshot)=> {
      snapshot.docs.forEach(item => {
        console.log(item.data());
        books.push(item.data());
      })
    }).then(()=>{
      this.setState({ books: books })
      console.log(this.state.books);
    });
  }

  render() {
    
        const { auth } = this.props;


        if(!auth.uid){
          return (<Redirect to="/"/>)
        }

        var bookList = this.state.books;

        return (
          <Container style={{"maxWidth": "99%", margin: "10px","fontFamily": "Trebuchet MS"}}>
            <Row>
              <Col style={{"border": "solid"}}>
                <h2 style = {{padding: "10px"}}>My Books</h2>
                <Row style = {{padding: "10px", "fontSize": " 30px"}}>
                  {
                    Object.keys(bookList).map(function (book) {
                      return <Col xs={6} md={4} lg={3} key={book} style={{"maxWidth": "50%"}}>
                        <img src={bookList[book].coverFile} alt="BookCover"/>
                        {bookList[book].bookName}
                      </Col>
                    })
                  }
                </Row>
              </Col>
              <Favourite/>
            </Row>
          </Container>
    
        )

  }
}


const mapStateToProps = (state) => {
  return {
    books: state.books,
    auth: state.firebase.auth,
    profile: state.firebase.profile
  }
}

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    {collection: 'books'}
  ])
)(UserHome);