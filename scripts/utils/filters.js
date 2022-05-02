export const allFilters = (recipes) => {
  let allIngredients = [];
  let allUstensils = [];
  let allAppliance = [];

  recipes.forEach((recipe) => {
    allIngredients = [
      ...new Set([
        ...allIngredients.sort(),
        ...recipe.ingredients.map((i) => i.ingredient),
      ]),
    ];
    allUstensils = [
      ...new Set([...allUstensils.sort(), ...recipe.ustensils.map((u) => u)]),
    ];

    allAppliance = [
      ...new Set([...allAppliance.sort(), ...[recipe.appliance]]),
    ];
  });

  return { allIngredients, allUstensils, allAppliance };
};
