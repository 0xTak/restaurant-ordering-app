import { menuArray } from './data.js';


// function for generating the HTML feed from the menu array
function getMenuFeedHtml() {
    let menuFeedHtml =''
    menuArray.forEach(function(menuItem){
        menuFeedHtml += `
            <section class='item-container'>
                <div class='product-img'>
                    <h1 class="product-emoji">${menuItem.emoji}</h1>
                </div>
                <div class='menu-details'>
                    <h1 class='product-name'>${menuItem.name}</h1>
                    <p class='product-ingredients'>${menuItem.ingredients.join(", ")}</p>
                    <h3 class='product-price'>$${menuItem.price}</h3>
                </div>
                <button class='btn' data-menuitem-id="${menuItem.id}">
                    <i class="fa-solid fa-plus" class='btn' data-menuitem-id="${menuItem.id}"></i>
                </button>
            </section>
        `
    })
    return menuFeedHtml
}

// event listener for add and remove item button clicks 
document.addEventListener('click', function(e) {
    // detect add item button click 
    if(e.target.dataset.menuitemId){
        addMenuItemToOrder(e.target.dataset.menuitemId)
    }
    // detect remove item button click 
    if(e.target.classList.contains('remove-item')){
        const itemId = e.target.dataset.itemId;
        if (orders[itemId].quantity > 1) {
            orders[itemId].quantity -= 1;
        } else {
            delete orders[itemId];
        }
        renderOrder();
    }
})

// function to render the menu feed 
function render(){
    document.getElementById('menu').innerHTML = getMenuFeedHtml()
}

// render the initial state
render();

// initialize the orders object
let orders = {};

// function to add a menu item to the order
function addMenuItemToOrder(itemId) { 
    const orderedItemObj = menuArray.filter(function(item) {
        return item.id == itemId;
    })[0];
    
    if (orders[itemId]) {
        orders[itemId].quantity += 1;
    } else {
        orders[itemId] = {...orderedItemObj, quantity: 1};
    }
    
    renderOrder();
}

// function to render the current order 
function renderOrder() {
    let total = 0;
    let orderItemsHTML = '';
    
    // build HTML content and calculate total price 
    for(let itemId in orders){
        total += orders[itemId].quantity * orders[itemId].price;
        orderItemsHTML += `
        <div class="checkout-container">
            <p>${orders[itemId].name} x ${orders[itemId].quantity}</p>
            <div class='remove-btn'>
            <button class="remove-item" data-item-id="${itemId}">Remove</button>
            </div>
            <p class='item-price-size'>$${orders[itemId].price * orders[itemId].quantity}</p>
        </div>
        `;
    }

    // compoile and set the final HTML for the order 
    let orderHTML = `
        <div class="order-section">
            <h2 class='your-order'>Your Order</h2>
            ${orderItemsHTML}
            <div class="checkout-total">
                <p>Total Price:</p> 
                <p>$${total}</p>
            </div>
            <div class='complete-order-btn'>
                <button class="complete-order" id="complete-request">Complete Order</button>
            </div>
        </div>
    `;
    document.getElementById('order').innerHTML = orderHTML;
    
    // add event listener for modal display and hide 
    document.getElementById('complete-request').addEventListener('click', function(){
        modal.style.display = 'block'
    })
    document.getElementById('modal-close-btn').addEventListener('click', function(){
        modal.style.display = 'none'
    })
}

// handling the payment proceee

const paymentMethodForm = document.getElementById('payment-method')
// adding a click event listener to the payment button 
document.getElementById('modal-pay-btn').addEventListener('click', function(e){
    e.preventDefault()
    const paymentMethodFormData = new FormData(paymentMethodForm)
    const name = paymentMethodFormData.get('userName')
    const cardNumber = paymentMethodFormData.get('userCardNumber')
    const cardCvv = paymentMethodFormData.get('userCardCVV')
    
    // check the form data for validity 
    if (paymentMethodForm.checkValidity()) {
        let userName = document.getElementById('name').value;
        modal.style.display = 'none'
        document.getElementById('order').innerHTML = `<div class="thank-you-container"><h2>Thanks, <span class="modal-display-name">${userName}</span>! Your order is on its way!</h2></div>`;
        orders = {}; 
    } else {
        paymentMethodForm.reportValidity()
    }
})
    
