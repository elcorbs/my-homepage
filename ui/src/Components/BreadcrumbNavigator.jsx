import React from "react";
import { Breadcrumb } from "antd";
import "../Pages/pageLayout.scss";

export default function BreadcrumbNavigator({path}){
  return (
    <div>
      <Breadcrumb separator=">" className="breadcrumbs">
        <Breadcrumb.Item href="/">home</Breadcrumb.Item>
        {path.map((key, index) => {
          const route = '/' + path.slice(0, index + 1).join('/');
          return <Breadcrumb.Item key={key} href={route}>{key}</Breadcrumb.Item>
        })}
      </Breadcrumb>
    </div>
  )
}