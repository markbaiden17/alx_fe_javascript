let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Work" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Value" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", category: "Action" },
    { text: "Don't count the days, make the days count.", category: "Motivation" }
];

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');


/**
 * @function showRandomQuote
 * Generate and display a random quote within the container.
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
}


/**
 * @function addQuote
 * Handle user input to add a new quote.
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

    // Clear the input fields
    newQuoteInput.value = '';
    newCategoryInput.value = '';
    
    // User Feedback
    quoteDisplay.innerHTML = `
        <p id="quoteText" style="font-size: 1.1em;">"${newQuote.text}"</p>
        <span id="quoteCategory" style="color: #28a745;">— Category: ${newQuote.category} (Successfully Added!)</span>
    `;

    console.log(`Quote added: "${newQuote.text}". Total quotes now: ${quotes.length}`);
}


// Initialization and Event Listeners
newQuoteButton.addEventListener('click', showRandomQuote);

if (quotes.length > 0) {
    showRandomQuote();
}