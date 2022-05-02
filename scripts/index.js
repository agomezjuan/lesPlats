import { recipes } from "./data/recipes.js";
import { allFilters } from "./utils/filters.js";
import { showPlats } from "./modules/plats.js";
import { normalizeString } from "./utils/norm.js";

// Elementos del DOM para renderizar
const searchBar = document.getElementById("chercher");
const recipeSection = document.getElementById("plats");
const selectedFilter = document.getElementById("selected-filter");

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
      showPlats(matchedRecipes);
    } else {
      recipeSection.innerHTML = "";
      showPlats(recipes);
    }
  });
}

/**
 *
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

function selectionFilter() {
  selectedFilter.innerHTML = "";
  const ingredientsBlock = document.querySelector("#ingredients-list");
  const appliancesBlock = document.querySelector("#appliances-list");
  const ustensilsBlock = document.querySelector("#ustensils-list");

  const searchIngredients = document.getElementById("search-ingredients");
  const searchAppliances = document.getElementById("search-appliances");
  const searchUstensils = document.getElementById("search-ustensils");

  searchIngredients.addEventListener("keyup", function (e) {
    e.preventDefault();
    const { allIngredients } = allFilters(recipes);
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
    const { allUstensils } = allFilters(recipes);
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
    const { allAppliance } = allFilters(recipes);
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
    console.log(e.target.classList[0]);
    if (e.target.classList[0] == "ingredients-option") {
      if (!ingredientsFilter.includes(ingredient)) {
        ingredientsFilter.push(ingredient);
        selectedFilter.innerHTML += `<div class="ing"><span>${ingredient}</span><i class="fa-regular fa-circle-xmark"></i></div>`;
        console.log(ingredientsFilter);
        const matchedRecipes = recipes.filter((recipe) => {
          return recipe.ingredients.some((i) =>
            i.ingredient.includes(ingredientsFilter)
          );
        });
        console.log("coincidencias:", matchedRecipes.length);
        recipeSection.innerHTML = "";
        showPlats(matchedRecipes);
        closeFilter();
      }
    }
  });

  appliancesBlock.addEventListener("click", function (e) {
    const appliance = e.target.innerText;
    if (appliance) {
      if (!appliancesFilter.includes(appliance)) {
        appliancesFilter.push(appliance);
        selectedFilter.innerHTML += `<div class="app"><span>${appliance}</span><i class="fa-regular fa-circle-xmark"></i></div>`;
        console.log(appliancesFilter);
        const matchedRecipes = recipes.filter((recipe) => {
          return recipe.appliance.includes(appliancesFilter);
        });
        console.log("coincidencias:", matchedRecipes.length);
        recipeSection.innerHTML = "";
        showPlats(matchedRecipes);
        closeFilter();
      }
    }
  });

  ustensilsBlock.addEventListener("click", function (e) {
    const ustensil = e.target.innerText;
    if (ustensil) {
      if (!ustensilsFilter.includes(ustensil)) {
        ustensilsFilter.push(ustensil);
        selectedFilter.innerHTML += `<div class="ute"><span>${ustensil}</span><i class="fa-regular fa-circle-xmark"></i></div>`;
        console.log(ustensilsFilter);
        const matchedRecipes = recipes.filter((recipe) => {
          return recipe.ustensils.includes(ustensilsFilter);
        });
        console.log(matchedRecipes);
        recipeSection.innerHTML = "";
        showPlats(matchedRecipes);
        closeFilter();
      }
    }
  });
}

function closeFilter() {
  const cross = document.querySelectorAll(".fa-circle-xmark");

  cross.forEach((el) =>
    el.addEventListener("click", (event) => {
      console.log("me cliqueaste");

      event.target.parentElement.remove();
      if (ingredientsFilter || appliancesFilter || ustensilsFilter) {
        showPlats(recipes);
      }
    })
  );
}

searchBarResults(recipes);
selectionFilter();

window.addEventListener("load", (e) => {
  searchBar.value = "";
  loadFilters(recipes);
  showPlats(recipes);
});
