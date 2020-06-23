import React, {useState, useEffect} from "react";
import { getRecipe } from "../Gateway/query-api";
import BreadcrumbNavigator from "../Components/BreadcrumbNavigator";

export default function ViewRecipe(props) {
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    getRecipe(props.match.params.name, setRecipe)
  }, [props.match.params.name])
if (!recipe) { return <div /> }

  return (
    <div>
      <BreadcrumbNavigator recipeName={recipe.name.toLowerCase()} />
      <h2>
        {recipe.name}
      </h2>
      <p style={{fontStyle: "italic", color: "rgb(0,0,0,0.47)"}}>
        {recipe.type}
      </p>
      {recipe.ingredients ? <ul>
        {recipe.ingredients.map(i => <li key={i.name}>{i.amount} {i.measurement} {i.name} </li>)}
      </ul> : null }
      {recipe.method ? <ol>
        {recipe.method.map((m, index) => <li key={index}>{m}</li>)}
      </ol> : null}
      <p>
        {recipe.notes}
      </p>
    </div>
  )
}