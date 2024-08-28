'use strict';

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
// BANKLLIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3200, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
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

const displayMovement = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
        <div class="movements__row">
            <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
            <div class="movements__value">${mov}£</div></div>
        </div>     
        `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}£`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}£`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}£`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${Math.abs(interest)}£`;
};

const createUsernames = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

const updateUI = function (acc) {
  // Display Movemnts
  displayMovement(acc.movements);

  // Display Balance
  calcDisplayBalance(acc);

  // Display Summary
  calcDisplaySummary(acc);

  console.log('Login');
};

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const euroToUsd = 1.1;

// PIPELINE
const totalDepositsUsd = movements
  .filter(mov => mov > 0)
  .map(mov => mov * euroToUsd)
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositsUsd);

// Event Handlers
let currentAccount;
console.log(accounts.map(acc => acc.username));

btnLogin.addEventListener('click', function (e) {
  // To prevent for form submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and A Welcome Message
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear the Inpu tfield
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance > amount &&
    recieverAcc?.username != currentAccount.username
  ) {
    // Doing  Transfer
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
    inputTransferAmount.value = inputTransferTo.value = '';
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update the UI
    updateUI(currentAccount);
    inputLoanAmount.value = '';
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // Deletr account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovement(currentAccount.movements, !sorted);
  sorted = !sorted;
});
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States Dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound Sterling'],
// ]);

/////////////////////////////////////////////////////////////////////////////////
/*
// SLICE METHOD (DOES NOT Mutates Original Array)
let arr = ['a', 'b', 'c', 'd', 'e'];
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
console.log(arr.slice());
console.log(...arr);

// SPLICE(Mutates Original Array)
console.log(arr.splice(-1));
console.log(arr);
arr.splice(1, 2);
console.log(arr);

// REVERSE (Mutates Original Array)
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

// CONCAT (DOES NOT Mutates Original Array)
const letters = arr.concat(arr2);
console.log(letters);
// We cam also do this
console.log([...arr, ...arr2]);

// JOIN
console.log(letters.join('-'));

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// for (const movement of movements) {
    // To Access the indexes of the array elements, remember we do this:
    for (const [i, movement] of movements.entries()) {
        if (movement > 0) {
            console.log(`Movement ${i + 1}: You deposited ${movement}`);
        } else {
            console.log(`Movement ${i + 1}: You witdrew ${Math.abs(movement)}`);
    }
}

console.log('----------FOR EACH-------------');

// movements.forEach(function (movement, index, array) {
    // NB: Always remember the order of the parameters,  the naming doesn't matter, it
    // is the order that actually matters
    // we also use shorter names in practice...like:
    movements.forEach(function (mov, i, arr) {
        if (mov > 0) {
            console.log(`You deposited ${mov}`);
        } else {
            console.log(`You witdrew ${Math.abs(mov)}`);
    }
});

// What the forEach function basically does is
// 1. It takes a callback function
// 2. It calls the callback function for each element in the array
// 3. It passes the current element as an argument to the callback function
// 4. It calls the callback function for each element in the array
// therefore
// 0: function(200)
// 1: function(450)
// 2: function(400)
// ...

//////////////////////////////////////////////////////////////////////////////
// HOW forEach WORKS MAPS AND SETS

const currencies = new Map([
    ['USD', 'United States Dollar'],
    ['EUR', 'Euro'],
    ['GBP', 'Pound Sterling'],
]);

// Map
currencies.forEach(function (value, key, map) {
    console.log(`${key}: ${value}`);
});

// Set
const currentUniques = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currentUniques);

currentUniques.forEach(function (value, _, map) {
    console.log(`${value}: ${value}`);
});
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
// CODING CHALLENGE 1

// const dogsJulia = [3, 5, 2, 12, 7];
// const dogsKate = [4, 1, 15, 8, 3];

const dogsJulia = [9, 16, 6, 8, 3];
const dogsKate = [10, 5, 6, 1, 4];
const totalArray = [...dogsJulia, ...dogsKate];

const checkDogs = function (newTotalArray) {
    newTotalArray.forEach(function (age, i) {
        age >= 3
        ? console.log(`Dog number ${i + 1} is an adult and is ${age} years old`)
        : console.log(`Dog number ${i + 1} is still a puppy 🐶`);
    });
};
const shallowDogsJulia = dogsJulia.slice(2, -1);
// shallowDogsJulia.slice(2, -1);
console.log(shallowDogsJulia);
const newTotalArray = [...shallowDogsJulia, ...dogsKate];

checkDogs(newTotalArray);

//////////////////////////////////////////////////////////////
// MAP
const euroToUsd = 1.1;

// const movementUSD = movements.map(function (mov) {
//   return mov * euroToUsd;
// });
const movementUSD = movements.map(mov => mov * euroToUsd);

console.log(movements);
console.log(movementUSD);

const movementsUSDfor = [];
for (const mov of movements) movementsUSDfor.push(mov * euroToUsd);
console.log(movementsUSDfor);

const movementDescriptions = movements.map((mov, i) => {
    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
        mov
    )}`;
});
console.log(movementDescriptions);

//////////////////////////////////////////////////////////////////
// FILTER
const deposit = movements.filter(function (mov) {
    return mov > 0;
});
const debit = movements.filter(mov => mov < 0);
console.log(movements);
console.log(deposit);
console.log(debit);

const depositFor = [];
for (const mov of movements) if (mov > 0) depositFor.push(mov);
console.log(depositFor);

