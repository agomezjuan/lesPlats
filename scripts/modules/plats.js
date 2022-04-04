function getIngedients(ingredientsList) {
  let list = "";
  ingredientsList.forEach((item) => {
    list += `<li><strong>${item.ingredient}</strong>${
      item.quantity || item.quantite
        ? ": " + (item.quantity || item.quantite)
        : ""
    } ${item.unit ? item.unit : ""}</li>`;
  });
  return list;
}

export function showPlats(platsList) {
  platsList.forEach((plat) => {
    const recipeSection = document.querySelector("#plats");

    const platCard = `<article class="single-plat">
            <div class="plat-image">
                <img src="" alt="">
            </div>
            <div class="plat-content">
                <div class="plat-header">
                    <div class="title">
                        <h3>${plat.name}</h3>
                    </div>
                    <div class="time">
                        <i class="fa-regular fa-clock"></i>
                        <span>${plat.time} min</span>
                    </div>
                </div>
                <div class="plat-body">
                    <div class="ingredients">
                        <ul>
                        ${getIngedients(plat.ingredients)}
                        </ul>
                    </div>
                    <div class="description">
                        <span>${plat.description}</span>
                    </div>
                </div>
            </div>
        </article>`;

    recipeSection.insertAdjacentHTML("beforeend", platCard);
  });
}
