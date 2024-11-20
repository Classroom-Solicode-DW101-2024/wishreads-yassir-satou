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

  fetch("/assets/js/data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const book = Object.keys(data).find(
        (key) => key.toLowerCase() === normalizedBookTitle.toLowerCase()
      );

      if (!book) {
        alert(`Book "${normalizedBookTitle}" not found!`);
        return;
      }

      const bookDetails = data[book];

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
    })
    .catch((error) => {
      console.error("Error fetching book details:", error);
      alert("Failed to load book details. Please try again later.");
    });
});
document.addEventListener("DOMContentLoaded", () => {
  const searchBox = document.querySelector(".box");
  const searchInput = searchBox.querySelector(".input");
  const searchLabel = searchBox.querySelector("label");
  const searchIcon = searchBox.querySelector("i");

  searchInput.addEventListener("focus", () => {
    searchIcon.classList.add("active");
    searchLabel.style.opacity = "0";
    searchLabel.style.transform = "translateX(-10px)";
  });

  searchInput.addEventListener("blur", () => {
    if (searchInput.value === "") {
      searchIcon.classList.remove("active");
      searchLabel.style.opacity = "0.7";
      searchLabel.style.transform = "translateX(0)";
    }
  });
});
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

  // Wishlist functionality
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

  const addToWishlistBtn = document.querySelector('.add-wishlist');

  fetch("/assets/js/data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const book = Object.keys(data).find(
        (key) => key.toLowerCase() === normalizedBookTitle.toLowerCase()
      );

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
          addToWishlistBtn.classList.add('in-wishlist');
        }

        addToWishlistBtn.addEventListener('click', () => {
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
              pdfLink: bookDetails.pdfLink
            };

            // Add to wishlist
            wishlist.push(bookToAdd);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));

            // Update button state
            addToWishlistBtn.innerHTML = `<i class="fa-solid fa-heart"></i> IN WISHLIST`;
            addToWishlistBtn.classList.add('in-wishlist');

            // Show success message
            alert(`${book} added to wishlist!`);
          } else {
            // Remove from wishlist
            wishlist = wishlist.filter(
              (wishlistBook) => wishlistBook.title !== book
            );
            localStorage.setItem('wishlist', JSON.stringify(wishlist));

            // Reset button state
            addToWishlistBtn.innerHTML = `<i class="fa-regular fa-heart"></i> ADD TO WISHLIST`;
            addToWishlistBtn.classList.remove('in-wishlist');

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