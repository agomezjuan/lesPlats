export const allFilters = (recipes) => {
  let allIngredients = [];
  let allUstensils = [];
  let allAppliance = [];

  console.log(recipes);

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

  return { allIngredients, allUstensils, allAppliance };
};
