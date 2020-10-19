import React from "react";
import { Breadcrumb } from "antd";

export default function BreadcrumbNavigator({path}){
  return (
    <div>
      <Breadcrumb style={{margin: '16px 0'}} separator=">">
        <Breadcrumb.Item href="/">home</Breadcrumb.Item>
        {path.map((key, index) => {
          const route = '/' + path.slice(0, index + 1).join('/');
          return <Breadcrumb.Item href={route}>{key}</Breadcrumb.Item>
        })}
      </Breadcrumb>
    </div>
  )
}