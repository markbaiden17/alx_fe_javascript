let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Work" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Value" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" }
];

// Get the main container elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const addQuoteContainer = document.getElementById('addQuoteSection');
const exportButton = document.getElementById('exportQuotes');


/**
 * Saves the current quotes array to Local Storage.
 */
function saveQuotes() {
    // Local Storage persists data across browser sessions.
    localStorage.setItem('quotesData', JSON.stringify(quotes));
    
}

/**
 * Loads quotes from Local Storage on application initialization.
 * If no data exists, initializes with the default array and saves it.
 */
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotesData');
    if (storedQuotes) {
        // Parse the JSON string back into a JavaScript object array
        quotes = JSON.parse(storedQuotes);
    } else {
        // If nothing is stored, initialize storage with the default array
        saveQuotes(); 
    }
}

/**
 * Saves the last viewed quote index to Session Storage.
 */
function saveLastViewedQuoteIndex(index) {
    // Session Storage only persists data for the duration of the current browser tab.
    sessionStorage.setItem('lastQuoteIndex', index);
}

// --- Core Application Functions ---

/**
 * @function showRandomQuote
 * Displays a random quote and saves the index to session storage.
 */
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = '<p>No quotes available. Add a new one below!</p>';
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    // Clear and build new DOM elements
    quoteDisplay.innerHTML = '';
    
    const quoteTextElement = document.createElement('p');
    quoteTextElement.id = 'quoteText';
    quoteTextElement.textContent = `"${quote.text}"`;

    const quoteCategoryElement = document.createElement('span');
    quoteCategoryElement.id = 'quoteCategory';
    quoteCategoryElement.textContent = `— Category: ${quote.category}`;
    
    quoteDisplay.appendChild(quoteTextElement);
    quoteDisplay.appendChild(quoteCategoryElement);
    
    // Session Storage Update (Optional Step 1)
    saveLastViewedQuoteIndex(randomIndex);
}

/**
 * @function addQuote
 * Handles user input to add a new quote to the array, updates the DOM, and saves to Local Storage.
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

    // Save updated array to Local Storage
    saveQuotes();

    // Clear the input fields
    newQuoteInput.value = '';
    newCategoryInput.value = '';
    
    // User Feedback
    quoteDisplay.innerHTML = `
        <p id="quoteText" style="font-size: 1.1em;">"${newQuote.text}"</p>
        <span id="quoteCategory" style="color: #28a745;">— Category: ${newQuote.category} (Successfully Added & Saved!)</span>
    `;

    console.log(`Quote added and saved. Total quotes: ${quotes.length}`);
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
 * Uses Blob and URL.createObjectURL.
 */
function exportQuotes() {
    // 1. Convert the JavaScript object array to a JSON string
    const dataStr = JSON.stringify(quotes, null, 2);

    // 2. Create a Blob object with the JSON data
    const blob = new Blob([dataStr], { type: 'application/json' });
    

    // 3. Create a temporary URL for the Blob
    const url = URL.createObjectURL(blob);

    // 4. Create an invisible download link element
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes_export.json';
    
    // 5. Simulate a click on the link to trigger the download
    document.body.appendChild(a);
    a.click();
    
    // 6. Clean up the temporary URL and element
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`Successfully exported ${quotes.length} quotes!`);
}


/**
 * @function importFromJsonFile
 * Reads an uploaded JSON file, parses it, and updates the quotes array.
 */
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    
    fileReader.onload = function(event) {
      try {
          // Parse the JSON data from the file content
          const importedQuotes = JSON.parse(event.target.result);
          
          // Basic validation
          if (!Array.isArray(importedQuotes)) {
              throw new Error("Invalid JSON structure: Expected an array of quotes.");
          }

          // Use spread syntax to efficiently add imported quotes to the existing array
          quotes.push(...importedQuotes);
          
          // Save the combined quotes array to local storage
          saveQuotes();
          
          alert(`Successfully imported ${importedQuotes.length} new quotes!`);
          showRandomQuote();
          
      } catch (e) {
          alert('Error importing file: ' + e.message);
      }
    };
    
    // Start reading the file as text
    fileReader.readAsText(event.target.files[0]);
}


// --- Initialization and Event Listeners ---

// 1. Load data from Local Storage first
loadQuotes();

// 2. Attach Event Listeners
newQuoteButton.addEventListener('click', showRandomQuote);
exportButton.addEventListener('click', exportQuotes);

// 3. Build the dynamic form
createAddQuoteForm();

// 4. Initial Display: Show a random quote from the loaded data
if (quotes.length > 0) {
    // Check if the last viewed quote index is in session storage
    const lastIndex = sessionStorage.getItem('lastQuoteIndex');
    if (lastIndex && quotes[parseInt(lastIndex)]) {
        // If a valid index is found, display that quote
        const lastQuote = quotes[parseInt(lastIndex)];
        quoteDisplay.innerHTML = `
            <p id="quoteText" style="font-size: 1.2em;">"${lastQuote.text}"</p>
            <span id="quoteCategory">— Category: ${lastQuote.category} (Last viewed quote)</span>
        `;
        saveLastViewedQuoteIndex(parseInt(lastIndex));
    } else {
        showRandomQuote();
    }
}