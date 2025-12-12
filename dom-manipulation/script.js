let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Work" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Value" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" }
];

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const addQuoteContainer = document.getElementById('addQuoteSection');
const exportButton = document.getElementById('exportQuotes');
const categoryFilter = document.getElementById('categoryFilter');


// --- Helper Functions for Web Storage ---

/**
 * Saves the current quotes array to Local Storage.
 */
function saveQuotes() {
    localStorage.setItem('quotesData', JSON.stringify(quotes));
}

/**
 * Loads quotes from Local Storage on application initialization.
 */
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotesData');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    } else {
        saveQuotes(); 
    }
}

/**
 * Saves the last viewed quote index to Session Storage.
 */
function saveLastViewedQuoteIndex(index) {
    sessionStorage.setItem('lastQuoteIndex', index);
}

/**
 * Saves the last selected filter category to Local Storage.
 */
function saveFilterPreference(category) {
    localStorage.setItem('lastCategoryFilter', category);
}


// --- Category Management and Filtering ---

/**
 * @function populateCategories
 * Extracts unique categories and dynamically populates the filter dropdown.
 */
function populateCategories() {
    // 1. Extract unique categories using a Set
    const uniqueCategories = new Set(quotes.map(quote => quote.category));

    // 2. Clear existing options (except "All Categories")
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    // 3. Dynamically create and append new options
    uniqueCategories.forEach(category => {
        if (category && category.trim() !== '') {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        }
    });

    // 4. Restore the last selected filter preference (Step 2)
    const lastFilter = localStorage.getItem('lastCategoryFilter');
    if (lastFilter) {
        categoryFilter.value = lastFilter;
    }
    
    // Ensure the initial display reflects the restored filter
    filterQuotes(false); // Do not save preference on load
}

/**
 * @function filterQuotes
 * Filters the displayed quotes based on the selected category.
 * @param {boolean} shouldSave - Whether to save the preference to localStorage.
 */
function filterQuotes(shouldSave = true) {
    const selectedCategory = categoryFilter.value;

    // 1. Filter the quotes array
    const filteredQuotes = selectedCategory === 'all'
        ? quotes
        : quotes.filter(quote => quote.category === selectedCategory);

    // 2. Update the display with the filtered results
    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = `<p>No quotes found for category: <strong>${selectedCategory}</strong></p>`;
    } else {
        // Find a random quote from the filtered list to display
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

    // 3. Save the filter preference to Local Storage
    if (shouldSave) {
        saveFilterPreference(selectedCategory);
    }
}


// --- Core Application Functions ---

/**
 * @function showRandomQuote
 * Displays a random quote from the *entire* list (not filtered) and saves the index.
 */
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

/**
 * @function addQuote
 * Adds a new quote, updates storage, and updates the category dropdown.
 */
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
    
    // Apply the current filter to see if the new quote should be shown
    filterQuotes(true); 
}


/**
 * @function createAddQuoteForm
 * Dynamically creates the form elements.
 */
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

/**
 * @function exportQuotes
 * Exports the current quotes array to a downloadable JSON file.
 */
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


/**
 * @function importFromJsonFile
 * Reads an uploaded JSON file, parses it, updates quotes, and updates categories.
 */
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
          populateCategories(); // Update categories after import

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