import { recipes } from "./data/recipes.js";
import { allFilters } from "./utils/filters.js";
import { showPlats } from "./modules/plats.js";
import { normalizeString } from "./utils/norm.js";

const searchBar = document.getElementById("chercher");
const recipeSection = document.getElementById("plats");
const selectedFilter = document.getElementById("selected-filter");

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

function loadFilters(recipes) {
  const { allIngredients, allUstensils, allAppliance } = allFilters(recipes);
  const ingredientsBlock = document.querySelector("#ingredient");
  const appareilsBlock = document.querySelector("#appareils");
  const utensilesBlock = document.querySelector("#ustensiles");

  allIngredients.forEach((ingredient) => {
    ingredientsBlock.innerHTML += `<option>${ingredient}</option>`;
  });

  allAppliance.forEach((appliance) => {
    appareilsBlock.innerHTML += `<option>${appliance}</option>`;
  });

  allUstensils.forEach((utensils) => {
    utensilesBlock.innerHTML += `<option>${utensils}</option>`;
  });
}

function selectionFilter() {
  selectedFilter.innerHTML = "";
  const selectedList = [];
  const ingredientsBlock = document.querySelector("#ingredient");
  const appareilsBlock = document.querySelector("#appareils");
  const utensilesBlock = document.querySelector("#ustensiles");

  ingredientsBlock.addEventListener("click", function (e) {
    const ingredient = e.target.value;
    if (ingredient) {
      if (!selectedList.includes(ingredient)) {
        selectedList.push(ingredient);
        selectedFilter.innerHTML += `<div class="ing"><span>${ingredient}</span> <i class="fa-regular fa-circle-xmark"></i></div>`;
        console.log(selectedList);
        const matchedRecipes = recipes.filter((recipe) => {
          return recipe.ingredients.some((i) =>
            i.ingredient.includes(selectedList)
          );
        });
        console.log(matchedRecipes);
        recipeSection.innerHTML = "";
        showPlats(matchedRecipes);
        closeFilter();
      }
    }
  });

  appareilsBlock.addEventListener("click", function (e) {
    const appliance = e.target.value;
    if (appliance) {
      if (!selectedList.includes(appliance)) {
        selectedList.push(appliance);
        selectedFilter.innerHTML += `<div class="app"><span>${e.target.value}</span> <i class="fa-regular fa-circle-xmark"></i></div>`;
        console.log(selectedList);
        const matchedRecipes = recipes.filter((recipe) => {
          return recipe.appliance.includes(selectedList);
        });
        console.log(matchedRecipes);
        recipeSection.innerHTML = "";
        showPlats(matchedRecipes);
        closeFilter();
      }
    }
  });

  utensilesBlock.addEventListener("click", function (e) {
    if (e.target.value) {
      if (!selectedList.includes(e.target.value)) {
        selectedList.push(e.target.value);
        selectedFilter.innerHTML += `<div class="ute"><span>${e.target.value}</span> <i class="fa-regular fa-circle-xmark"></i></div>`;
        console.log(selectedList);
        closeFilter();
      }
    }
  });
}

function closeFilter() {
  const selectedItemsToClose = [];
  const cross = document.querySelectorAll(".fa-circle-xmark");
  console.log(cross);

  cross.forEach((el) =>
    el.addEventListener("click", (event) => {
      console.log("me cliqueaste");
      event.target.parentElement.remove();
    })
  );
}

searchBarResults(recipes);
selectionFilter();

window.addEventListener("load", function () {
  searchBar.value = "";
  loadFilters(recipes);
  showPlats(recipes);
});
