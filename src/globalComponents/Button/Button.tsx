import React, { useState, FC } from "react";
import classNames from "classnames";
import "./Button.css";
import LoadingIcons from 'react-loading-icons'
import ReactTooltip from "react-tooltip";
import uuid from 'react-uuid';

const Button: FC<IButtonProps> = (props: IButtonProps) => {
  const [hover, setHover] = useState(false);

  const {
    isLoad,
    style,
    disabled,
    view = "default",
    color = "gradient",
    size,
    img,
    text,
    type = 'button',
    hoverImg = img,
    hoverColor = "gradient",
    className,
    onClick,
    altText
  } = props;

  const buttonClass = classNames(
    "button",
    `button--view-${view}`,
    `button--${color}`,
    `button--size-${size}`,
    `button--hoverColor-${disabled || isLoad ? color : hoverColor}`,
    `${className}`,
    {}
  );

  const uniqueId = uuid()

  return (
    <button
      style={{ cursor: disabled ? 'not-allowed' : (isLoad ? 'default' : 'pointer'), ...style }}
      disabled={disabled}
      className={buttonClass}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      type={type}
      data-tip="React-tooltip"
      data-for={uniqueId}
    >
      {
        isLoad ?
          <LoadingIcons.Bars style={{ width: '20px', height: '20px' }} /> :
          <>
            {img ? <img className="button__icon" src={hover ? hoverImg : img}></img> : null}
            {text ? <span className="button__text">{text}</span> : null}
          </>
      }
      { altText ?
      <ReactTooltip place="top" type="dark" effect="float" id={uniqueId}>
        <span>{altText}</span>
      </ReactTooltip> : <></>}
    </button>
  );
}

export type view = "icon" | "default";

export type size = "tiny" | "small" | "medium" | "large";

export type color = "grey" | "gradient" | "light-grey" | "dark-pink";

export type hoverColor = "grey" | "gradient" | "light-grey" | "dark-pink";


interface IButtonProps {
  isLoad?: boolean,
  disabled?: boolean,
  view?: view;
  size: size;
  color?: color;
  className?: string;
  hoverColor?: hoverColor;
  img?: string;
  hoverImg?: string;
  text?: string;
  type?: "button" | "submit" | "reset";
  style?: {},
  onClick?: () => void;
  isNonGuardButton?: boolean;
  altText?: string
}

export default Button;