const withdrawal = [];
for (const mov of movements) if (mov < 0) withdrawal.push(mov);
console.log(withdrawal);


////////////////////////////////////////////////////////////////
// REDUCE
console.log(movements);

// Accumulator (acc) is like a snowball
const balance = movements.reduce((acc, cur) => {
    acc + cur;
}, 0);
console.log(balance);
// const balance = movements.reduce(function (acc, cur, i, arr) {
    //   console.log(`iteration ${i}: ${acc}`);
    //   return acc + cur;
    // }, 0);
    // console.log(balance);
    
    let balance2 = 0;
    for (const mov of movements) balance2 += mov;
    console.log(balance2);
    
    // Maximum Value
    const max = movements.reduce((a, b) => (a > b ? a : b), movements[0]);

 ////////////////////////////////////////////////////////////////////////////////
// CODING CHALLENGE 2

// const dogsJulia = [3, 5, 2, 12, 7];
// const dogsKate = [4, 1, 15, 8, 3];

const dogsJulia = [9, 16, 6, 8, 3];
const dogsKate = [10, 5, 6, 1, 4];
const totalArray = [...dogsJulia, ...dogsKate];

const checkDogs = function (newTotalArray) {
    newTotalArray.forEach(function (age, i) {
    age >= 3
    ? console.log(`Dog number ${i + 1} is an adult and is ${age} years old`)
      : console.log(`Dog number ${i + 1} is still a puppy 🐶`);
  });
};
const shallowDogsJulia = dogsJulia.slice(2, -1);
// shallowDogsJulia.slice(2, -1);
console.log(shallowDogsJulia);
const newTotalArray = [...shallowDogsJulia, ...dogsKate];
checkDogs(newTotalArray);
const calcAvgHumanAge = function (ages) {
    const humanAge = [];
    ages.map(dogAge => {
    dogAge <= 2 ? humanAge.push(2 * dogAge) : humanAge.push(16 + dogAge * 2);
});
//   console.log(humanAge);
const filteredHumanAge = humanAge.filter(age => age > 18);
//   console.log(filteredHumanAge);
const avgOfHumanAge = filteredHumanAge.reduce(
    (acc, p) => acc + p / filteredHumanAge.length,
    0
);
console.log(avgOfHumanAge);
//   const avgOfHumanAge = sumOfHumanAge / filteredHumanAge.length;
//   console.log(avgOfHumanAge);
};
calcAvgHumanAge([5, 2, 4, 1, 15, 8, 3]);
calcAvgHumanAge([16, 6, 10, 5, 6, 1, 4]);

//////////////////////////////////////////////////////////////////////////////
// FIND METHOD

const firstWithdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');

// const accountForOf =
for (const account of accounts) {
  if (account.owner === 'Jessica Davis') {
    console.log(account);
  }
}


////////////////////////////////////////////////////////////////////////////////////////
// SOME METHODS
// The includes methoc checks for equaity
console.log(movements.includes(-130));

// While in some method we an specify the condition
console.log(movements.some(mov => mov === 130));

const anyDeposit = movements.some(mov => mov > 1500);
console.log(anyDeposit);

// EVERY METHOD
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

// Seperate CallBack
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));

//////////////////////////////////////////////////////////////////////////////////////
// FLAT AND FLAT MAP

// FLAT
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());
// console.log(arr.flat(1)); // 1 is the depth level to flatten to
// console.log(arr.flat(2)); // 2 is the depth level to flatten to
// console.log(arr.flat(Infinity)); // Infinity is the depth level to flatten to
// console.log(arr.flat(0)); // 0 is the depth level to flatten to
// console.log(arr.flat(3)); // 3 is the depth level to flatten to
// console.log(arr.flat(4)); // 4 is the depth level to flatten to
const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep);
console.log(arrDeep.flat(2));
const accountMovements = accounts.map(acc => acc.movements);
console.log(accountMovements);
const allMovements = accountMovements.flat();
console.log(allMovements);
const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);

// Using Optional Chaining
const overallBalance2 = accounts
.map((acc, acc.movements))
.flat()
.reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance2);

// FLAT MAP
const overallBalance3 = accounts
.flatmap((acc, acc.movements))
.reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance3);

// Sorting Strings
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());

// Numbers
console.log(movements);
// console.log(movements.sort()); // This doesnt work

// return < 0, A before B
// return > 0, B before A
// return 0, A and B are equal


// Ascending
movements.sort((a, b) => {
  if (a > b) return 1;
  if (a < b) return -1;
  });
  console.log(movements);
//// OR WE CAN DO THIS
movements((a, b) => a - b);

// Descending
movements.sort((a, b) => {
  if (a > b) return -1;
  if (a < b) return 1;
});
console.log(movements);

*/

const arr = [1, 2, 3, 4, 5, 6, 7];
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

const x = new Array(7);
console.log(x);
console.log(x.map(() => 5));

// FILL
x.fill(1);
x.fill(1, 3, 5);
console.log(x);

arr.fill(23, 2, 6);
console.log(arr);

// Array.From
const y = Array.from({ lenght: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

const dice = Array.from({ length: 100 }, (x, i) =>
  Math.trunc(Math.random(x * 6))
);
console.log(dice);

labelBalance.addEventListener('click', function () {
  const movementUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('£', ''))
  );

  console.log(movementUI);

  const movementUI2 = [...document.querySelectorAll('.movements__value')];
  console.log(movementUI2);
});
