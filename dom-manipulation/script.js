let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Work" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Value" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" }
];

// 2. Simulated Server State (Used to check for updates/conflicts)
let serverQuotes = [
    { text: "The only way to do great work is to love what you do.", category: "Work" },
    { text: "Simulated Server Quote: Keep pushing your limits.", category: "Motivation" },
    { text: "Always code as if the guy who ends up maintaining your code will be a violent psychopath.", category: "Coding" } 
];

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const addQuoteContainer = document.getElementById('addQuoteSection');
const exportButton = document.getElementById('exportQuotes');
const categoryFilter = document.getElementById('categoryFilter');
const syncButton = document.getElementById('syncButton');
const notificationArea = document.getElementById('notificationArea');


// --- Helper Functions for Web Storage ---

function saveQuotes() {
    localStorage.setItem('quotesData', JSON.stringify(quotes));
}

function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotesData');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    } else {
        saveQuotes(); 
    }
}

function saveLastViewedQuoteIndex(index) {
    sessionStorage.setItem('lastQuoteIndex', index);
}

function saveFilterPreference(category) {
    localStorage.setItem('lastCategoryFilter', category);
}


// --- Conflict Resolution and Sync ---

/**
 * @function syncData
 * Simulates fetching data from the server and updating the local store.
 */
function syncData() {
    notificationArea.textContent = 'Connecting to server...';
    
    // Simulate latency and data fetching
    setTimeout(() => {
        // --- Step 2: Conflict Resolution Logic ---
        
        // 1. Check for local additions (quotes not present in serverQuotes)
        const localOnlyQuotes = quotes.filter(localQuote => {
            // Check if the quote text and category match any server quote
            return !serverQuotes.some(serverQuote => 
                serverQuote.text === localQuote.text && 
                serverQuote.category === localQuote.category
            );
        });
        
        // 2. Simulate Server Precedence
        let mergedQuotes = [...serverQuotes];
        let conflictDetected = false;        
        if (localOnlyQuotes.length > 0) {
            // Append local unique quotes to the server data structure
            mergedQuotes.push(...localOnlyQuotes);
            conflictDetected = true;
        }

        // 3. Update local state with the merged, server-preferred data
        quotes = mergedQuotes;
        saveQuotes();
        
        populateCategories();
        filterQuotes(true);
        
        // --- Step 3: Notification System ---
        if (conflictDetected) {
            notificationArea.textContent = `Sync Complete: ${localOnlyQuotes.length} local additions were merged. Server data took precedence.`;
            notificationArea.style.color = '#e67e22';
        } else if (serverQuotes.length > quotes.length) {
             notificationArea.textContent = `Sync Complete: Found ${serverQuotes.length - quotes.length} new quotes from server.`;
             notificationArea.style.color = '#27ae60';
        }
        else {
            notificationArea.textContent = 'Sync Complete: Local data is up-to-date.';
            notificationArea.style.color = '#3498db';
        }
    }, 1500); // Simulate network delay
}


// --- Category Management and Filtering ---

function populateCategories() {
    const uniqueCategories = new Set(quotes.map(quote => quote.category));
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    uniqueCategories.forEach(category => {
        if (category && category.trim() !== '') {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        }
    });

    const lastFilter = localStorage.getItem('lastCategoryFilter');
    if (lastFilter) {
        categoryFilter.value = lastFilter;
    }
    
    filterQuotes(false);
}

function filterQuotes(shouldSave = true) {
    const selectedCategory = categoryFilter.value;

    const filteredQuotes = selectedCategory === 'all'
        ? quotes
        : quotes.filter(quote => quote.category === selectedCategory);

    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = `<p>No quotes found for category: <strong>${selectedCategory}</strong></p>`;
    } else {
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const quote = filteredQuotes[randomIndex];
        
        quoteDisplay.innerHTML = '';
        
        const quoteTextElement = document.createElement('p');
        quoteTextElement.id = 'quoteText';
        quoteTextElement.textContent = `"${quote.text}"`;

        const quoteCategoryElement = document.createElement('span');
        quoteCategoryElement.id = 'quoteCategory';
        quoteCategoryElement.textContent = `— Category: ${quote.category}`;
        
        quoteDisplay.appendChild(quoteTextElement);
        quoteDisplay.appendChild(quoteCategoryElement);
    }

    if (shouldSave) {
        saveFilterPreference(selectedCategory);
    }
}


// --- Core Application Functions ---

