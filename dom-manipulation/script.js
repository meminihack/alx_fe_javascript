<body>
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
            const selectedCategory = document.getElementById('categoryFilter').value;
            const filteredQuotes = selectedCategory === 'all' ? quotesArray : quotesArray.filter(quote => quote.category === selectedCategory);

            if (filteredQuotes.length === 0) {
                alert('No quotes available in this category');
                return;
            }

            const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
            const randomQuote = filteredQuotes[randomIndex];
            document.getElementById('quoteDisplay').innerHTML = `"${randomQuote.text}" - <em>${randomQuote.category}</em>`;
        }
        function addQuote() {
            const newQuoteText = document.getElementById('newQuoteText').value;
            const newQuoteCategory = document.getElementById('newQuoteCategory').value;

            if (newQuoteText && newQuoteCategory) {
                quotesArray.push({ text: newQuoteText, category: newQuoteCategory });
                saveQuotes();
                updateQuoteList();
                populateCategories(); 
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

      
        function populateCategories() {
            const categoryFilter = document.getElementById('categoryFilter');
            const uniqueCategories = [...new Set(quotesArray.map(quote => quote.category))];
          
            categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
            uniqueCategories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            });
            const lastSelectedCategory = localStorage.getItem('selectedCategory');
            if (lastSelectedCategory) {
                categoryFilter.value = lastSelectedCategory;
            }
        }

        function filterQuote() {
            const selectedCategory = document.getElementById('categoryFilter').value;
            if (selectedCategory !== 'all') {
                const filteredQuotes = quotesArray.filter(quote => quote.category === selectedCategory);
                updateQuoteList(filteredQuotes);
            } else {
                updateQuoteList(quotesArray);
            }

            localStorage.setItem('selectedCategory', selectedCategory);
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
                        populateCategories();
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
            populateCategories();

            document.getElementById('showNewQuoteButton').addEventListener('click', showRandomQuote);
            document.getElementById('exportQuotesButton').addEventListener('click', exportToJsonFile); // Ensure the button is hooked to the function
            document.getElementById('importFile').addEventListener('change', importFromJsonFile); // File input event listener
            document.getElementById('categoryFilter').addEventListener('change', filterQuote); // Filter event listener
        });
    

           

 

       
