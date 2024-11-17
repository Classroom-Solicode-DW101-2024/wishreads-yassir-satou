document.addEventListener("DOMContentLoaded", () => {
  const clickableImages = document.querySelectorAll(
    ".books img, .world_book img"
  );

  clickableImages.forEach((img) => {
    img.addEventListener("click", () => {
      const bookTitle = img.getAttribute("data-title");

      fetch("/assets/books data/books.json")
        .then((response) => response.json())
        .then((data) => {
          const book = data.book_array.find((b) => b.book_title === bookTitle);

          if (book) {
            document.querySelector(".title").textContent = book.book_title;
            document.querySelector(".poster img").src = book.image;
            document.querySelector(".description").textContent = book.content;

            const pdfButton = document.querySelector(".read-btn");
            pdfButton.textContent = "READ BOOK";
            pdfButton.onclick = () => {
              window.open(book.pdf_link, "_blank");
            };
          } else {
            console.error("Book not found in data.");
          }
        })
        .catch((error) => console.error("Error fetching book details:", error));
    });
  });
});
