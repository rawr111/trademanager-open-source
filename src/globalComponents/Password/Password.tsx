import React, { useState } from "react";
import "./Password.css";

function Password(props: IPasswordProps) {
  const [show, setShow] = useState(false);
  const { password, style, placeholder } = props;

  return (
    <div className="password" style={style}>
      <div className="password__text" style={{ maxWidth: '150px' }}>
        {password.length === 0 ? placeholder : (show ? password : password.split("").map((_) => "•"))}
      </div>
      <img
        style={{
          cursor: 'pointer'
        }}
        className="password__button"
        src="./assets/img/Password-eye.svg"
        onClick={() => {
          setShow(!show);
        }}
      ></img>
    </div>
  );
}

interface IPasswordProps {
  password: string;
  style?: React.CSSProperties;
  placeholder?: string;
}

export default Password;