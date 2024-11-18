document.addEventListener("DOMContentLoaded", () => {
  // Get book title from URL
  const urlParams = new URLSearchParams(window.location.search);
  const bookTitle = urlParams.get("bookTitle");

  // Normalize book title (handle potential URL encoding or slight variations)
  const normalizedBookTitle = bookTitle ? decodeURIComponent(bookTitle.trim()) : null;

  if (!normalizedBookTitle) {
    alert("No book title provided!");
    return;
  }

  // Fetch book data
  fetch("/assets/js/data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      // Try to find the book, handling potential case or spacing variations
      const book = Object.keys(data).find(key => 
        key.toLowerCase() === normalizedBookTitle.toLowerCase()
      );

      if (!book) {
        alert(`Book "${normalizedBookTitle}" not found!`);
        return;
      }

      // Get the book details
      const bookDetails = data[book];

      // Update page elements
      document.querySelector(".title").textContent = book;
      document.querySelector(".description").textContent = bookDetails.description;
      document.querySelector(".img").src = bookDetails.image;

      // Update genres
      const genreContainer = document.querySelector(".tags");
      const genreElements = genreContainer.querySelectorAll(".genre");
      
      // Clear and update genres
      genreElements.forEach((el, index) => {
        if (bookDetails.genres[index]) {
          el.textContent = bookDetails.genres[index] + (index < bookDetails.genres.length - 1 ? ',' : '');
        } else {
          el.textContent = '';
        }
      });

      // Update year
      const yearSpan = document.querySelector(".year");
      yearSpan.textContent = bookDetails.year;

      // Set up read and view link buttons
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