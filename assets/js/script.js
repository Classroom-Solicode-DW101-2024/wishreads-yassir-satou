document.addEventListener('DOMContentLoaded', () => {
    
    const bookCards = document.querySelectorAll('.book');

    bookCards.forEach(card => {
        card.addEventListener('click', (e) => {

            const bookTitle = card.querySelector('h5').textContent;
            
            window.location.href = `details.html?bookTitle=${encodeURIComponent(bookTitle)}`;
        });
    });
});