import { useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';

//здесь только подключение картинок и ховеров с картинками

export const GlobalStyle = createGlobalStyle`
  .table_bottom_icon{
    background-image: url(./assets/img/MiniTriangle.svg);
    background-size: 10px;
    background-repeat: no-repeat;
    background-position: center;
  }
  #root {
    background-image: url(./assets/gradient.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .attic .buttons div:nth-child(1) {
    background-image: url(./assets/img/Cross.svg);
    background-size: 10px;
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 0px 0px 10px 0px;
  }
  .attic .buttons div:nth-child(2) {
    background-image: url(./assets/img/Square2.svg);
    background-size: 10px;
    background-repeat: no-repeat;
    background-position: center;
  }
  .attic .buttons div:nth-child(3) {
    background-image: url(./assets/img/Line5.svg);
    background-size: 10px;
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 0px 0px 0px 10px;
  }
  .form-cross {
    background-image: url(./assets/img/Cross.svg);
    background-size: 10px;
    background-repeat: no-repeat;
    background-position: center;
  }
  .header-content__buttons-container #panel_settings {
    background-image: url(./assets/img/Subtract.svg);
  }
  .header-content__buttons-container #panel_settings:hover {
    background-image: url(./assets/img/SubtractHover.svg);
  }
  .header-content__buttons-container #panel_refresh {
    background-image: url(./assets/img/Refresh.svg);
  }
  .header-content__buttons-container #panel_refresh:hover {
    background-image: url(./assets/img/RefreshHover.svg);
  }
  .panel-content__options #panel_hide {
    background-image: url(./assets/img/Hide.svg);
  }
  .panel-content__options #panel_hide:hover {
    background-image: url(./assets/img/HideHover.svg);
  }
  #navigation-main {
    background-image: url(./assets/img/Home.svg);
  }
  #navigation-main-hover {
    background-image: url(./assets/img/HomeHover.svg);
  }
  #navigation-steam-accounts {
    background-image: url(./assets/img/SteamAccount.svg);
  }
  #navigation-steam-accounts-hover {
    background-image: url(./assets/img/SteamAccountHover.svg);
  }
  #navigation-proxy {
    background-image: url(./assets/img/Proxy.svg);
  }
  #navigation-proxy-hover {
    background-image: url(./assets/img/ProxyHover.svg);
  }
  #navigation-extension {
    background-image: url(./assets/img/Extension.svg);
  }
  #navigation-extension-hover {
    background-image: url(./assets/img/ExtensionHover.svg);
  }
  #navigation-support {
    background-image: url(./assets/img/Support.svg);
  }
  #navigation-support-hover {
    background-image: url(./assets/img/SupportHover.svg);
  }
  .checkbox-default {
    background-image: url(./assets/img/checkbox.svg);
  }
  .checkbox-default__proxy {
    background-image: url(./assets/img/checkboxProxy.svg);
  }
  .checkbox-checked {
    background-image: url(./assets/img/checkboxChecked.svg);
  }
  .checkbox-circle-checked {
    background-image: url(./assets/img/checkboxCircleChecked.svg);
  }
  .checkbox-circle-default {
    background-image: url(./assets/img/checkboxCircle.svg);
  }
`