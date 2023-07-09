import React, { useEffect, useState } from "react";
import "./Navigation.css";
import Button from "../../../../globalComponents/Button/Button";
import store from "../../../../store/store";
import { observer } from "mobx-react";

const Navigation = observer(() => {

  return (
    <div className="navigation">
      <div className="navigation__content">
        <div className="navigation__logo-container">
          <img src="./assets/img/Logo.svg" className="navigation__logo" />
        </div>

        <div className="navigation__buttons">
          <div className="navigation__button">
            <img className="navigation__button-img" src="./assets/img/Navigation-home.svg" />
            <div className="navigation__button-text">
              Steam accounts
            </div>
          </div>
          <div className="navigation__button">
            <img className="navigation__button-img" src="./assets/img/Navigation-proxy.svg" />
            <div className="navigation__button-text">
              Proxy
            </div>
          </div>
          <div className="navigation__button">
            <img className="navigation__button-img" src="./assets/img/Navigation-support.svg" />
            <div className="navigation__button-text">
              Support
            </div>
          </div>
        </div>
      </div>
    </div >
  );
});

export default Navigation;