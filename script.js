
async function getMenu(){
    try{
        const response = await fetch("https://raw.githubusercontent.com/saksham-accio/f2_contest_3/main/food.json");
        const data = await response.json();

        const menu = document.getElementById("menu");

        data.forEach((item) => {
        menu.innerHTML += `
        <div class="menu-container">
        <img src="${item.imgSrc}" alt=${item.name}>
        <h5>${item.name}</h5>
        <p>Price:${item.price}</p>
        <div>
        <button onclick="addOrder('${item.name}' ,${item.price})" class="add-btn">Add Item</button>
      </div>
      
        </div>
        `;
        });

       
    }
    catch(error){
        console.log(error);
    }
}

getMenu();

function addOrder(name , price){
    const orderItemsList = document.getElementById("orders-items-list");
    const orderItemsTotal = document.getElementById("orders-items-total");
 
   
    let itemText = `<p>${name} : ${price}</p>`;
    orderItemsList.innerHTML += itemText;
    
    let currentTotal = parseFloat(orderItemsTotal.innerHTML.split(" ")[1]) || 0;
    let newTotal = currentTotal + price;
    orderItemsTotal.innerHTML = `<h3>Total: ${newTotal.toFixed(2)}</h3>`;
   
}

async function takeOrder() {
    try {
      const burgers = [
        { name: "Classic Burger", price: 10 },
        { name: "Cheeseburger", price: 12 },
        { name: "Bacon Cheeseburger", price: 14 },
        { name: "Veggie Burger", price: 10 },
        { name: "Mushroom Swiss Burger", price: 13 },
      ];
  
      const order = {
        burgers: [],
        total: 0,
      };
  
      for (let i = 0; i < 3; i++) {
        const burgerIndex = Math.floor(Math.random() * burgers.length);
        const burger = burgers[burgerIndex];
        order.burgers.push(burger);
        order.total += burger.price;
      }
  
      const orderSummary = getOrderSummary(order);
      const takeOrderButton = `
        <button class="btn btn-primary" onclick="takeOrder()">Take Order</button>
      `;
      let summaryHtml = "";
      summaryHtml += takeOrderButton;
  
      const orderDiv = document.getElementById("order-summary");
      orderDiv.innerHTML = orderSummary + summaryHtml;
  
      const orderStatus = await orderPrep();
      if (orderStatus.paid) {
        throw new Error("Order has already been paid");
      }
  
      const paymentStatus = await payOrder();
      if (!paymentStatus.paid) {
        throw new Error("Payment has not been processed");
      }
  
      thankyouFnc();
    } catch (error) {
      console.error(error);
    }
  }
  function getOrderSummary(order) {
    let summaryHtml = "<h2>Order Summary</h2>";
    let total = 0;
    for (let i = 0; i < order.burgers.length; i++) {
      const burger = order.burgers[i];
      summaryHtml +=`<p>${burger.name} - $${burger.price}</p>`;
      total += burger.price;
    }
    summaryHtml += `<h3>Total: $${order.total}</h3>`;
    return summaryHtml;
  }
  
  // Function to prepare order
  function orderPrep() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = "Order Status:True and Payment:False";
        resolve({ order_status: true, paid: false });
      }, 1500);
    });
  }
  
  // This part is used for payment
  function payOrder() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = "Order Status:True and Payment:True";
        resolve({ order_status: true, paid: true });
      }, 1000);
    });
  }
  
  //This part of the function is used for displaying the thank you message and i also relaods the page
  function thankyouFnc() {
    alert("Thank you for eating with us today! Have a great day");
    location.reload();
  }
  
  // Taking the orders
  function takeOrder() {
    orderPrep()
      .then((order) => {
        if (order.paid) {
          throw new Error("Order has already been paid");
        }
        return payOrder();
      })
      .then((order) => {
        if (!order.paid) {
          throw new Error("Payment has not been processed");
        }
        thankyouFnc();
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  // this is the function we are using to take the order
  async function takeOrderAsync() {
    try {
      const order = await orderPrep();
      if (order.paid) {
        throw new Error("Order has already been paid");
      }
      const payment = await payOrder();
      if (!payment.paid) {
        throw new Error("Payment has not been processed");
      }
      thankyouFnc();
    } catch (error) {
      console.error(error);
    }
  }
  
  // Ge the menu
  getMenu();
  
  // clicking it to get menu
  const takeOrderButton = document.getElementById("take-order-button");
  takeOrderButton.addEventListener("click", takeOrderAsync);