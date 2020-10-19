import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import RecipesPage from "./Pages/RecipesPage"
import ViewRecipe from "./Pages/ViewRecipe";
import Notes from "./Pages/Notes";
import { Layout } from "antd"
import './App.less'
import "./styles.scss";
const { Header, Content } = Layout;
function App() {
  return (
    <main>
      <Switch>
        <Route exact path="/">
          <Redirect to="/recipes" />
        </Route>
        <Route exact path="/recipes" component={pageWrapper({ sectionTitle: "My Recipes", children: RecipesPage })} />
        <Route exact path="/recipes/:name" component={pageWrapper({ sectionTitle: "My Recipes", children: ViewRecipe })} />
        <Route exact path="/notes" component={pageWrapper({ sectionTitle: "My Notes", children: Notes })} />
      </Switch>
    </main>
  );
}

function pageWrapper({ sectionTitle, children }) {
  return (props) => (
    <Layout className="layout">
      <Header style={{ background: "#002329" }}>
        <h1 style={{ color: "white" }}>{sectionTitle}</h1>
      </Header>
      <Content className="main-content" >
        <div className="site-layout-content">
          {children(props)}
        </div>
      </Content>
    </Layout>
  )
}



export default App;
