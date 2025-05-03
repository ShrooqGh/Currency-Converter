//Selecting all DOM elements
const fromCurrencyOptions = document.querySelector('.from-currency select');
const toCurrencyOptions = document.querySelector('.to-currency select');
const fromAmount = document.querySelector('.from-amount input');
const fromResult = document.getElementById('from-result');
const toResult = document.getElementById('to-result');
const convertBtn = document.getElementById('convert-btn');
const swapBtn = document.getElementById('swap-btn');

//a list to holds all rates
let rates=[];

// fetch all live concurrencies rates from API
async function loadCountrySymbols(){
    try{
        const ApiURL = `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=83a944cb84fc41428251174154a46368`;
        const result = await fetch(ApiURL);
        const data = await result.json();
        rates = data.rates;
        //console.log(data);
        //console.log(rates);//rates holds currencies codes as keys 
        // & their rates relative to USD as values
        //we extarcts the currencies codes (keys) then sorts them ascn
        let symbolList = Object.keys(rates).sort();
        //then show them in drop down list
        showData(symbolList);
    } catch (error) {
        console.error("Error fetching data:", error.message);
    }
    
}
//add event listener on page load to fetch & display currency option immediately
document.addEventListener('DOMContentLoaded', () => {
    loadCountrySymbols();
});


//creating html option drop down list to display codes 
//setting default valuies to from=USD, to=EUR
function showData(symbolList){
    //console.log(symbolList);
    let html = "";
    symbolList.forEach(symbol => {
        html += `<option value="${symbol}" data-id = "${symbol}"> ${symbol} </option>`;
    });

    fromCurrencyOptions.innerHTML = html;
    fromCurrencyOptions.querySelectorAll('option').forEach(option => {
        if(option.dataset.id === "USD") option.selected = 'true';
    });

    toCurrencyOptions.innerHTML = html;
    toCurrencyOptions.querySelectorAll('option').forEach(option => {
        if(option.dataset.id === "EUR") option.selected = 'true';
    });
}

//validate the amount to be converted if valid number
//add event listener on amount input when 0 or empty highlights red 
//otherwise normal color
fromAmount.addEventListener('keyup', function(){
    let amount = Number(this.value);
    if(!amount) fromAmount.style.borderColor = "#de3f44";
    else fromAmount.style.borderColor = "#c6c7c9";
});

//event listener whan user clicks convert btn gets the selected currencies & amount
//if amount is valid number calls getConvertedData()
convertBtn.addEventListener('click', () => {
    let fromCurrency = fromCurrencyOptions.value;
    let toCurrency = toCurrencyOptions.value;
    // console.log(fromCurrency, toCurrency);
    let fromAmt = Number(fromAmount.value);
    if(fromAmt) getConvertedData(fromCurrency, toCurrency, fromAmt);
});


//checkes if currencies exists in the lists
//calculates conversion using rates relative to USD
function getConvertedData(from, to, amount) {
    try {
        if (!rates[from] || !rates[to]) throw new Error("Currency not supported");

        // Calculate conversion rate based on USD from 'from' to 'to'
        let rateFrom = parseFloat(rates[from]);
        let rateTo = parseFloat(rates[to]);
        let conversionRate = rateTo / rateFrom;

        let convertedAmount = amount * conversionRate;
        displayConvertedData(from, to, amount, convertedAmount);
    } catch (error) {
        alert("Failed to convert currency: " + error.message);
    }
}

// display the amount & converted result alomg with currencies code 
function displayConvertedData(fromCurrency, toCurrency, fromAmt, toAmt){
    fromResult.innerHTML = `${fromAmt.toFixed(2)} ${fromCurrency}`;
    toResult.innerHTML = `${toAmt.toFixed(2)} ${toCurrency}`;
}

// swap or reverse the currency
swapBtn.addEventListener('click', () => {
    let fromIndex = fromCurrencyOptions.selectedIndex;
    let toIndex = toCurrencyOptions.selectedIndex;
    fromCurrencyOptions.querySelectorAll('option')[toIndex].selected = 'true';
    toCurrencyOptions.querySelectorAll('option')[fromIndex].selected = 'true';
});

function toggleDarkMode() {
    //the toggle method add the css class dark-mode if not applied else remove it
    const isDark = document.body.classList.toggle('dark-mode');//return a boolean (true) if class dark-mode added otherwise (false)
    localStorage.setItem('mode', isDark ? 'dark' : 'light');//save user prefernce in the localstorage under (mode) name
    document.getElementById('mode-btn').textContent = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';//change the text on the button
  }
  
  //validation on getting the button id & stores it in modeBtn 
  //on page loades checkes if user previously selected dark mode
  window.addEventListener('DOMContentLoaded', function() {
    const modeBtn = document.getElementById('mode-btn');
    if (!modeBtn) {
      console.error('Button with id "mode-btn" not found!');
      return;
    }
    
    if (localStorage.getItem('mode') === 'dark') {
      document.body.classList.add('dark-mode');
      modeBtn.textContent = 'Switch to Light Mode';
    } else {
      modeBtn.textContent = 'Switch to Dark Mode';
    }
    
    modeBtn.addEventListener('click', toggleDarkMode);
  });