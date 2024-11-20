document.addEventListener('DOMContentLoaded', () => {
    // Load wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    const booksContainer = document.querySelector('.books');

    // Function to render wishlist
    function renderWishlist() {
        // Clear existing books
        booksContainer.innerHTML = '';

        // Check if wishlist is empty
        if (wishlist.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.classList.add('empty-wishlist');
            emptyMessage.innerHTML = `
                <h2>Your Wishlist is Empty</h2>
                <p>Explore our collection and add some books!</p>
                <a href="index.html" class="explore-btn">Explore Books</a>
            `;
            booksContainer.appendChild(emptyMessage);
            return;
        }

        // Render books
        wishlist.forEach((book, index) => {
            const bookElement = document.createElement('div');
            bookElement.classList.add('book');
            bookElement.innerHTML = `
                <div class="image_container">
                    <img src="${book.image}" alt="${book.title}" />
                </div>
                <h5>${book.title}</h5>
                <p>${book.author}</p>
                <a href="${book.pdfLink}" target="_blank">
                    <button class="pdf-button">PDF</button>
                </a>
                <button class="remove-btn" data-index="${index}">
                    <i class="fa-solid fa-trash"></i> Remove from Wishlist
                </button>
            `;
            booksContainer.appendChild(bookElement);
        });

        // Add event listeners to remove buttons
        const removeButtons = document.querySelectorAll('.remove-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const index = button.getAttribute('data-index');
                removeFromWishlist(index);
            });
        });
    }

    // Function to remove book from wishlist
    function removeFromWishlist(index) {
        // Remove book at specified index
        const removedBook = wishlist[index];
        wishlist.splice(index, 1);

        // Update localStorage
        localStorage.setItem('wishlist', JSON.stringify(wishlist));

        // Re-render wishlist
        renderWishlist();

        // Optional: Show removal confirmation
        showNotification(`${removedBook.title} removed from wishlist`);
    }

    // Notification function
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Initial render
    renderWishlist();
});

