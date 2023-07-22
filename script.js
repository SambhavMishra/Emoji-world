const emojiContainer = document.getElementById('emoji-container');
const categoryFilter = document.getElementById('category-filter');
const cardsPerPageSelect = document.getElementById('cards-per-page');
const paginationElement = document.getElementById('pagination');

const apiUrl = 'https://emojihub.yurace.pro/api/all';


let emojis = [];
let cardsPerPage = parseInt(cardsPerPageSelect.value, 10);
let currentPage = 1;

async function fetchEmojis() {
    try {
        const response = await fetch(apiUrl);
        const emojis = await response.json();
        return emojis;
    } catch (error) {
        console.error('Error fetching emojis:', error);
        return [];
    }
}

function createEmojiCard(emoji) {
    const card = document.createElement('div');
    card.className = 'emoji-card';
    card.innerHTML = `
        <span>${emoji.htmlCode}</span>
        <p>Name: ${emoji.name}</p>
        <p>Category: ${emoji.category}</p>
        <p>Group: ${emoji.group}</p>
    `;
    emojiContainer.appendChild(card);
}

function clearEmojiContainer() {
    emojiContainer.innerHTML = '';
}


function filterEmojisByCategory(category) {
    const filteredEmojis = emojis.filter(emoji => emoji.category === category);
    currentPage = 1;
    updatePagination(filteredEmojis.length);
    showEmojisForCurrentPage(filteredEmojis);
}



function updatePagination(totalEmojis) {
    const pageCount = Math.ceil(totalEmojis / cardsPerPage);
    paginationElement.innerHTML = '';
    for (let i = 1; i <= pageCount; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            showEmojisForCurrentPage(emojis);
        });
        paginationElement.appendChild(pageButton);
    }
}



function showEmojisForCurrentPage(emojisToDisplay) {
    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    const emojisOnPage = emojisToDisplay.slice(startIndex, endIndex);
    clearEmojiContainer();
    emojisOnPage.forEach(createEmojiCard);
}


function showLoadingMessage() {
    emojiContainer.innerHTML = '<p>Loading emojis...</p>';
}



async function initialize() {
    showLoadingMessage();
    emojis = await fetchEmojis();
    categories = [...new Set(emojis.map(emoji => emoji.category))];
    categories.unshift('All');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.innerText = category;
        categoryFilter.appendChild(option);
    });

    categoryFilter.addEventListener('change', () => {
        const selectedCategory = categoryFilter.value;
        if (selectedCategory === 'All') {
            updatePagination(emojis.length);
            showEmojisForCurrentPage(emojis);
        } else {
            const filteredEmojis = emojis.filter(emoji => emoji.category === selectedCategory);
            updatePagination(filteredEmojis.length);
            showEmojisForCurrentPage(filteredEmojis);
        }
    });

    cardsPerPageSelect.addEventListener('change', () => {
        cardsPerPage = parseInt(cardsPerPageSelect.value, 10);
        currentPage = 1;
        if (categoryFilter.value === 'All') {
            updatePagination(emojis.length);
            showEmojisForCurrentPage(emojis);
        } else {
            const filteredEmojis = emojis.filter(emoji => emoji.category === categoryFilter.value);
            updatePagination(filteredEmojis.length);
            showEmojisForCurrentPage(filteredEmojis);
        }
    });

    updatePagination(emojis.length);
    showEmojisForCurrentPage(emojis);
}

initialize();



const searchInput = document.getElementById('search-bar');

function filterEmojisByName(searchText) {
    const filteredEmojis = emojis.filter(emoji => emoji.name.toLowerCase().includes(searchText.toLowerCase()));
    currentPage = 1;
    updatePagination(filteredEmojis.length);
    showEmojisForCurrentPage(filteredEmojis);
}

searchInput.addEventListener('input', () => {
    const searchText = searchInput.value;
    if (searchText.trim() === '') {
        if (categoryFilter.value === 'All') {
            updatePagination(emojis.length);
            showEmojisForCurrentPage(emojis);
        } else {
            const filteredEmojis = emojis.filter(emoji => emoji.category === categoryFilter.value);
            updatePagination(filteredEmojis.length);
            showEmojisForCurrentPage(filteredEmojis);
        }
    } else {
        filterEmojisByName(searchText);
    }
});