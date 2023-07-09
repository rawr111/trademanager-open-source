import React, { useState, FC } from "react";
import Button from "../Button/Button";
import './Navigation.css'
import { observer } from 'mobx-react';

const Navigation: FC<{
  buttons: {
    text: string,
    id: string
  }[],
  selectedId: string,
  onChange: (newSelectedId: string) => void
}> = observer((props) => {

  return (
    <div className="account-creation-navigation">
      <h1>rfweasd</h1>
      <div className="account-creation-navigation__accounts">
        {
          props.buttons.map((button, index) => {
            return (
              <Button
                key={`navigation_${button.id}_${index}`}
                view="default"
                size="medium"
                color={props.selectedId === button.id ? 'gradient' : 'grey'}
                text={button.text}
                onClick={() => {
                  props.onChange(button.id);
                }}
              />
            );
          })
        }
      </div>
    </div>
  );
});

export default Navigation;
