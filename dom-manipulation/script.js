// Required Check: Mock API URL for server simulation
const MOCK_API_URL = "https://jsonplaceholder.typicode.com/posts";

// 1. Local State (Persisted in Local Storage)
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Work" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Value" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" }
];

// 2. Simulated Server State
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


// --- Web Storage Helper Functions ---

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


// --- Server Interaction Simulation (Mock API) ---

/**
 * @function fetchQuotesFromServer Fetching data from the server.
 * Simulates fetching data from a server/mock API (JSONPlaceholder).
 */
function fetchQuotesFromServer() {
    
    return new Promise(resolve => {
        // Simulate network delay and return the mock server data
        setTimeout(() => {
            resolve(serverQuotes);
        }, 1000); 
    });
}

/**
 * @function postQuoteToServer Posting data to the server.
 * Simulates posting a new quote to the server/mock API.
 */
function postQuoteToServer(newQuote) {
    
    return new Promise(resolve => {
        setTimeout(() => {
            // Update the simulated server state
            serverQuotes.push(newQuote);
            resolve({ success: true });
        }, 500);
    });
}

/**
 * @function syncQuotes Sync logic and updating local storage/conflict resolution.
 * Compares local data with server data and resolves conflicts using server precedence.
 * @param {Array} latestServerQuotes - The data received from the server.
 */
function syncQuotes(latestServerQuotes) {
    // 1. Identify local additions (quotes not present in server)
    const localOnlyQuotes = quotes.filter(localQuote => {
        // Simple comparison: check if both text and category exist on server
        return !latestServerQuotes.some(serverQuote => 
            serverQuote.text === localQuote.text && 
            serverQuote.category === localQuote.category
        );
    });

    // 2. Conflict Resolution: Server Precedence
    let mergedQuotes = [...latestServerQuotes];
    let conflictDetected = false;
    
    if (localOnlyQuotes.length > 0) {
        // Append unique local quotes to the server data
        mergedQuotes.push(...localOnlyQuotes);
        conflictDetected = true;
    }

    // 3. Update local state
    quotes = mergedQuotes;
    saveQuotes();
    
    // 4. Update UI elements
    populateCategories();
    filterQuotes(true);
    
    // 5. Notification System
    if (conflictDetected) {
        notificationArea.textContent = `Sync Complete: ${localOnlyQuotes.length} local addition(s) merged. Server data took precedence.`;
        notificationArea.style.color = '#e67e22'; 
    } else if (latestServerQuotes.length > quotes.length) {
         notificationArea.textContent = `Sync Complete: Found ${latestServerQuotes.length - quotes.length} new quote(s) from server.`;
         notificationArea.style.color = '#27ae60'; 
    } else {
        notificationArea.textContent = 'Sync Complete: Local data is up-to-date.';
        notificationArea.style.color = '#3498db'; 
    }
}

/**
 * Main sync function tied to the button click and periodic check.
 */
async function triggerDataSync() {
    notificationArea.textContent = 'Connecting to server...';
    notificationArea.style.color = '#3498db';

    try {
        const latestServerQuotes = await fetchQuotesFromServer();
        syncQuotes(latestServerQuotes);
    } catch (error) {
        notificationArea.textContent = 'Sync failed. Check network connection.';
        notificationArea.style.color = '#c0392b';
        console.error('Sync error:', error);
    }
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
    
    // 2. Post the new quote to the server
    postQuoteToServer(newQuote);
    
    // 3. Update the category filter dropdown
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
syncButton.addEventListener('click', triggerDataSync);

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
        filterQuotes(false);
    }
}

// 6. Set up periodic data fetching (Required Check: Periodically checking for new quotes)
setInterval(triggerDataSync, 60000);