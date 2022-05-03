import { recipes } from "./data/recipes.js";
import { allFilters } from "./utils/filters.js";
import { showPlats } from "./modules/plats.js";
import { normalizeString } from "./utils/norm.js";

// Elementos del DOM para renderizar
const searchBar = document.getElementById("chercher");
const recipeSection = document.getElementById("plats");
const selectedFilter = document.getElementById("selected-filter");
const filters = document.querySelector(".filters");

// Listas para filtros de busqueda
const ingredientsFilter = [];
const appliancesFilter = [];
const ustensilsFilter = [];

/**
 * Barra de busqueda principal, busca las coincidencias
 * primero en los titulos y luego en la descripcion
 * @param {*} recipes
 */
function searchBarResults(recipes) {
  searchBar.addEventListener("keyup", function (e) {
    const inputValue = normalizeString(e.target.value);

    if (inputValue.length > 2) {
      const matchedRecipes = recipes.filter((recipe) => {
        return (
          normalizeString(recipe.name).includes(inputValue) ||
          recipe.ingredients.some((i) =>
            normalizeString(i.ingredient).includes(inputValue)
          ) ||
          normalizeString(recipe.description).includes(inputValue)
        );
      });

      recipeSection.innerHTML = "";
      if (matchedRecipes.length === 0) {
        recipeSection.innerHTML = `<div id="nomatch">
        <img src="./medias/sad-face-gray.svg" alt="" />
        <p>Cette recherche n'a renvoyé aucune correspondance.</p>
      </div>`;
        document.querySelector(".matchs").remove();
      } else {
        showPlats(matchedRecipes);
        matchMessage(matchedRecipes);
      }
    } else {
      document.querySelector(".matchs").remove();
      recipeSection.innerHTML = "";
      showPlats(recipes);
    }
  });
}

/**
 * Carga la lista de ingredients, ustensils y appliance en los botones
 * de colores
 * @param {*} recipes
 */
function loadFilters(recipes) {
  const { allIngredients, allUstensils, allAppliance } = allFilters(recipes);
  const ingredientsBlock = document.querySelector("#ingredients-list");
  const appliancesBlock = document.querySelector("#appliances-list");
  const ustensilsBlock = document.querySelector("#ustensils-list");

  allIngredients.forEach((ingredient) => {
    ingredientsBlock.innerHTML += `<li role="option" class="ingredients-option">${ingredient}</li>`;
  });

  allAppliance.forEach((appliance) => {
    appliancesBlock.innerHTML += `<li role="option" class="appliances-option">${appliance}</li>`;
  });

  allUstensils.forEach((utensils) => {
    ustensilsBlock.innerHTML += `<li role="option" class="ustensils-option">${utensils}</li>`;
  });
}

/**
 * Aplica un filtro al seleccionar una opcion de la lista
 * y prepara listener de eventos para el cierre de cada uno de los filtros
 */
