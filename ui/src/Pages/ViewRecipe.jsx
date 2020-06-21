import React, {useState, useEffect} from "react";
import { getRecipe } from "../Gateway/query-api";
import BreadcrumbNavigator from "../Components/BreadcrumbNavigator";

export default function ViewRecipe(props) {
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    getRecipe(props.match.params.id, setRecipe)
  }, [props.match.params.id])
if (!recipe) { return <div /> }

  return (
    <div>
      <BreadcrumbNavigator recipeName={recipe.name.toLowerCase()} />
      <h2>
        {recipe.name}
      </h2>
      <ul>
        {recipe.ingredients.map(i => <li key={i.name}>{i.amount} {i.measurement} {i.name} </li>)}
      </ul>
      <ol>
        {recipe.method.map((m, index) => <li key={index}>{m}</li>)}
      </ol>
    </div>
  )
}