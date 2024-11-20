document.addEventListener('DOMContentLoaded', () => {
    // Book navigation functionality
    const bookCards = document.querySelectorAll('.book, .world_book');

    // Load existing wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    // Book card click navigation
    bookCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Prevent navigation if clicking on wishlist button
            if (e.target.id === 'towishlist' || e.target.closest('#towishlist')) return;
            
            const bookTitle = card.querySelector('h5').textContent;
            window.location.href = `details.html?bookTitle=${encodeURIComponent(bookTitle)}`;
        });
    });

    // Add to wishlist functionality
    bookCards.forEach(bookCard => {
        const wishlistButton = bookCard.querySelector('#towishlist');
        
        if (wishlistButton) {
            const bookTitle = bookCard.querySelector('h5').textContent;
            const bookAuthor = bookCard.querySelector('p').textContent;
            const bookImage = bookCard.querySelector('img').src;
            
            // Check if book is already in wishlist
            const isBookInWishlist = wishlist.some(book => book.title === bookTitle);

            // Update button state based on wishlist status
            if (isBookInWishlist) {
                wishlistButton.textContent = '✓';
                wishlistButton.disabled = true;
                wishlistButton.style.backgroundColor = 'green';
            }

            // Add click event listener
            wishlistButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent triggering book details page

                // Find PDF link specifically for this book
                const bookPdfLink = bookCard.querySelector('.pdf-button')?.getAttribute('href');

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
                    
                    // Update button state
                    wishlistButton.textContent = '✓';
                    wishlistButton.disabled = true;
                    wishlistButton.style.backgroundColor = 'green';

                    alert(`${bookTitle} added to wishlist!`);
                } else {
                    alert(`${bookTitle} is already in your wishlist!`);
                }
            });
        }
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
        
        // Get all book titles from both .book and .world_book classes
        const bookTitles = Array.from(document.querySelectorAll('.book h5, .world_book h5'))
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

    // Prevent duplicate wishlist entries on page load
    function preventDuplicateWishlistEntries() {
        const wishlistTitles = new Set(wishlist.map(book => book.title));
        const bookTitles = Array.from(document.querySelectorAll('.book h5, .world_book h5'))
            .map(el => el.textContent);

        bookTitles.forEach(title => {
            if (wishlistTitles.has(title)) {
                const bookCard = Array.from(bookCards).find(card => 
                    card.querySelector('h5').textContent === title
                );
                
                if (bookCard) {
                    const wishlistButton = bookCard.querySelector('#towishlist');
                    if (wishlistButton) {
                        wishlistButton.textContent = '✓';
                        wishlistButton.disabled = true;
                        wishlistButton.style.backgroundColor = 'green';
                    }
                }
            }
        });
    }

    // Call the function to prevent duplicate entries
    preventDuplicateWishlistEntries();
});