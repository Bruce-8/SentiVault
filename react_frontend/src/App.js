import './App.css';
import { useState } from 'react';
import axios from "axios";

function App() {
  // Setting states.
  const [sentiments, setSentiments] = useState([]);
  const [prediction, setPrediction] = useState("");

  // Building methods to make and handle API requests.
  function handleGet() {
    axios.get("http://localhost:8000").then((response) => {
      setSentiments(response.data);
    });
  }

  function handlePost(post) {
    axios.post("http://localhost:8000", { post }).then((response) => {
      setSentiments([...sentiments, response.data])
      setPrediction(response.prediction);
    });
  }

  function handlePut(id, newInfo) {
    axios.post(`http://localhost:8000/sentiments/${id}`, { newInfo }).then((response) => {
      setPrediction(response.prediction);
    });
  }

  function handleDelete(id) {
    axios.delete(`http://localhost:8000/sentiments/${id}`).then((response) => {
      setSentiments(sentiments.filter(sentiment => sentiment.id !== id));
    });
  }

  return (
    <div className="App">
      <h1>SentiVault</h1>
    </div>
  );
}

function NewSentimentView({ prediction, onPost }) {
  return (
    <>

    </>
  )
}

function SentimentLog({ sentiments, onGet, onPut, onDelete }) {
  
}

export default App;
