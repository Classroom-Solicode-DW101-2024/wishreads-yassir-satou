document.addEventListener('DOMContentLoaded', () => {
    // Book navigation functionality
    const bookCards = document.querySelectorAll('.book');
    const wishlistButtons = document.querySelectorAll('#towishlist');

    // Load existing wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    // Book card click navigation
    bookCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const bookTitle = card.querySelector('h5').textContent;
            window.location.href = `details.html?bookTitle=${encodeURIComponent(bookTitle)}`;
        });
    });

    // Add to wishlist functionality
    wishlistButtons.forEach((button, index) => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering book details page
            const bookCard = bookCards[index];
            const bookTitle = bookCard.querySelector('h5').textContent;
            const bookAuthor = bookCard.querySelector('p').textContent;
            const bookImage = bookCard.querySelector('img').src;
            const bookPdfLink = bookCard.querySelector('.pdf-button').getAttribute('href');

            // Check if book is already in wishlist
            const isBookInWishlist = wishlist.some(book => book.title === bookTitle);

            if (!isBookInWishlist) {
                const bookToAdd = {
                    title: bookTitle,
                    author: bookAuthor,
                    image: bookImage,
                    pdfLink: bookPdfLink
                };

                wishlist.push(bookToAdd);
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
                alert(`${bookTitle} added to wishlist!`);
            } else {
                alert(`${bookTitle} is already in your wishlist!`);
            }
        });
    });

    // Search functionality
    const searchBox = document.querySelector('.box');
    const searchInput = searchBox.querySelector('.input');
    const searchIcon = searchBox.querySelector('i');

    // Function to normalize search text
    function normalizeText(text) {
        return text.toLowerCase().trim();
    }

    // Function to find matching books
    function findMatchingBooks(searchTerm) {
        const normalizedSearch = normalizeText(searchTerm);
        
        // Get all book titles
        const bookTitles = Array.from(document.querySelectorAll('.book h5'))
            .map(el => el.textContent);

        // Find matches
        const matches = bookTitles.filter(title => 
            normalizeText(title).includes(normalizedSearch)
        );

        return matches;
    }

    // Search input event listener
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const searchTerm = searchInput.value;
            const matchingBooks = findMatchingBooks(searchTerm);

            if (matchingBooks.length === 1) {
                // Direct to details page if exact or unique match
                window.location.href = `details.html?bookTitle=${encodeURIComponent(matchingBooks[0])}`;
            } else if (matchingBooks.length > 1) {
                // Multiple matches - show alert
                alert(`Multiple matches found: ${matchingBooks.join(', ')}. Please be more specific.`);
            } else {
                // No matches
                alert('No books found. Please try another search term.');
            }
        }
    });

    // Optional: Search icon click functionality
    searchIcon.addEventListener('click', () => {
        const searchTerm = searchInput.value;
        const matchingBooks = findMatchingBooks(searchTerm);

        if (matchingBooks.length === 1) {
            window.location.href = `details.html?bookTitle=${encodeURIComponent(matchingBooks[0])}`;
        } else if (matchingBooks.length > 1) {
            alert(`Multiple matches found: ${matchingBooks.join(', ')}. Please be more specific.`);
        } else {
            alert('No books found. Please try another search term.');
        }
    });
});