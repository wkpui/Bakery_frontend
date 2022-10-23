import React, { useState, useEffect } from 'react';
import logo from './appelflap.png';
import './App.css';

function App() {
  const [msg, setMsg] = useState(0);
  const [productSelect, setProductSelect] = useState(1);
  const [quantity, setQuantity] = useState("0");
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [products, setProducts] = useState([]);
  const api_url = 'https://3vur6j5k4j.execute-api.eu-central-1.amazonaws.com/prod';
  const toggleShowOrders = () => {
    setShowOrders(!showOrders);
  }
  useEffect(() => {
    fetch(api_url + '/product').then(res => res.json()).then(data => {
      setProducts(data.body);
    });
  },[]);

  useEffect(() => {
    fetch('/welcome').then(res => res.json()).then(data => {
      setMsg(data.msg);
    });
  },[]);

  useEffect(() => {
    fetch(api_url + '/order').then(res => res.json()).then (data => {
      setOrders(data.body);
    });
  },[]);

  return (
    <div className="App">
       <header className="App-header">
         <img src={logo} className="App-logo" alt="logo" />
         <p>welcome</p>

  	 <label for="productSelect">Select a Product</label>
  	 <select id="productSelect"  value={productSelect}
              onChange={(e) => {
              setProductSelect(e.target.value);
           }}>
  	   <option key='1' value='none'>---</option>
           {products.map(({product_id, price}) =>
             <option key={product_id} value={product_id}>
               {product_id}
             </option>
           )}
           </select>
     <label for="quantity">Quantity:</label>
     <input type="number" step="1" min="0" id="quantity"  value={quantity} onChange={e => setQuantity(e.target.value)} /><br />
     <button
        type="submit"
        value="Submit Order"
          onClick={async () => {
          const orderInfo = {"product_name":productSelect , "quantity":quantity };
          const response = await fetch(api_url + '/order', {
          method: "POST",
            headers: {
              'Content-Type' : 'application/json'
            },
            body: JSON.stringify(orderInfo)
          });
          window.location.reload(true);
        }}>Submit Order
      </button>
      <button onClick={toggleShowOrders}>Show Orders</button>
      {showOrders &&(<p>
      {orders.map(({num_id, product_name, quantity, total_price}) =>
              <>Order# {num_id} : {quantity} {product_name} = ${total_price} <br /></>
      )} </p>)
      }
      <br /><br /><br />
      <button
         type="delete"
         value="Delete Orders"
           onClick={async () => {
           const response = await fetch(api_url + '/order', {
           method: "DELETE",
             headers: {
               'Content-Type' : 'application/json'
             }
           });
           window.location.reload(true);
         }}>Delete Orders
       </button>
    </header>
  </div>
  );
}

export default App;
