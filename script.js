'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Lior Hatiel',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Yuval Goomai',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Lion Priger',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Israel Zehavi',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Introduce accounts to the user:
alert(`In this app we have 4 account - use them as you want :)
1. user: lh , PIN: 1111
2. user: yg , PIN: 2222
3. user: lp , PIN: 3333
4. user: iz , PIN: 4444`);

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


//  -----------------------------------------------  Start writing the JS code:   ----------------------------------------------------

// This function will get the "movement" array.
const displayMovments = function(movementArray) {

  // Clear the movement at the begining.
    // REMEMBER : const containerMovements = document.querySelector('.movements');
    containerMovements.innerHTML = ' ';


  movementArray.forEach( function(mov , i)  // mov = current movement | i = index. start from 0.
  {
    // Declare type -> for us to know if this is deposit or withdrawal.
    const type = mov > 0? 'deposit' : 'withdrawal';

    // Create an HTML element that will be added to the movements section.
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type} </div>
          <div class="movements__value">${mov}€</div>
        </div>
    `

    // Add this html to the html file -> where we needed to.
    // In our case - we needed to add this html to the movement class.
    // REMEMBER : const containerMovements = document.querySelector('.movements');
    containerMovements.insertAdjacentHTML( 'afterbegin' , html);


  } )
}



const calcAndDisplayBalance = function(acc)
{
  // acc = Account = Object.
  // We add a propety to the object that called "balance" , and calculate this property using reduce Method on the movement of the specific account.
  acc.balance = acc.movements.reduce( (acc , mov) => acc + mov , 0);
  labelBalance.textContent = `${acc.balance} €`;
}



// REMEMBER:
// const labelSumIn = document.querySelector('.summary__value--in');
// const labelSumOut = document.querySelector('.summary__value--out');
const calcAndDisplaySummary = function(acc)
{
  const income = acc.movements.filter( mov => mov > 0 ).reduce( (acc , mov) => acc + mov , 0 );
  labelSumIn.textContent = `${income} €`;


  const out = acc.movements.filter( mov => mov < 0 ).reduce ( (acc , mov ) => acc + mov , 0 );
  labelSumOut.textContent = `${Math.abs(out)} €`;
}



const updateUI = function(acc)
{
    // Display movements
    displayMovments(acc.movements);

    // Display balance
    calcAndDisplayBalance(acc);
    
    // Display summary
    calcAndDisplaySummary(acc);
}

const computeUserName = function(accountsArray)
{
  accountsArray.forEach( function(acc){
    acc.username = acc.owner.toLowerCase().split(' ').map( user => user[0]).join('');
  }  )
}
computeUserName(accounts);
console.log(accounts);



let currentAccount;  // Global variable.

// Login Event Handler:
btnLogin.addEventListener('click' , function(e)
{
  e.preventDefault();                                 // To prevent refresh the page -> beacuse the btnLogin button is under a form HTML element.


  // Loop over the accounts username and check if its match to the value inside the inputLoginUsername.
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);

  // Check if the pin of the current account match with the value inside the inputLoginPin.
  if (currentAccount?.pin === Number(inputLoginPin.value))
  {
    // Display UI and Message 
    labelWelcome.textContent = `Welcome Back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); 
    inputLoginUsername.blur();

    // Update the UI
    updateUI(currentAccount);
  }
})


// Transfer Money Event Handler:
btnTransfer.addEventListener('click' , function(e)
{
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const transferReciever = accounts.find(acc => acc.username === inputTransferTo.value);

   // // Clear input fields
   inputTransferTo.value = inputTransferAmount.value = '';
   inputTransferAmount.blur();
   inputTransferTo.blur();

   // The condition for transfer money.
  if (amount > 0 && transferReciever && amount <= currentAccount.balance && transferReciever.username !== currentAccount.username)
  {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    transferReciever.movements.push(amount);

    // Change UI after transfer
    updateUI(currentAccount);
  } 
})


// Loan Event Handler:
// LOAN CONDITION -> If there is any deposit that 10% from the loan request.
btnLoan.addEventListener('click' , function(e)
{
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  // Check the conditions for loan.
  if (amount > 0 && currentAccount.movements.some( mov => mov > (amount * 0.1) ))   // Number * 0.1 === 10% from the number
  {
    // Add the loan to the account.
    currentAccount.movements.push(amount);

    // Update UI after loan
    updateUI(currentAccount);
  }else
  {
    alert(`Loan of ${amount} € does't approved!
You can get a loan if there is a deposit worth 10% of the loan amount you are requesting`);
  }

  // Clear input field
  inputLoanAmount.textContent = '';
  inputLoanAmount.blur();

})


// Delete Account Event Handler:
btnClose.addEventListener('click' , function(e)
{
  e.preventDefault();

  // Check if the user and the pin are match
  if ( inputCloseUsername.value === currentAccount.username &&  Number(inputClosePin.value) === currentAccount.pin )
  {

    // Remove the current account from the accounts array:
    const index = accounts.findIndex( acc => acc.username === currentAccount.username );
    accounts.splice(index , 1);

    // Hide the UI
    containerApp.style.opacity = 0;

  }

  // Clear input fields
  inputCloseUsername.value = inputClosePin.value = '';
  inputCloseUsername.blur();
  inputClosePin.blur();

})
