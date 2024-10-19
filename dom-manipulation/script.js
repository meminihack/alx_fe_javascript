<body>
   <div id="quoteDisplay">Your quote will appear here</div>

    <!-- Dropdown to filter quotes by category -->
    <select id="categoryFilter">
        <option value="all">All Categories</option>
    </select>

    <!-- Button to show a new random quote -->
    <button id="showNewQuoteButton">Show New Quote</button>

    <!-- Button to fetch quotes from server -->
    <button id="syncButton">Sync Quotes with Server</button> <!-- Sync with server button -->

    <!-- Section for the form to add a new quote -->
    <div id="formSection"></div>

    <!-- List of quotes -->
    <ul id="quoteList"></ul>

    <!-- Notification section for updates -->
    <div id="notificationBar" style="display: none; background-color: yellow;">New data has been synced from the server!</div>

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
                const newQuote = { text: newQuoteText, category: newQuoteCategory };
                quotesArray.push(newQuote);
                saveQuotes();
                updateQuoteList();
                postQuoteToServer(newQuote); 
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

        
        async function postQuoteToServer(newQuote) {
            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                    method: 'POST',
                    body: JSON.stringify(newQuote),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                });
                const data = await response.json();
                console.log('Posted new quote to server:', data);
            } catch (error) {
                console.error('Error posting quote:', error);
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
            document.getElementById('syncButton').addEventListener('click', fetchQuotesFromServer); r
            document.getElementById('categoryFilter').addEventListener('change', filterQuote); 
            syncQuotes(); 
        });
