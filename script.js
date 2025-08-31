"use strict";

// Data
const account1 = {
  owner: "Abdelrahman Steit",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2025-08-28T23:36:17.929Z",
    "2025-08-30T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Mohamed Steit",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

// const account3 = {
//   owner: "Steven Thomas Williams",
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: "Sarah Smith",
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
containerMovements.innerHTML = "";
/////////////////////////////////////////////////
// wanna take all movement data from object and implmented it in dom
const fromatMovementDate = function (date) {
  const calcDayPassed = (date1, date2) => {
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 24 * 60));
  };
  const dayPassed = calcDayPassed(new Date(), date);
  if (dayPassed === 0) return "Today";
  if (dayPassed === 1) return "Yesterday";
  if (dayPassed <= 7) return `${dayPassed} days ago`;
  else {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${day}/${month}/${year}`;
  }
};
const applyMovement = function (acc, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach((move, index) => {
    const typeOfMove = move > 0 ? "deposit" : "withdrawal";
    const date = new Date(acc.movementsDates[index]);
    const displayDate = fromatMovementDate(date);
    const html = `
 <div class="movements__row">
     <div class="movements__type movements__type--${typeOfMove}">${
      index + 1
    }${typeOfMove}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${move}€</div>
</div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const createUserName = function (accs) {
  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUserName(accounts);
const printBalance = function (acc) {
  acc.totalBalance = acc.movements.reduce((acc, cur) => acc + cur);
  labelBalance.textContent = `${acc.totalBalance} EUR`;
};

const pritSumaary = function (acc) {
  const balanceIn = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${balanceIn}`;
  const balanceOut = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, cur) => cur + acc, 0);
  labelSumOut.textContent = `${-balanceOut}`;
  const intersetInaccs = acc.movements
    .filter((mov) => mov > 0)
    .map((deposite) => (deposite * acc.interestRate) / 100)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumInterest.textContent = `${intersetInaccs}`;
};
const updatUI = function (acc) {
  // display movements
  applyMovement(acc);
  //display summary
  pritSumaary(acc);
  // display balance
  printBalance(acc);
};
let counter;
function fromatTimeLogin() {
  clearInterval(counter);
  let time = 300;
  counter = setInterval(() => {
    // describe time u want
    const min = Math.trunc(time / 60);
    const sec = String(time % 60).padStart(2, "0");
    // call it each seconds
    labelTimer.textContent = `${min}:${sec}`;
    // update time
    if (time === 0) {
      clearInterval(counter);
      labelWelcome.textContent = `Signin To Log Into Your Account`;
      containerApp.style.opacity = 0;
    }
    time--;
  }, 1000);
}

let curretAccount;
const now = new Date();
const options = {
  hour: "numeric",
  minute: "numeric",
  month: "long",
  year: "numeric",
  weekday: "long",
};
const local = navigator.language;
labelDate.textContent = new Intl.DateTimeFormat(local, options).format(now);
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  curretAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  if (curretAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back ${curretAccount.owner}`;
    containerApp.style.opacity = 100;

    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, "0");
    const day = `${now.getDate()}`.padStart(2, "0");
    const hour = `${now.getHours()}`.padStart(2, "0");
    const minute = `${now.getMinutes()}`.padStart(2, "0");
  }
  inputLoginPin.value = inputLoginUsername.value = "";
  inputLoginPin.blur();
  fromatTimeLogin();
  updatUI(curretAccount);
});
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && curretAccount.movements.some((mov) => mov >= amount * 0)) {
    curretAccount.movements.push(amount);
    curretAccount.movementsDates.push(new Date().toISOString());
    updatUI(curretAccount);
  }
  inputLoanAmount = "";
});
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciveAccount = accounts.find(
    (acc) => inputTransferTo.value === acc.username
  );
  inputTransferAmount.value = inputTransferTo.value = "";
  if (
    amount > 0 &&
    reciveAccount &&
    curretAccount.totalBalance >= amount &&
    reciveAccount.username !== curretAccount.username
  ) {
    reciveAccount.movements.push(amount);
    curretAccount.movements.push(-amount);
    curretAccount.movementsDates.push(new Date().toISOString());
    reciveAccount.movementsDates.push(new Date().toISOString());
    updatUI(curretAccount);
  }
});
let sort = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  applyMovement(curretAccount, !sort);
  sort = !sort;
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === curretAccount.username &&
    curretAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === inputCloseUsername.value
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});
["click", "keydown", "mousemove", "touchstart"].forEach((event) => {
  document.body.addEventListener(event, () => {
    clearInterval(counter);
    fromatTimeLogin();
  });
});
