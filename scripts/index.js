import { recipes } from "./data/recipes.js";
import { allFilters } from "./utils/filters.js";
import { showPlats } from "./modules/plats.js";
import { normalizeString } from "./utils/norm.js";

// Elementos del DOM para modificar
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
    // Normalizar el texto escrito para que no distinga tildes ni
    // caracteres especiales
    const inputValue = normalizeString(e.target.value);

    // Si el texto ingresado en la barra de busqueda tiene 3 o mas caracteres
    // se ejecuta la búsqueda primero en los ingredientes y luego en la descripcion
    if (inputValue.length > 2) {
      const matchedRecipes = recipes.filter((recipe) => {
        return (
          // el metodo includes() verifica si el texto del campo de busqueda
          // se encuentra los ingredientes o la descripcion de la receta
          normalizeString(recipe.name).includes(inputValue) ||
          recipe.ingredients.some((i) =>
            normalizeString(i.ingredient).includes(inputValue)
          ) ||
          normalizeString(recipe.description).includes(inputValue)
        );
      });

      // se limpia la seccion de platos para renderizar nuevamente los
      // resultados de la busqueda
      recipeSection.innerHTML = "";

      // si no hay resultados de busqueda se muestra una carita triste
      if (matchedRecipes.length === 0) {
        recipeSection.innerHTML = `<div id="nomatch">
        <img src="./medias/sad-face-gray.svg" alt="" />
        <p>Cette recherche n'a renvoyé aucune correspondance.</p>
      </div>`;
        document.querySelector(".matchs").remove();
      }
      // de lo contrario se muestran los platos que coinciden con la
      // busqueda
      else {
        showPlats(matchedRecipes);
        //matchMessage(matchedRecipes);
      }
    }
    // si lo que se escribió no tiene al menos 3 caracteres entonces
    // se muestran todos los platos
    else {
      //document.querySelector(".matchs").remove();
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
  // desestructuracion de las listas de ingredients, appliance y ustensils
  const { allIngredients, allUstensils, allAppliance } = allFilters(recipes);

  // seleccion de elementos del dom para su modificacion
  const ingredientsBlock = document.querySelector("#ingredients-list");
  const appliancesBlock = document.querySelector("#appliances-list");
  const ustensilsBlock = document.querySelector("#ustensils-list");

  const searchIngredients = document.getElementById("search-ingredients");
  const searchAppliances = document.getElementById("search-appliances");
  const searchUstensils = document.getElementById("search-ustensils");

  // al iniciar la seccion de filtros aplicados debe estar vacía
  selectedFilter.innerHTML = "";

  // eventos al escribir en el imput de seleccion de filtros
  searchIngredients.addEventListener("keyup", typeMatchIngredient);
  searchUstensils.addEventListener("keyup", typeMatchUstensils);
  searchAppliances.addEventListener("keyup", typeMatchAppliance);

  // eventos al hacer click en algun ingredient, appliance o ustensils
  ingredientsBlock.addEventListener("click", ingredientSelection);
  appliancesBlock.addEventListener("click", applianceSelection);
  ustensilsBlock.addEventListener("click", ustensilSelection);

  // Funciones ejecutadas en los eventos
  /**
   * Esta función recarga la lista de ingredients con aquellos que coinciden
   * con lo escrito en el input
   * @param {evento click} e
   */
  function typeMatchIngredient(e) {
    e.preventDefault();
    const inputValue = normalizeString(e.target.value);

    const matchedIngredients = allIngredients.filter((ingredient) => {
      return normalizeString(ingredient).includes(inputValue);
    });
    ingredientsBlock.innerHTML = "";
    matchedIngredients.forEach((ingredient) => {
      ingredientsBlock.innerHTML += `<li role="option" class="ingredients-option">${ingredient}</li>`;
    });
  }

  /**
   * Esta función recarga la lista de ustensils con aquellos que coinciden
   * con lo escrito en el input
   * @param {evento click} e
   */
  function typeMatchUstensils(e) {
    e.preventDefault();
    const inputValue = normalizeString(e.target.value);

    const matchedUstensils = allUstensils.filter((ustensil) => {
      return normalizeString(ustensil).includes(inputValue);
    });
    ustensilsBlock.innerHTML = "";
    matchedUstensils.forEach((ustensil) => {
      ustensilsBlock.innerHTML += `<li role="option" class="appliances-option">${ustensil}</li>`;
    });
  }

  /**
   * Esta función recarga la lista de appliances con aquellos que coinciden
   * con lo escrito en el input
   * @param {evento click} e
   */
  function typeMatchAppliance(e) {
    e.preventDefault();
    const inputValue = normalizeString(e.target.value);

    const matchedAppliance = allAppliance.filter((ingredient) => {
      return normalizeString(ingredient).includes(inputValue);
    });
    appliancesBlock.innerHTML = "";
    matchedAppliance.forEach((appliance) => {
      appliancesBlock.innerHTML += `<li role="option" class="appliances-option">${appliance}</li>`;
    });
  }

  /**
   * Esta función inserta una etiqueta en la sección de filtros y renderiza los
   * resultados del filtro en la sección de platos
   * @param {evento click} e
   */
  function ingredientSelection(e) {
    const ingredient = e.target.innerText;

    if (e.target.classList[0] === "ingredients-option") {
      //si el ingredient seleccionado no está en la lista entonces lo agrega
      if (!ingredientsFilter.includes(ingredient)) {
        ingredientsFilter.push(ingredient);
        // inserta una etiqueta de filtro en el HTML
        selectedFilter.innerHTML += `<div class="ing"><span>${ingredient}</span><i class="fa-regular fa-circle-xmark"></i></div>`;
        // renderizar las coincidencias nuevamente
        renderAfterFilter();
        closeFilter();
      }
    }
  }

  function applianceSelection(e) {
    const appliance = e.target.innerText;
    if (e.target.classList[0] === "appliances-option") {
      //si el appliance seleccionado no está en la lista entonces lo agrega
      if (!appliancesFilter.includes(appliance)) {
        appliancesFilter.push(appliance);
        // inserta una etiqueta de filtro en el HTML
        selectedFilter.innerHTML += `<div class="app"><span>${appliance}</span><i class="fa-regular fa-circle-xmark"></i></div>`;
        // renderizar las coincidencias nuevamente
        renderAfterFilter();
        closeFilter();
      }
    }
  }

  function ustensilSelection(e) {
    const ustensil = e.target.innerText;
    if (e.target.classList[0] === "ustensils-option") {
      //si el ustensil seleccionado no está en la lista entonces lo agrega
      if (!ustensilsFilter.includes(ustensil)) {
        ustensilsFilter.push(ustensil);
        // inserta una etiqueta de filtro en el HTML
        selectedFilter.innerHTML += `<div class="ute"><span>${ustensil}</span><i class="fa-regular fa-circle-xmark"></i></div>`;
        // renderizar las coincidencias nuevamente
        renderAfterFilter();
        closeFilter();
      }
    }
  }
}

