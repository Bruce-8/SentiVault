import { useEffect, useState } from 'react';
import axios from "axios";
import {Modal, Row, Col, Card, Container, Form, Button, ListGroup} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  // Setting states.
  const [sentiments, setSentiments] = useState([]);
  const [prediction, setPrediction] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Building methods to make and handle API requests.
  function changeTitle(title) {
    setTitle(title);
  }

  function changeContent(content) {
    setContent(content);
  }
  
  const handleTitle = (e) => {
    setTitle(e.target.value);
  }

  const handleContent = (e) => {
    setContent(e.target.value);
  }
  
  useEffect(() => {
    const handleGet = async () => {
      axios.get("http://localhost:8000/sentiments/").then((response) => {
        setSentiments(response.data);
      });
    }

    handleGet();
  }, []);

  function handlePost(title, content) {
    const form = {
      title: title,
      content: content,
      prediction: ''
    }
    axios.post("http://localhost:8000/sentiments/", form).then((response) => {
      setSentiments([...sentiments, response.data])
      setPrediction(response.data.prediction);
      console.log(sentiments);
    });
  }

  function handlePut(id, title, content) {
    const form = {
      title: title,
      content: content,
      prediction: ''
    }
    axios.put(`http://localhost:8000/sentiments/${id}/`, form).then((response) => {
      setSentiments(sentiments.map(sentiment =>
        sentiment.id === id ? response.data : sentiment
      ));
      setPrediction(response.data.prediction);
    });
  }

  function handleDelete(id) {
    axios.delete(`http://localhost:8000/sentiments/${id}`).then((response) => {
      setSentiments(sentiments.filter(sentiment => sentiment.id !== id));
    });
  }

  return (
    <>
      <Card bg="secondary" className="text-center">
        <Card.Header as="h1" style={{ color: 'white', fontSize: '50px', fontWeight: 'bold' }}>SentiVault</Card.Header>
      </Card>
      <Container fluid className="vh-100 bg-dark">
        <Row>
          <Col xs={6} className="mt-4">
            <NewSentimentView title={title} content={content} prediction={prediction} onPost={handlePost} onTitle={handleTitle} onContent={handleContent} />
          </Col>
          <Col xs={6} className="mt-4">
            <SentimentLog title={title} content={content} sentiments={sentiments} onDelete={handleDelete} onPut={handlePut} onTitle={handleTitle} onContent={handleContent} changeContent={changeContent}
            changeTitle={changeTitle}/>
          </Col>
        </Row>
      </Container>
    </>
  );
}

function NewSentimentView({ title, content, prediction, onPost, onTitle, onContent }) {
  let prediction_color = "light";

  if (prediction === "Positive") {
    prediction_color = "success";
  } else if (prediction === "Negative") {
    prediction_color = "danger";
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onPost(title, content);
  }

  return (
    <>
      <Card border="light" style={{ borderWidth: '5px' }} bg="secondary" text="light">
        <Card.Header as="h1" style={{ fontSize: '40px', fontWeight: 'bold', textAlign: 'center' }}>New Sentiment</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Label style={{ fontSize: '30px', fontWeight: 'bold', textAlign: 'left' }} className="text-left">Title</Form.Label>
            <br />
            <Form.Control style={{ fontSize: '20px', fontWeight: 'bold'}} type='text' onChange={onTitle}></Form.Control>
            <br />
            <Form.Label style={{ fontSize: '30px', fontWeight: 'bold', textAlign: 'left' }} className="text-left">Content</Form.Label>
            <br />
            <Form.Control style={{ fontSize: '20px', fontWeight: 'bold'}} as="textarea" onChange={onContent}></Form.Control>
            <br />
            <div className="d-grid gap-2">
              <Button type="submit" variant="primary" style={{ fontSize: '30px', fontWeight: 'bold'}}>Create New Sentiment</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      <Card className="mt-4" border="light" style={{ borderWidth: '5px' }} bg="secondary" text="light">
        <Card.Header as="h1" style={{ fontSize: '40px', fontWeight: 'bold', textAlign: 'center' }}>Current Prediction</Card.Header>
        <Card.Body>
          <p style={{fontSize: '30px', fontWeight: 'bold'}}>{`Sentiment Content: `}</p>
          <Card text="primary" style={{fontSize: '30px', fontWeight: 'bold', textAlign: 'center'}}>{content}</Card>
          <p style={{fontSize: '30px', fontWeight: 'bold'}}>Prediction: </p>
          <Card bg={prediction_color} text="light" style={{fontSize: '30px', fontWeight: 'bold', textAlign: 'center'}}>{prediction}</Card>
        </Card.Body>
      </Card>
    </>
  )
}

function SentimentLog({ title, content, sentiments, onDelete, onPut, onTitle, onContent, changeTitle, changeContent }) {
  const [show, setShow] = useState(false);
  const [id, setId] = useState(null);

  function handleClose() {
    setShow(false);
  }

  function handleShow(id, title, content) {
    changeTitle(title);
    changeContent(content);
    setId(id);
    setShow(true);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onPut(id, title, content);
    handleClose()
  }

  return (
    <>       
      <Card border="light" style={{ borderWidth: '5px' }} bg="secondary" text="light">
        <Card.Header as="h1" style={{ fontSize: '40px', fontWeight: 'bold', textAlign: 'center' }}>My Sentiments</Card.Header>
        <Card.Body>
          <ListGroup>
            {sentiments.map((sentiment) => {
              return (
                <ListGroup.Item variant="dark">
                  <Row>
                    <Col xs={6}>
                      <span style={{ fontSize: '15px', fontWeight: 'bold'}}>Title: </span>
                      <span style={{ fontSize: '15px'}}>{sentiment.title}</span>
                      <br />
                      <span style={{ fontSize: '15px', fontWeight: 'bold'}}>Prediction: </span>
                      <span style={{ fontSize: '15px'}}>{sentiment.prediction}</span>
                    </Col>
                    <Col xs={6}>
                      <Button onClick={() => handleShow(sentiment.id, sentiment.title, sentiment.content)} variant="primary" style={{ fontSize: '15px', fontWeight: 'bold'}}>Update</Button>
                      <Button onClick={() => onDelete(sentiment.id)} variant="danger" style={{ fontSize: '15px', fontWeight: 'bold', marginLeft: '20px'}}>Delete</Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )
            })}
          </ListGroup>
        </Card.Body>
      </Card>
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title style={{fontWeight: 'bold'}}>Update Sentiment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
              <Form.Label style={{fontWeight: 'bold'}}>Title</Form.Label>
              <br />
              <Form.Control type='text' value={title} onChange={onTitle}></Form.Control>
              <br />
              <Form.Label style={{fontWeight: 'bold'}}>Content</Form.Label>
              <br />
              <Form.Control as="textarea" value={content} onChange={onContent}></Form.Control>
              <br />
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" type="submit">
                  Update Sentiment
                </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
    </Modal>
    </>
  )
}

export default App;
