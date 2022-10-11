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
  const toggleShowOrders = () => {
    setShowOrders(!showOrders);
  }
  useEffect(() => {
    fetch('/products').then(res => res.json()).then(data => {
      setProducts(data);
    });
  },[]);

  useEffect(() => {
    fetch('/welcome').then(res => res.json()).then(data => {
      setMsg(data.msg);
    });
  },[]);

  useEffect(() => {
    fetch('/order').then(res => res.json()).then (data => {
      setOrders(data);
    });
  },[]);

  return (
    <div className="App">
       <header className="App-header">
         <img src={logo} className="App-logo" alt="logo" />
         <p>{msg}</p>

  	 <label for="productSelect">Select a Product</label>
  	 <select id="productSelect"  value={productSelect}
              onChange={(e) => {
              setProductSelect(e.target.value);
           }}>
  	   <option key='1' value='none'>---</option>
           {products.map(({id, price, product_name}) =>
             <option key={id} value={product_name}>
               {product_name}
             </option>
           )}
           </select>
     <label for="quantity">Quantity:</label>
     <input type="number" step="1" min="0" id="quantity"  value={quantity} onChange={e => setQuantity(e.target.value)} /><br />
     <button
        type="submit"
        value="Submit Order"
          onClick={async () => {
          const orderInfo = { "product_name":productSelect , "quantity":quantity };
          const response = await fetch("/order", {
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
      {orders.map(({id, product_name, quantity, total_price}) =>
              <>Order# {id} : {quantity} {product_name} = ${total_price} <br /></>
      )} </p>)
      }
      <br /><br /><br />
      <button
         type="delete"
         value="Delete Orders"
           onClick={async () => {
           const response = await fetch("/order", {
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