/**
 * Renderiza los platos de acuerdo a las combinaciones de filtros establecidas
 */
function renderAfterFilter() {
  // cada vez que se renderizan resultados de busqueda se limpia la barra
  searchBar.value = "";

  // 3 filtros: ingredients, appliance y ustensils
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
  }

  // 2 filtros: Ingredients y appliance
  else if (
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
  }

  // 2 filtros: Ingredients y ustensils
  else if (
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
  }

  // 2 filtros: Appliance y ustensils
  else if (
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
    console.log("coincidencias:", matchedRecipes.length);
  }

  // Solo filtro de ingredientes
  else if (
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
  }

  // Solo filtro de appliances
  else if (
    ingredientsFilter.length == 0 &&
    appliancesFilter.length > 0 &&
    ustensilsFilter.length == 0
  ) {
    matchedRecipes = recipes.filter((recipe) => {
      return appliancesFilter.includes(recipe.appliance);
    });
    console.log("coincidencias:", matchedRecipes.length);
  }

  // Solo filtro de ustensils
  else if (
    ingredientsFilter.length == 0 &&
    appliancesFilter.length == 0 &&
    ustensilsFilter.length > 0
  ) {
    matchedRecipes = recipes.filter((recipe) => {
      return recipe.ustensils.some((ustensil) =>
        ustensilsFilter.includes(ustensil)
      );
    });
    console.log("coincidencias:", matchedRecipes.length);
  }

  // Si no hay ningun filtro de muestra todos los platos
  // y retorna void
  else {
    showPlats(recipes);
    // if (document.querySelector(".matchs")) {
    //   document.querySelector(".matchs").remove();
    // }
    return;
  }

  // limpia la seccion de platos antes de mostrar los nuevos resulados
  recipeSection.innerHTML = "";

  // Si
  if (matchedRecipes.length > 0) {
    showPlats(matchedRecipes);
    // setTimeout(() => {
    //   matchMessage(matchedRecipes);
    // }, 100);
  }

  // si no hay resultados de la busqueda se muestra una carita triste
  else {
    recipeSection.innerHTML = `<div id="nomatch">
        <img src="./medias/sad-face-gray.svg" alt="" />
        <p>Cette recherche n'a renvoyé aucune correspondance.</p>
      </div>`;
    //document.querySelector(".matchs").remove();
  }
}

/**
 * Elimina un filtro aplicado al cerrar la etiqueta seleccionada
 */
function closeFilter() {
  // icono (x) al hacer click se cierra el filtro
  const cross = document.querySelectorAll(".fa-circle-xmark");

  // por cada icono se crea el evento click que cierra el filtro
  // y elimina la etiqueta
  cross.forEach((el) =>
    el.addEventListener("click", (event) => {
      const clase = event.target.parentElement.classList[0];
      console.log(clase);

      // segun sea el caso de la clase obtenida al cerrar la
      // etiqueta de filtro se ejecuta alguna de las
      // siguientes acciones
      switch (clase) {
        // caso en el que la etiqueta cerrada era un ingredient
        case "ing":
          const ingredient = event.target.previousSibling.innerText;
          ingredientsFilter.splice(ingredientsFilter.indexOf(ingredient), 1);
          event.target.parentElement.remove();
          renderAfterFilter();
          break;

        // caso en el que la etiqueta cerrada era un appliance
        case "app":
          const appliance = event.target.previousSibling.innerText;
          appliancesFilter.splice(appliancesFilter.indexOf(appliance), 1);
          event.target.parentElement.remove();
          renderAfterFilter();
          break;

        // caso por defecto: si no se cerró un ingredient ni un appliance
        // entonces era un ustensil
        default:
          const ustensil = event.target.previousSibling.innerText;
          ustensilsFilter.splice(appliancesFilter.indexOf(ustensil), 1);
          event.target.parentElement.remove();
          renderAfterFilter();
          break;
      }
    })
  );
}

/**
 * Esta función muestra un mensaje en la sección de filtros
 * con el numero de resultados encontrados
 * @param {*} list
 */
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

window.addEventListener("load", (e) => {
  // al cargar la página la barra de busqueda debe estar limpia
  searchBar.value = "";

  //preparar la barra de busqueda y su evento de teclado
  searchBarResults(recipes);

  // carga las listas y sus eventos para los filtros
  loadFilters(recipes);
  selectionFilter();

  // muestra todos los platos
  showPlats(recipes);
});
