document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const bookTitle = urlParams.get('title');
  const searchInput = document.querySelector('.input');
  const searchForm = document.querySelector('form[name="search"]');
  const wishlistBtn = document.querySelector('.add-wishlist');

  // Fetch books from the JSON file
  fetch("/assets/js/data.json")
    .then(response => response.json())
    .then(books => {
      // Initial book display or search handling
      if (bookTitle) {
        // If a book title is in the URL, display its details
        const book = findBookByTitle(books, bookTitle);
        displayBookDetails(book);
        checkWishlistStatus(book);
      }

      // Search functionality
      function performSearch(event) {
        event.preventDefault(); // Prevent form submission
        const searchTerm = searchInput.value.trim().toLowerCase();

        // Find matching book
        const matchedBook = books.find(book => 
          book.title.toLowerCase().includes(searchTerm) || 
          book.author.name.toLowerCase().includes(searchTerm)
        );

        if (matchedBook) {
          // Update URL and display book details
          history.pushState(null, '', `/assets/html/details.html?title=${encodeURIComponent(matchedBook.title)}`);
          displayBookDetails(matchedBook);
          checkWishlistStatus(matchedBook);
        } else {
          // Handle no book found
          document.querySelector('.container').innerHTML = `
            <div style="color: white; text-align: center; padding: 20px;">
              No book found matching "${searchTerm}"
            </div>
          `;
        }
      }

      // Add event listeners for search
      searchForm.addEventListener('submit', performSearch);
      searchInput.addEventListener('input', (event) => {
        performSearch({
          preventDefault: () => {},
          target: event.target
        });
      });

      // Wishlist button event listener
      if (wishlistBtn) {
        wishlistBtn.addEventListener('click', () => handleAddToWishlist(findBookByTitle(books, bookTitle)));
      }
    })
    .catch(error => {
      console.error('Error fetching book details:', error);
      document.querySelector('.container').innerHTML = `
        <div style="color: white; text-align: center; padding: 20px;">
          Error loading book details: ${error.message}
        </div>
      `;
    });

  // Check if book is in wishlist and update button
  function checkWishlistStatus(book) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const isInWishlist = wishlist.some(item => item.title === book.title);
    
    const wishlistBtn = document.querySelector('.add-wishlist');
    if (isInWishlist) {
      wishlistBtn.classList.add('in-wishlist');
      wishlistBtn.innerHTML = `<i class="fas fa-heart"></i> IN WISHLIST`;
    } else {
      wishlistBtn.classList.remove('in-wishlist');
      wishlistBtn.innerHTML = `<i class="far fa-heart"></i> ADD TO WISHLIST`;
    }
  }

  // Function to add book to wishlist
  function handleAddToWishlist(book) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Check if book is already in wishlist
    const isBookInWishlist = wishlist.some(item => item.title === book.title);
    
    if (!isBookInWishlist) {
      // Prepare wishlist item
      const wishlistItem = {
        title: book.title,
        image: book.image,
        author: book.author.name
      };

      wishlist.push(wishlistItem);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      
      // Update button style
      const wishlistBtn = document.querySelector('.add-wishlist');
      wishlistBtn.classList.add('in-wishlist');
      wishlistBtn.innerHTML = `<i class="fas fa-heart"></i> IN WISHLIST`;
      
      // Trigger storage event
      window.dispatchEvent(new Event('storage'));
      
      alert('Book added to wishlist!');
    } else {
      alert('This book is already in your wishlist.');
    }
  }
});

// Helper function to find book by title
function findBookByTitle(books, title) {
  const book = books.find(b => b.title === title);
  if (!book) {
    throw new Error('Book not found');
  }
  return book;
}

function displayBookDetails(book) {
  // Populate the details page with the book's information
  document.querySelector('.title').textContent = book.title;
  document.querySelector('.description').textContent = book.description;
  document.querySelector('.poster img').src = book.image;
  document.querySelector('.poster img').alt = book.title;
  
  // Update author information
  const authorElement = document.querySelector('.author');
  if (authorElement) {
    authorElement.textContent = `By ${book.author.name}`;
  }
  
  // Update tags (genres, year, etc.)
  const tagsContainer = document.querySelector('.tags');
  tagsContainer.innerHTML = ''; // Clear existing tags
  
  // Add genres
  if (book.genres && book.genres.length > 0) {
    book.genres.forEach(genre => {
      const genreTag = document.createElement('span');
      genreTag.classList.add('genre');
      genreTag.textContent = genre;
      tagsContainer.appendChild(genreTag);
    });
  }
  
  // Add year
  const yearTag = document.createElement('span');
  yearTag.classList.add('year');
  yearTag.textContent = book.year || 'N/A';
  tagsContainer.appendChild(yearTag);

  // Set PDF link
  const viewLinkBtn = document.querySelector('.view-link');
  if (viewLinkBtn) {
    viewLinkBtn.href = book.pdfLink;
  }
}