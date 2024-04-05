import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import "./Stockprediction.css";

const StockPrediction = () => {
  const [predictionImage, setPredictionImage] = useState("");
  const [ma100Image, setMa100Image] = useState("");
  const [ma200Image, setMa200Image] = useState("");
  const [dfInfo, setDfInfo] = useState("");
  const [showImage, setShowImage] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    console.log(event.target.previousSibling.value);
    let stockName = event.target.previousSibling.value;

    if (stockName != null) {
      setLoading(true);
      setShowImage(true);
      setShowTable(true);
    }
    fetch("/prediction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stockName }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPredictionImage(data.image);
        setMa100Image(data.imagema100);
        setMa200Image(data.imagema200);
        setDfInfo(data.df_info);
      })
      .finally(() => setLoading(false)); // Set loading to false when the fetch is done
  };

  return (
    <div id="main">
      <div id="stockName">
        <h1>Stock Price Prediction</h1>
        <input name="StocksName" placeholder="Enter the Stock Name"></input>
        <button
          className="btn btn-outline-success"
          onClick={(e) => handleChange(e)}>
          Submit
        </button>
      </div>
      <br></br>
      <div id="stockTable">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <StockTable /> <StockImages />
          </div>
        )}
      </div>
    </div>
  );

  function StockTable() {
    return showTable ? (
      <Table>
        <thead>
          <tr>
            {typeof dfInfo.columns === "undefined" ? (
              <td></td>
            ) : (
              dfInfo.columns.map((column, i) => <th key={i}>{column}</th>)
            )}
          </tr>
        </thead>
        <tbody>
          {typeof dfInfo.data === "undefined" ? (
            <tr></tr>
          ) : (
            dfInfo.data.slice(0, 5).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </Table>
    ) : (
      <></>
    );
  }

  function StockImages() {
    return showImage ? (
      <div id="images">
        <h1>Moving Average 100</h1>
        {ma100Image ? (
          <img
            src={`data:image/png;base64,${ma100Image}`}
            alt="Stock Prediction"
          />
        ) : (
          <p></p>
        )}
        {ma200Image ? (
          <div>
            <h1>Moving Average 200</h1>
            <img
              src={`data:image/png;base64,${ma200Image}`}
              alt="Stock Prediction"
            />
          </div>
        ) : (
          <p></p>
        )}
        {predictionImage ? (
          <div>
            <h1>Price Prediction</h1>
            <img
              src={`data:image/png;base64,${predictionImage}`}
              alt="Stock Prediction"
            />
          </div>
        ) : (
          <p></p>
        )}
      </div>
    ) : (
      <></>
    );
  }
};

export default StockPrediction;
