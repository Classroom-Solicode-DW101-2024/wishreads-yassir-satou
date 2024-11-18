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
      const book = data[bookTitle];

      if (!book) {
        alert("Book not found!");
        return;
      }


      document.querySelector(".title").textContent = bookTitle;
      document.querySelector(".description").textContent = book.description;
      document.querySelector(".img").src = book.image;
      

      const genreContainer = document.querySelector(".tags");
      const genreSpans = genreContainer.querySelectorAll(".genre");
      

      genreSpans.forEach((span, index) => {
        if (index < book.genres.length) {
          span.textContent = book.genres[index] + (index < book.genres.length - 1 ? ',' : '');
        } else {
          span.textContent = '';
        }
      });


      const yearSpan = document.querySelector(".year");
      yearSpan.textContent = book.year;


      document.querySelector(".read-btn").onclick = () =>
        window.open(book.pdfLink, "_blank");
    })
    .catch((error) => console.error("Error fetching data:", error));
});