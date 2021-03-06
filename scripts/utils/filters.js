export const allFilters = (recipes) => {
  let allIngredients = [];
  let allUstensils = [];
  let allAppliance = [];

  recipes.forEach((recipe) => {
    allIngredients = [
      ...new Set([
        ...allIngredients,
        ...recipe.ingredients.map((i) => i.ingredient),
      ]),
    ];
    allUstensils = [
      ...new Set([...allUstensils, ...recipe.ustensils.map((u) => u)]),
    ];

    allAppliance = [...new Set([...allAppliance, ...[recipe.appliance]])];
  });

  allIngredients = allIngredients.sort();
  allUstensils = allUstensils.sort();
  allAppliance = allAppliance.sort();

  return { allIngredients, allUstensils, allAppliance };
};
