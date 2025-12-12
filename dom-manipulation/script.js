let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Work" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Value" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", category: "Action" },
    { text: "Don't count the days, make the days count.", category: "Motivation" }
];

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const addQuoteContainer = document.getElementById('addQuoteSection');


/**
 * @function showRandomQuote
 * Manages the generation and display of a random quote within the fixed container.
 */
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = '<p>No quotes available. Add a new one below!</p>';
        return;
    }
    
    // Data Selection
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    // DOM Manipulation: Clear the previous content
    quoteDisplay.innerHTML = '';
    
    // DOM Creation: Build the new structure
    const quoteTextElement = document.createElement('p');
    quoteTextElement.id = 'quoteText';
    quoteTextElement.textContent = `"${quote.text}"`;

    const quoteCategoryElement = document.createElement('span');
    quoteCategoryElement.id = 'quoteCategory';
    quoteCategoryElement.textContent = `— Category: ${quote.category}`;
    
    // DOM Insertion
    quoteDisplay.appendChild(quoteTextElement);
    quoteDisplay.appendChild(quoteCategoryElement);
}


/**
 * @function addQuote
 * Handles user input to add a new quote to the array and update the display.
 */
function addQuote() {
    // 1. Get Input Values
    const newQuoteInput = document.getElementById('newQuoteText');
    const newCategoryInput = document.getElementById('newQuoteCategory');

    const quoteText = newQuoteInput.value.trim();
    const quoteCategory = newCategoryInput.value.trim();

    // 2. Input Validation
    if (quoteText === "" || quoteCategory === "") {
        alert("Please enter both the quote text and a category before adding.");
        return;
    }

    // 3. Data Mutation
    const newQuote = {
        text: quoteText,
        category: quoteCategory
    };
    quotes.push(newQuote);

    // 4. DOM Manipulation: Clear the input fields
    newQuoteInput.value = '';
    newCategoryInput.value = '';
    
    // 5. User Feedback (Updating the Display)
    quoteDisplay.innerHTML = `
        <p id="quoteText" style="font-size: 1.1em;">"${newQuote.text}"</p>
        <span id="quoteCategory" style="color: #28a745;">— Category: ${newQuote.category} (Successfully Added!)</span>
    `;

    console.log(`Quote added: "${newQuote.text}". Total quotes now: ${quotes.length}`);
}


/**
 * @function createAddQuoteForm
 * Dynamically creates the form elements and appends them to the dedicated container.
 */
function createAddQuoteForm() {
    // 1. Create Title
    const title = document.createElement('h2');
    title.textContent = 'Add Your Own Quote';
    
    // 2. Create Quote Text Input
    const quoteInput = document.createElement('input');
    quoteInput.setAttribute('type', 'text');
    quoteInput.setAttribute('id', 'newQuoteText');
    quoteInput.setAttribute('placeholder', 'Enter a new quote');

    // 3. Create Category Input
    const categoryInput = document.createElement('input');
    categoryInput.setAttribute('type', 'text');
    categoryInput.setAttribute('id', 'newQuoteCategory');
    categoryInput.setAttribute('placeholder', 'Enter quote category');

    // 4. Create Button
    const addButton = document.createElement('button');
    addButton.textContent = 'Add Quote';
    // Attach the addQuote function as an event listener
    addButton.addEventListener('click', addQuote);
    
    // 5. Append all elements to the container
    addQuoteContainer.appendChild(title);
    addQuoteContainer.appendChild(quoteInput);
    addQuoteContainer.appendChild(categoryInput);
    addQuoteContainer.appendChild(addButton);
}


// --- Initialization and Event Listeners ---

// 1. Event listener check: Attach event listener to the "Show New Quote" button
newQuoteButton.addEventListener('click', showRandomQuote);

// 2. Execute the required function to build the dynamic form when the script runs
createAddQuoteForm();

// 3. Initial Display
if (quotes.length > 0) {
    showRandomQuote();
}