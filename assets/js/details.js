document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const bookTitle = urlParams.get("bookTitle");

  const normalizedBookTitle = bookTitle
    ? decodeURIComponent(bookTitle.trim())
    : null;

  if (!normalizedBookTitle) {
    alert("No book title provided!");
    return;
  }

  // Search functionality
  const searchBox = document.querySelector(".box");
  const searchInput = searchBox.querySelector(".input");
  const searchIcon = searchBox.querySelector("i");

  // Function to normalize search text
  function normalizeText(text) {
    return text.toLowerCase().trim();
  }

  // Function to find matching books
  function findMatchingBooks(searchTerm, bookData) {
    const normalizedSearch = normalizeText(searchTerm);

    // Find matches in book titles
    const matches = Object.keys(bookData).filter((title) =>
      normalizeText(title).includes(normalizedSearch)
    );

    return matches;
  }

  // Search input event listener
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      // Fetch book data to search
      fetch("/assets/js/data.json")
        .then((response) => response.json())
        .then((bookData) => {
          const searchTerm = searchInput.value;
          const matchingBooks = findMatchingBooks(searchTerm, bookData);

          if (matchingBooks.length === 1) {
            // Direct to details page if exact or unique match
            window.location.href = `details.html?bookTitle=${encodeURIComponent(
              matchingBooks[0]
            )}`;
          } else if (matchingBooks.length > 1) {
            // Multiple matches - show alert
            alert(
              `Multiple matches found: ${matchingBooks.join(
                ", "
              )}. Please be more specific.`
            );
          } else {
            // No matches
            alert("No books found. Please try another search term.");
          }
        })
        .catch((error) => {
          console.error("Error searching books:", error);
          alert("Failed to search books. Please try again later.");
        });
    }
  });

  // Search icon click functionality
  searchIcon.addEventListener("click", () => {
    // Fetch book data to search
    fetch("/assets/js/data.json")
      .then((response) => response.json())
      .then((bookData) => {
        const searchTerm = searchInput.value;
        const matchingBooks = findMatchingBooks(searchTerm, bookData);

        if (matchingBooks.length === 1) {
          window.location.href = `details.html?bookTitle=${encodeURIComponent(
            matchingBooks[0]
          )}`;
        } else if (matchingBooks.length > 1) {
          alert(
            `Multiple matches found: ${matchingBooks.join(
              ", "
            )}. Please be more specific.`
          );
        } else {
          alert("No books found. Please try another search term.");
        }
      })
      .catch((error) => {
        console.error("Error searching books:", error);
        alert("Failed to search books. Please try again later.");
      });
  });

  // Improved book matching function
  function findBookCaseInsensitive(data, searchTitle) {
    const normalizedSearch = searchTitle.toLowerCase().trim();

    return Object.keys(data).find(
      (key) =>
        key.toLowerCase().trim() === normalizedSearch ||
        key.toLowerCase().trim().includes(normalizedSearch)
    );
  }

  // Wishlist functionality
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  const addToWishlistBtn = document.querySelector(".add-wishlist");

  fetch("/assets/js/data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Use improved matching function
      const book = findBookCaseInsensitive(data, normalizedBookTitle);

      if (!book) {
        alert(`Book "${normalizedBookTitle}" not found!`);
        return;
      }

      const bookDetails = data[book];

      // Populate page details
      document.querySelector(".title").textContent = book;
      document.querySelector(".description").textContent =
        bookDetails.description;
      document.querySelector(".img").src = bookDetails.image;

      const genreContainer = document.querySelector(".tags");
      const genreElements = genreContainer.querySelectorAll(".genre");

      genreElements.forEach((el, index) => {
        if (bookDetails.genres[index]) {
          el.textContent =
            bookDetails.genres[index] +
            (index < bookDetails.genres.length - 1 ? "," : "");
        } else {
          el.textContent = "";
        }
      });

      const yearSpan = document.querySelector(".year");
      yearSpan.textContent = bookDetails.year;

      const readBtn = document.querySelector(".read-btn");
      const viewLinkBtn = document.querySelector(".view-link");

      if (readBtn) {
        readBtn.onclick = () => window.open(bookDetails.pdfLink, "_blank");
      }

      if (viewLinkBtn) {
        viewLinkBtn.onclick = () => window.open(bookDetails.pdfLink, "_blank");
      }

      // Add to Wishlist Functionality
      if (addToWishlistBtn) {
        // Check if book is already in wishlist
        const isBookInWishlist = wishlist.some(
          (wishlistBook) => wishlistBook.title === book
        );

        // Update button state based on wishlist status
        if (isBookInWishlist) {
          addToWishlistBtn.innerHTML = `<i class="fa-solid fa-heart"></i> IN WISHLIST`;
          addToWishlistBtn.classList.add("in-wishlist");
        }

        addToWishlistBtn.addEventListener("click", () => {
          // Check if book is already in wishlist
          const isBookInWishlist = wishlist.some(
            (wishlistBook) => wishlistBook.title === book
          );

          if (!isBookInWishlist) {
            // Prepare book object to add to wishlist
            const bookToAdd = {
              title: book,
              author: bookDetails.author,
              image: bookDetails.image,
              pdfLink: bookDetails.pdfLink,
            };

            // Add to wishlist
            wishlist.push(bookToAdd);
            localStorage.setItem("wishlist", JSON.stringify(wishlist));

            // Update button state
            addToWishlistBtn.innerHTML = `<i class="fa-solid fa-heart"></i> IN WISHLIST`;
            addToWishlistBtn.classList.add("in-wishlist");

            // Show success message
            alert(`${book} added to wishlist!`);
          } else {
            // Remove from wishlist
            wishlist = wishlist.filter(
              (wishlistBook) => wishlistBook.title !== book
            );
            localStorage.setItem("wishlist", JSON.stringify(wishlist));

            // Reset button state
            addToWishlistBtn.innerHTML = `<i class="fa-regular fa-heart"></i> ADD TO WISHLIST`;
            addToWishlistBtn.classList.remove("in-wishlist");

            // Show removal message
            alert(`${book} removed from wishlist!`);
          }
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching book details:", error);
      alert("Failed to load book details. Please try again later.");
    });
});

// Search label animation
document.addEventListener("DOMContentLoaded", () => {
  const searchBox = document.querySelector(".box");
  const searchInput = searchBox.querySelector(".input");

  searchInput.addEventListener("focus", () => {
    searchBox.classList.add("active");
  });

  searchInput.addEventListener("blur", () => {
    if (!searchInput.value) {
      searchBox.classList.remove("active");
    }
  });
});
