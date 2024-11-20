document.addEventListener('DOMContentLoaded', () => {
    const wishlistContainer = document.querySelector('.books');

    // Load wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    // Function to render wishlist
    function renderWishlist() {
        wishlistContainer.innerHTML = ''; // Clear existing content

        if (wishlist.length === 0) {
            wishlistContainer.innerHTML = `
                <div class="no-wishlist">
                    <p>Your wishlist is empty. Add some books!</p>
                </div>
            `;
            return;
        }

        wishlist.forEach((book, index) => {
            const bookElement = document.createElement('div');
            bookElement.classList.add('book');
            bookElement.innerHTML = `
                <div class="image_container">
                    <img src="${book.image}" alt="${book.title}"/>
                    <button class="remove-from-wishlist" data-index="${index}">✖</button>
                </div>
                <h5>${book.title}</h5>
                <p>${book.author}</p>
                <a href="${book.pdfLink}" target="_blank">
                    <button class="pdf-button">PDF</button>
                </a>
            `;
            wishlistContainer.appendChild(bookElement);
        });

        // Add event listeners for remove buttons
        const removeButtons = document.querySelectorAll('.remove-from-wishlist');
        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const index = button.getAttribute('data-index');
                wishlist.splice(index, 1);
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
                renderWishlist();
            });
        });
    }

    // Initial render
    renderWishlist();
});