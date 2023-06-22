import React from "react";
import "./Delimeter.css"

function Delimeter(props: DelimeterInterface) {
  const { marginTop, marginBottom, color } = props;

  const style = {
    marginTop: marginTop,
    marginBottom: marginBottom,
    borderColor: color
  };

  return <div className="delimeter" style={style}></div>;
}

type DelimeterInterface = {
  marginTop: string;
  marginBottom: string;
  color?: string;
};

export default Delimeter;
