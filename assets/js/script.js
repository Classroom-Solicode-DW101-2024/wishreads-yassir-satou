document.addEventListener('DOMContentLoaded', () => {
    // Select all book cards
    const bookCards = document.querySelectorAll('.book');

    // Add click event listener to each book card
    bookCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Prevent the default anchor behavior if needed
            // e.preventDefault();

            // Get the book title from the card
            const bookTitle = card.querySelector('h5').textContent;
            
            // Navigate to details page with book title
            window.location.href = `details.html?bookTitle=${encodeURIComponent(bookTitle)}`;
        });
    });
});