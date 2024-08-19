import './App.css';
import { useEffect, useState } from 'react';
import axios from "axios";

function App() {
  // Setting states.
  const [sentiments, setSentiments] = useState([]);
  const [prediction, setPrediction] = useState("");

  // Building methods to make and handle API requests.
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

  // function handlePut(id, newInfo) {
  //   axios.post(`http://localhost:8000/sentiments/${id}`, { newInfo }).then((response) => {
  //     setPrediction(response.prediction);
  //   });
  // }

  function handleDelete(id) {
    axios.delete(`http://localhost:8000/sentiments/${id}`).then((response) => {
      setSentiments(sentiments.filter(sentiment => sentiment.id !== id));
    });
  }

  return (
    <>
      <center><h1>SentiVault</h1></center>
      <div>
        <NewSentimentView prediction={prediction} onPost={handlePost} />
        <SentimentLog sentiments={sentiments} onDelete={handleDelete} />
      </div>
    </>
  );
}

function NewSentimentView({ prediction, onPost }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleTitle = (e) => {
    setTitle(e.target.value);
  }

  const handleContent = (e) => {
    setContent(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onPost(title, content);
  }

  return (
    <>
      <div>
        <h2>New Sentiment</h2>
        <form onSubmit={handleSubmit}>
          <p>Title</p><input type="text" value={title} onChange={handleTitle}/>
          <br></br>
          <p>Content</p><input type="text" value={content} onChange={handleContent}/>
          <br></br>
          <button type="submit">Predict & Create</button>
          <p>{prediction}</p>
        </form>
      </div>
    </>
  )
}

function SentimentLog({ sentiments, onDelete }) {
  const listSentiments = sentiments.map(sentiment =>
    <li>
      {`${sentiment.id}, ${sentiment.title}, ${sentiment.content}, ${sentiment.prediction}`}
      <button onClick={() => onDelete(sentiment.id)}>Delete</button>
    </li>
  );
  return (
    <>
      <div>
        <h2>Sentiments</h2>
        <ul>
          {listSentiments}
        </ul>
      </div>
    </>
  )
}

export default App;
