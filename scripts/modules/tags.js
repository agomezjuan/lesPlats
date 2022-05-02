const tagLabel = document.querySelectorAll(".tag-label");

tagLabel.forEach((label) => {
  const tagInput = label.parentNode.children[1];

  label.addEventListener("click", (event) => {
    event.preventDefault();
    const tagBox = event.target.parentNode.parentNode;
    console.log(tagBox);
    label.style.display = "none";
    tagBox.classList.add("open");
    tagInput.setAttribute("placeholder", "Rechercher");
    tagInput.style.display = "block";
    tagInput.style.width = "40rem";
  });
});

const tagArrow = document.querySelectorAll(".tag-arrow");

tagArrow.forEach((arrow) => {
  const tagBox = arrow.parentNode.parentNode;
  const tagBtn = arrow.parentNode;
  const tagLabel = tagBox.children[0].children[0];
  const searchTag = arrow.previousElementSibling;
  const tagsList = tagBox.children[1];

  arrow.addEventListener("click", (event) => {
    event.preventDefault();
    tagBox.classList.toggle("open");
    tagLabel.style.display = "none";

    searchTag.setAttribute(
      "placeholder",
      "Rechercher des " + tagBtn.textContent.toLowerCase().trim()
    );

    searchTag.style.display = "block";
    searchTag.focus();
    tagsList.style.display = "flex";
    tagsList.style.borderRadius = "0.25rem";

    if (!tagBox.classList.contains("open")) {
      searchTag.style.display = "none";
      tagsList.style.display = "none";
      tagLabel.style.display = "inline-block";
    }
  });

  window.addEventListener("click", function (e) {
    if (!arrow.contains(e.target)) {
      tagBox.classList.remove("open");
      tagLabel.style.display = "flex";
      searchTag.style.display = "none";
      tagsList.style.display = "none";
    }

    if (tagLabel.contains(e.target)) {
      tagLabel.style.display = "none";
      searchTag.style.display = "flex";
      searchTag.focus();
      tagsList.style.borderRadius = "0.25rem";
    }
  });
});
