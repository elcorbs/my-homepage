export function getIngredientsFromRecipes(recipes) {
  const distinctIngredient = (value, index, self) => self.findIndex(x => x.name === value.name) === index;
  return recipes.map(r => r.ingredients).flat().filter(distinctIngredient).map(i => i.name).sort();
}

export function getCuisinesFromRecipes(recipes) {
  const distinct = (value, index, self) => self.findIndex(x => x.cuisine === value.cuisine) === index;
  return recipes.filter(distinct).map(r => r.cuisine).sort();
}

export const getUsername = () => localStorage.getItem('emmas-recipes-username');
export const getToken = () => localStorage.getItem('emmas-recipes-token');
export const isLoggedIn = () => localStorage.getItem('emmas-recipes-token');
export const isAdmin = () => localStorage.getItem('emmas-recipes-admin') === "true";