import React from "react";
import BreadcrumbNavigator from "../Components/BreadcrumbNavigator";
import { Layout } from "antd";
const { Content, Sider } = Layout;

export default function PageLayout({ sideBarContent, path, children }) {
  return (
    <div>
      <div className="breadcrumb-container">
        <BreadcrumbNavigator path={path} />
      </div>
      <Layout style={{ flexWrap: "wrap" }}>
        <Sider
          theme="light"
          className="panel"
        >
          {sideBarContent}
        </Sider>
        <Content className="site-layout-background"
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}>
          {children}
        </Content>
      </Layout>
    </div>
  )
}