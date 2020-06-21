import React from "react";
import { Breadcrumb } from "antd";

export default function BreadcrumbNavigator({recipeName}){
    return (
      <div>
        <Breadcrumb style={{ margin: '16px 0' }} separator=">">
          <Breadcrumb.Item href="/">home</Breadcrumb.Item>
          <Breadcrumb.Item href="/recipes">recipes</Breadcrumb.Item>
          {recipeName ? <Breadcrumb.Item>{recipeName}</Breadcrumb.Item> : null}
        </Breadcrumb>
      </div>
    )
}