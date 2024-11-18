document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const bookTitle = urlParams.get("bookTitle");

  if (!bookTitle) {
    alert("Book title not found in URL!");
    return;
  }

  fetch("/assets/js/data.json")
    .then((response) => response.json())
    .then((data) => {
      const book = data.book_array.find(
        (item) => item.book_title === bookTitle
      );

      if (!book) {
        alert("Book not found!");
        return;
      }

      // Ensure the image path is correctly resolved
      const imagePath = book.image.startsWith('/') 
        ? book.image 
        : '/' + book.image;

      document.querySelector(".title").textContent = book.book_title;
      document.querySelector(".description").textContent = book.content;
      
      // Use the corrected image path
      const imgElement = document.querySelector(".img");
      imgElement.src = imagePath;
      imgElement.alt = book.book_title;

      document.querySelector(".read-btn").onclick = () =>
        window.open(book.pdf_link, "_blank");
    })
    .catch((error) => console.error("Error fetching data:", error));
});