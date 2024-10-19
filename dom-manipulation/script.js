let quotesArray = [ { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotesArray.length);
    const randomQuote = quotesArray[randomIndex];
    const quoteDisplay = document.getElementById('quoteDisplay');
    if (quoteDisplay) {
        quoteDisplay.innerHTML = `"${randomQuote.text}" - <em>${randomQuote.category}</em>`;
    } else {
        console.error('quoteDisplay element not found');
    }
}
function createAddQuoteForm() {
    const formDiv = document.createElement('div');
    const quoteInput = document.createElement('input');
    quoteInput.id = 'newQuoteText';
    quoteInput.type = 'text';
    quoteInput.placeholder = 'Enter a new quote';
    const categoryInput = document.createElement('input');
    categoryInput.id = 'newQuoteCategory';
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter quote category';
    const addButton = document.createElement('button');
    addButton.textContent = 'Add Quote';
    addButton.onclick = addQuote; 
    formDiv.appendChild(quoteInput);
    formDiv.appendChild(categoryInput);
    formDiv.appendChild(addButton)
    const formSection = document.getElementById('formSection');
    if (formSection) {
        formSection.appendChild(formDiv);
    } else {
        console.error('formSection element not found');
    }
}
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText && newQuoteCategory) {
        quotesArray.push({ text: newQuoteText, category: newQuoteCategory })
        const quoteList = document.getElementById('quoteList');
        if (quoteList) {
            const newQuoteItem = document.createElement('li');
            newQuoteItem.innerHTML = `"${newQuoteText}" - <em>${newQuoteCategory}</em>`;
            quoteList.appendChild(newQuoteItem);
        } else {
            console.error('quoteList element not found');
        }
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
    } else {
        alert('Please enter both quote text and category');
    }
}
function addShowQuoteEventListener() {
    const showQuoteButton = document.getElementById('showNewQuoteButton');
    if (showQuoteButton) {
        showQuoteButton.addEventListener('click', showRandomQuote);
    } else {
        console.error('showNewQuoteButton element not found');
    }
}
document.addEventListener('DOMContentLoaded', function() {
    createAddQuoteForm();
    showRandomQuote();
    addShowQuoteEventListener();
});
