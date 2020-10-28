import React  from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import RecipesPage from "./Pages/RecipesPage"
import ViewRecipe from "./Pages/ViewRecipe";
import { Layout } from "antd";
import Notes from "./Pages/Notes";
import Header from "./Components/Header";
import './App.less'
import "./styles.scss";
const { Content } = Layout;

function App() {
  return (
    <main>
      <Switch>
        <Route exact path="/">
          <Redirect to="/recipes" />
        </Route>
        <Route exact path="/recipes" component={pageWrapper({ sectionTitle: "Recipes", children: RecipesPage })} />
        <Route exact path="/recipes/:name" component={pageWrapper({ sectionTitle: "Recipes", children: ViewRecipe })} />
        <Route path="/notes" component={pageWrapper({ sectionTitle: "Engineering Cheatsheet", children: Notes })} />
        <Route exact path="/logout" component={Logout} />
        <Route component={NoMatch} />
      </Switch>
    </main>
  );
}
function Logout(props) {
  localStorage.removeItem("emmas-recipes-token");
  props.history.goBack();
  return <div />
}
function NoMatch(props) {
  console.log(props)
  return <div>Can't find the page you're looking for </div>
}
function pageWrapper({ sectionTitle, children }) {
  return (props) => {
    return (<Layout className="layout" >
      <Header title={sectionTitle}/>
      <Content className="main-content" >
        <div className="site-layout-content">
          {children(props)}
        </div>
      </Content>
    </Layout>)
  }
}


export default App;