function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = '<p>No quotes available. Add a new one below!</p>';
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    quoteDisplay.innerHTML = '';
    
    const quoteTextElement = document.createElement('p');
    quoteTextElement.id = 'quoteText';
    quoteTextElement.textContent = `"${quote.text}"`;

    const quoteCategoryElement = document.createElement('span');
    quoteCategoryElement.id = 'quoteCategory';
    quoteCategoryElement.textContent = `— Category: ${quote.category}`;
    
    quoteDisplay.appendChild(quoteTextElement);
    quoteDisplay.appendChild(quoteCategoryElement);
    
    saveLastViewedQuoteIndex(randomIndex);
}

function addQuote() {
    const newQuoteInput = document.getElementById('newQuoteText');
    const newCategoryInput = document.getElementById('newQuoteCategory');

    const quoteText = newQuoteInput.value.trim();
    const quoteCategory = newCategoryInput.value.trim();

    if (quoteText === "" || quoteCategory === "") {
        alert("Please enter both the quote text and a category before adding.");
        return;
    }

    const newQuote = {
        text: quoteText,
        category: quoteCategory
    };
    quotes.push(newQuote);

    // 1. Save updated array to Local Storage
    saveQuotes();
    
    // 2. Update the category filter dropdown immediately
    populateCategories();

    // Clear the input fields
    newQuoteInput.value = '';
    newCategoryInput.value = '';
    
    // User Feedback
    quoteDisplay.innerHTML = `
        <p id="quoteText" style="font-size: 1.1em;">"${newQuote.text}"</p>
        <span id="quoteCategory" style="color: #28a745;">— Category: ${newQuote.category} (Successfully Added & Saved!)</span>
    `;
    
    filterQuotes(true);    
    serverQuotes.push(newQuote);
}


function createAddQuoteForm() {
    const title = document.createElement('h2');
    title.textContent = 'Add Your Own Quote';
    
    const quoteInput = document.createElement('input');
    quoteInput.setAttribute('type', 'text');
    quoteInput.setAttribute('id', 'newQuoteText');
    quoteInput.setAttribute('placeholder', 'Enter a new quote');

    const categoryInput = document.createElement('input');
    categoryInput.setAttribute('type', 'text');
    categoryInput.setAttribute('id', 'newQuoteCategory');
    categoryInput.setAttribute('placeholder', 'Enter quote category');

    const addButton = document.createElement('button');
    addButton.textContent = 'Add Quote';
    addButton.addEventListener('click', addQuote);
    
    addQuoteContainer.appendChild(title);
    addQuoteContainer.appendChild(quoteInput);
    addQuoteContainer.appendChild(categoryInput);
    addQuoteContainer.appendChild(addButton);
}

// --- JSON Import and Export Functions ---

function exportQuotes() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes_export.json';
    
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`Successfully exported ${quotes.length} quotes!`);
}


function importFromJsonFile(event) {
    const fileReader = new FileReader();
    
    fileReader.onload = function(event) {
      try {
          const importedQuotes = JSON.parse(event.target.result);
          
          if (!Array.isArray(importedQuotes)) {
              throw new Error("Invalid JSON structure: Expected an array of quotes.");
          }

          quotes.push(...importedQuotes);
          
          saveQuotes();
          populateCategories();

          alert(`Successfully imported ${importedQuotes.length} new quotes!`);
          filterQuotes(true);
          
      } catch (e) {
          alert('Error importing file: ' + e.message);
      }
    };
    
    fileReader.readAsText(event.target.files[0]);
}


// --- Initialization and Event Listeners ---

// 1. Load data from Local Storage first
loadQuotes();

// 2. Build the dynamic form
createAddQuoteForm();

// 3. Populate categories dropdown
populateCategories();

// 4. Attach Event Listeners
newQuoteButton.addEventListener('click', showRandomQuote);
exportButton.addEventListener('click', exportQuotes);
syncButton.addEventListener('click', syncData);

// 5. Initial Display: Filter quotes or show last viewed
if (quotes.length > 0) {
    const lastIndex = sessionStorage.getItem('lastQuoteIndex');
    if (lastIndex && quotes[parseInt(lastIndex)]) {
        const lastQuote = quotes[parseInt(lastIndex)];
        quoteDisplay.innerHTML = `
            <p id="quoteText" style="font-size: 1.2em;">"${lastQuote.text}"</p>
            <span id="quoteCategory">— Category: ${lastQuote.category} (Last viewed quote)</span>
        `;
        saveLastViewedQuoteIndex(parseInt(lastIndex));
    } else {
        filterQuotes(false); // Display filtered view on load
    }
}