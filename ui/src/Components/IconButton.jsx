import "./styles.scss"
import React from "react";
import { Button } from "antd";

export default function IconButton({onClick, color, children, disabled}){
  return (
    <Button className="iconButton" style={{color: color ? color : "rgba(0, 0, 0, 0.65)"}} onClick={onClick} disabled={disabled}>
      {children}
    </Button>
  )
}
