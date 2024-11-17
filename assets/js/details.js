document.addEventListener('DOMContentLoaded', () => {
    // Get the book title from URL
    const urlParams = new URLSearchParams(window.location.search);
    const bookTitle = urlParams.get('bookTitle');

    // Fetch book data
    fetch('/assets/books data/books.json')
        .then(response => response.json())
        .then(data => {
            const book = data.book_array.find(b => b.book_title === bookTitle);
            
            if (book) {
                // Update page elements with book details
                document.querySelector('.title').textContent = book.book_title;
                document.querySelector('.poster img').src = book.image;
                document.querySelector('.description').textContent = book.content;
                // Add more details as needed
            }
        })
        .catch(error => console.error('Error fetching book details:', error));
});