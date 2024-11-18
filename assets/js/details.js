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

      document.querySelector(".title").textContent = book.book_title;
      document.querySelector(".description").textContent = book.content;
      document.querySelector(".img").src = book.image;
      document.querySelector(".image").alt = book.book_title;
      document.querySelector(".read-btn").onclick = () =>
        window.open(book.pdf_link, "_blank");
    })
    .catch((error) => console.error("Error fetching data:", error));
});
