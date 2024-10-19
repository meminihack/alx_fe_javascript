<body>

    <div id="quoteDisplay">Your quote will appear here</div>

    <!-- Button to show a new random quote -->
    <button id="showNewQuoteButton">Show New Quote</button>

    <!-- Section for the form to add a new quote -->
    <div id="formSection"></div>

    <ul id="quoteList"></ul>
    <button id="exportQuotesButton">Export Quotes</button>
    <input type="file" id="importFile" accept=".json" />

    <script>
        let quotesArray = [];
               function loadQuotes() {
            const storedQuotes = localStorage.getItem('quotesArray');
            if (storedQuotes) {
                quotesArray = JSON.parse(storedQuotes);
                updateQuoteList();
            }
        }
function saveQuotes() {
            localStorage.setItem('quotesArray', JSON.stringify(quotesArray));
        }
function showRandomQuote() {
            if (quotesArray.length === 0) {
                alert('No quotes available');
                return;
            }

            const randomIndex = Math.floor(Math.random() * quotesArray.length);
            const randomQuote = quotesArray[randomIndex];
            document.getElementById('quoteDisplay').innerHTML = `"${randomQuote.text}" - <em>${randomQuote.category}</em>`;
        }
function addQuote() {
            const newQuoteText = document.getElementById('newQuoteText').value;
            const newQuoteCategory = document.getElementById('newQuoteCategory').value;

            if (newQuoteText && newQuoteCategory) {
                quotesArray.push({ text: newQuoteText, category: newQuoteCategory });
                saveQuotes();
                updateQuoteList();
                 document.getElementById('newQuoteText').value = '';
                document.getElementById('newQuoteCategory').value = '';
            } else {
                alert('Please enter both text and category');
            }
        }
 function updateQuoteList() {
            const quoteList = document.getElementById('quoteList');
            quoteList.innerHTML = ''; 

            quotesArray.forEach(quote => {
                const quoteItem = document.createElement('li');
                quoteItem.innerHTML = `"${quote.text}" - <em>${quote.category}</em>`;
                quoteList.appendChild(quoteItem);
            });
        }
function exportToJsonFile() {
            const jsonData = JSON.stringify(quotesArray);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = 'quotes.json';
            downloadLink.click();

            URL.revokeObjectURL(url);
        }
function importFromJsonFile(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const importedQuotes = JSON.parse(e.target.result);
                        quotesArray.push(...importedQuotes);
                        saveQuotes();
                        updateQuoteList();
                        alert('Quotes imported successfully!');
                    } catch (error) {
                        alert('Invalid JSON file');
                    }
                };
                reader.readAsText(file);
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

        \
            const addButton = document.createElement('button');
            addButton.textContent = 'Add Quote';
            addButton.onclick = addQuote;

            formDiv.appendChild(quoteInput);
            formDiv.appendChild(categoryInput);
            formDiv.appendChild(addButton);

   
            document.getElementById('formSection').appendChild(formDiv);
        }

    
        document.addEventListener('DOMContentLoaded', function() {
            createAddQuoteForm();
            loadQuotes();

            document.getElementById('showNewQuoteButton').addEventListener('click', showRandomQuote);
            document.getElementById('exportQuotesButton').addEventListener('click', exportToJsonFile);
            document.getElementById('importFile').addEventListener('change', importFromJsonFile);
        });

 

       