function selectionFilter() {
  const { allIngredients, allUstensils, allAppliance } = allFilters(recipes);
  const ingredientsBlock = document.querySelector("#ingredients-list");
  const appliancesBlock = document.querySelector("#appliances-list");
  const ustensilsBlock = document.querySelector("#ustensils-list");

  const searchIngredients = document.getElementById("search-ingredients");
  const searchAppliances = document.getElementById("search-appliances");
  const searchUstensils = document.getElementById("search-ustensils");

  selectedFilter.innerHTML = "";

  searchIngredients.addEventListener("keyup", function (e) {
    e.preventDefault();
    const inputValue = normalizeString(e.target.value);

    const matchedIngredients = allIngredients.filter((ingredient) => {
      return normalizeString(ingredient).includes(inputValue);
    });
    ingredientsBlock.innerHTML = "";
    matchedIngredients.forEach((ingredient) => {
      ingredientsBlock.innerHTML += `<li role="option" class="ingredients-option">${ingredient}</li>`;
    });
  });

  searchUstensils.addEventListener("keyup", function (e) {
    e.preventDefault();
    const inputValue = normalizeString(e.target.value);

    const matchedUstensils = allUstensils.filter((ustensil) => {
      return normalizeString(ustensil).includes(inputValue);
    });
    ustensilsBlock.innerHTML = "";
    matchedUstensils.forEach((ustensil) => {
      ustensilsBlock.innerHTML += `<li role="option" class="appliances-option">${ustensil}</li>`;
    });
  });

  searchAppliances.addEventListener("keyup", function (e) {
    e.preventDefault();
    const inputValue = normalizeString(e.target.value);

    const matchedAppliance = allAppliance.filter((ingredient) => {
      return normalizeString(ingredient).includes(inputValue);
    });
    appliancesBlock.innerHTML = "";
    matchedAppliance.forEach((appliance) => {
      appliancesBlock.innerHTML += `<li role="option" class="appliances-option">${appliance}</li>`;
    });
  });

  // Filtro de ingredientes
  ingredientsBlock.addEventListener("click", function (e) {
    const ingredient = e.target.innerText;
    if (e.target.classList[0] === "ingredients-option") {
      if (!ingredientsFilter.includes(ingredient)) {
        ingredientsFilter.push(ingredient);
        selectedFilter.innerHTML += `<div class="ing"><span>${ingredient}</span><i class="fa-regular fa-circle-xmark"></i></div>`;
        console.log(ingredientsFilter);
        renderAfterFilter();
        closeFilter();
      }
    }
  });

  //Filtro de appliance
  appliancesBlock.addEventListener("click", function (e) {
    const appliance = e.target.innerText;
    if (e.target.classList[0] === "appliances-option") {
      if (!appliancesFilter.includes(appliance)) {
        appliancesFilter.push(appliance);
        selectedFilter.innerHTML += `<div class="app"><span>${appliance}</span><i class="fa-regular fa-circle-xmark"></i></div>`;
        console.log(appliancesFilter);
        renderAfterFilter();
        closeFilter();
      }
    }
  });

  ustensilsBlock.addEventListener("click", function (e) {
    const ustensil = e.target.innerText;
    if (e.target.classList[0] === "ustensils-option") {
      if (!ustensilsFilter.includes(ustensil)) {
        ustensilsFilter.push(ustensil);
        selectedFilter.innerHTML += `<div class="ute"><span>${ustensil}</span><i class="fa-regular fa-circle-xmark"></i></div>`;
        console.log(ustensilsFilter);
        renderAfterFilter();
        closeFilter();
      }
    }
  });
}

/**
 * Renderiza los platos de acuerdo a las combinaciones de filtros establecidas
 */
