document.addEventListener('DOMContentLoaded', () => {
    
    const bookCards = document.querySelectorAll('.book');

    bookCards.forEach(card => {
        card.addEventListener('click', (e) => {

            const bookTitle = card.querySelector('h5').textContent;
            
            window.location.href = `details.html?bookTitle=${encodeURIComponent(bookTitle)}`;
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const bookCards = document.querySelectorAll('.book');
    const wishlistButtons = document.querySelectorAll('#towishlist');

    // Load existing wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

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

    // Book details page click navigation
    bookCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const bookTitle = card.querySelector('h5').textContent;
            window.location.href = `details.html?bookTitle=${encodeURIComponent(bookTitle)}`;
        });
    });
});
