<body>
let quotesArray = [];
function loadQuotes() {
    const savedQuotes = localStorage.getItem('quotes');
    if (savedQuotes) {
        quotesArray = JSON.parse(savedQuotes);
        updateQuoteList();
    }
}
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotesArray))
}
function showRandomQuote() {
    if (quotesArray.length === 0) return;
    const randomIndex = Math.floor(Math.random() * quotesArray.length);
    const randomQuote = quotesArray[randomIndex];
    document.getElementById('quoteDisplay').textContent = randomQuote.text;
}
function populateCategories() {
    const categorySelect = document.getElementById('categoryFilter');
    const uniqueCategories = [...new Set(quotesArray.map(quote => quote.category))];
    
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}
function filterQuote() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filteredQuotes = selectedCategory === 'all' ? quotesArray : quotesArray.filter(quote => quote.category === selectedCategory);
    displayQuotes(filteredQuotes);
}
function displayQuotes(quotes) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.textContent = quotes.length > 0 ? quotes[0].text : 'No quotes available for this category';
}
async function postQuoteToServer(newQuote) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify(newQuote),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
        });
        const data = await response.json();
        console.log('Posted new quote to server:', data);
    } catch (error) {
        console.error('Error posting quote:', error);
    }
}

async function fetchQuotesFromServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json();
        const serverQuotes = data.map(post => ({ text: post.title, category: post.body }));
        resolveConflicts(serverQuotes);
        saveQuotes();
        updateQuoteList();
        populateCategories();
        displayNotification('New data has been synced from the server!');
    } catch (error) {
        console.error('Error fetching quotes:', error);
    }
}
function resolveConflicts(serverQuotes) {
    const localQuotes = quotesArray;
    const mergedQuotes = [...localQuotes];

    serverQuotes.forEach(serverQuote => {
        if (!localQuotes.some(localQuote => localQuote.text === serverQuote.text)) {
            mergedQuotes.push(serverQuote);
        }
    });

    quotesArray = mergedQuotes;
}


function syncQuotes() {
    setInterval(fetchQuotesFromServer, 60000);
}


function displayNotification(message) {
    const notificationBar = document.getElementById('notificationBar');
    notificationBar.textContent = message;
    notificationBar.style.display = 'block';

    setTimeout(() => {
        notificationBar.style.display = 'none';
    }, 3000);
}


document.addEventListener('DOMContentLoaded', function() {
    loadQuotes();
    populateCategories();

    document.getElementById('showNewQuoteButton').addEventListener('click', showRandomQuote);
    document.getElementById('syncButton').addEventListener('click', fetchQuotesFromServer);


    syncQuotes();
});

      