function renderAfterFilter() {
  searchBar.value = "";
  let matchedRecipes;
  if (
    ingredientsFilter.length > 0 &&
    appliancesFilter.length > 0 &&
    ustensilsFilter.length > 0
  ) {
    matchedRecipes = recipes.filter((recipe) => {
      return (
        recipe.ingredients.some((i) =>
          ingredientsFilter.includes(i.ingredient)
        ) &&
        appliancesFilter.includes(recipe.appliance) &&
        recipe.ustensils.some((ustensil) => ustensilsFilter.includes(ustensil))
      );
    });
    console.log(matchedRecipes);
  } else if (
    ingredientsFilter.length > 0 &&
    appliancesFilter.length > 0 &&
    ustensilsFilter.length == 0
  ) {
    matchedRecipes = recipes.filter((recipe) => {
      return (
        recipe.ustensils.some((ustensil) =>
          ustensilsFilter.includes(ustensil)
        ) && appliancesFilter.includes(recipe.appliance)
      );
    });
    console.log(matchedRecipes);
  } else if (
    ingredientsFilter.length > 0 &&
    appliancesFilter.length == 0 &&
    ustensilsFilter.length > 0
  ) {
    matchedRecipes = recipes.filter((recipe) => {
      return (
        recipe.ingredients.some((i) =>
          ingredientsFilter.includes(i.ingredient)
        ) &&
        recipe.ustensils.some((ustensil) => ustensilsFilter.includes(ustensil))
      );
    });
    console.log(matchedRecipes);
  } else if (
    ingredientsFilter.length == 0 &&
    appliancesFilter.length > 0 &&
    ustensilsFilter.length > 0
  ) {
    matchedRecipes = recipes.filter((recipe) => {
      return (
        appliancesFilter.includes(recipe.appliance) &&
        recipe.ustensils.some((ustensil) => ustensilsFilter.includes(ustensil))
      );
    });
    console.log(matchedRecipes);
  } else if (
    ingredientsFilter.length > 0 &&
    appliancesFilter.length == 0 &&
    ustensilsFilter.length == 0
  ) {
    matchedRecipes = recipes.filter((recipe) => {
      return recipe.ingredients.some((i) =>
        ingredientsFilter.includes(i.ingredient)
      );
    });
    console.log("Coincidencias:", matchedRecipes.length);
  } else if (
    ingredientsFilter.length == 0 &&
    appliancesFilter.length > 0 &&
    ustensilsFilter.length == 0
  ) {
    matchedRecipes = recipes.filter((recipe) => {
      return appliancesFilter.includes(recipe.appliance);
    });
    console.log("coincidencias:", matchedRecipes.length);
  } else if (
    ingredientsFilter.length == 0 &&
    appliancesFilter.length == 0 &&
    ustensilsFilter.length > 0
  ) {
    matchedRecipes = recipes.filter((recipe) => {
      return recipe.ustensils.some((ustensil) =>
        ustensilsFilter.includes(ustensil)
      );
    });
    console.log(matchedRecipes);
  } else {
    showPlats(recipes);
    if (document.querySelector(".matchs")) {
      document.querySelector(".matchs").remove();
    }
    return;
  }
  recipeSection.innerHTML = "";
  if (matchedRecipes.length === 0) {
    recipeSection.innerHTML = `<div id="nomatch">
        <img src="./medias/sad-face-gray.svg" alt="" />
        <p>Cette recherche n'a renvoyé aucune correspondance.</p>
      </div>`;
    document.querySelector(".matchs").remove();
  } else {
    showPlats(matchedRecipes);

    setTimeout(() => {
      matchMessage(matchedRecipes);
    }, 100);
  }
}

/**
 * Elimina un filtro aplicado al cerrar la etiqueta seleccionada
 */
function closeFilter() {
  const cross = document.querySelectorAll(".fa-circle-xmark");

  cross.forEach((el) =>
    el.addEventListener("click", (event) => {
      const clase = event.target.parentElement.classList[0];
      console.log(clase);

      switch (clase) {
        case "ing":
          const ingredient = event.target.previousSibling.innerText;
          ingredientsFilter.splice(ingredientsFilter.indexOf(ingredient), 1);
          event.target.parentElement.remove();
          console.log("filtro de ingredientes", ingredientsFilter);
          renderAfterFilter();
          break;
        case "app":
          const appliance = event.target.previousSibling.innerText;
          appliancesFilter.splice(appliancesFilter.indexOf(appliance), 1);
          event.target.parentElement.remove();
          console.log("filtro de appliances", appliancesFilter);
          renderAfterFilter();
          break;
        case "ute":
          const ustensil = event.target.previousSibling.innerText;
          ustensilsFilter.splice(appliancesFilter.indexOf(ustensil), 1);
          event.target.parentElement.remove();
          console.log("filtro de ustensils", ustensilsFilter);
          renderAfterFilter();
          break;

        default:
          break;
      }
    })
  );
}

function matchMessage(list) {
  const filters = document.querySelector(".filters");
  let isOpen = Array.from(filters.childNodes)
    .filter((i) => i.nodeType === 1)
    .some((el) => el.classList.contains("open"));

  console.log(isOpen);

  if (list.length > 0 && !isOpen) {
    if (document.querySelector(".matchs")) {
      document.querySelector(".matchs").remove();
    }
    filters.insertAdjacentHTML(
      "beforeend",
      `<div class="matchs">${list.length} matchs.</div>`
    );
  }
}

searchBarResults(recipes);
selectionFilter();

window.addEventListener("load", (e) => {
  searchBar.value = "";
  loadFilters(recipes);
  showPlats(recipes);
});
