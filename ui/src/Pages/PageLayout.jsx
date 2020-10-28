import React from "react";
import BreadcrumbNavigator from "../Components/BreadcrumbNavigator";
import { Layout } from "antd";
import "./pageLayout.scss";
const { Content, Sider } = Layout;

export default function PageLayout({ sideBarContent, path, children }) {
  return (
    <div>
      <div className="breadcrumb-container">
        <BreadcrumbNavigator path={path} />
      </div>
      <Layout className="main-content">
        {sideBarContent && <Sider
          className="panel"
        >
          {sideBarContent}
        </Sider>
        }
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