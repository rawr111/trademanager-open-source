import React, { Dispatch, SetStateAction, useEffect } from "react";
import CConfirmation from "steamcommunity/classes/CConfirmation";
import Button from "../../../globalComponents/Button/Button";
import "./SellItem.css";

interface Item { selected: boolean, confirmation: CConfirmation };

function SellItem(props: sellItemInterface) {
  const { item, onChange } = props;

  return (
    <div className="sell-item-container">
      <div className="sell-item-logo">
        <img src={item.confirmation.icon} style={{ width: "50px" }}></img>
      </div>
      <div className="sell-item-info">
        <div className="sell-item-name text-medium-white">
          {item.confirmation.title}
        </div>
        <div className="sell-item-price-container">
          <div className="sell-item-price-new text-pink-small">{item.confirmation.receiving}</div>
        </div>
        <div className="sell-item-date-container text-grey-small">
          {item.confirmation.time}
        </div>
      </div>
      <div className="sell-item-confirm-container">
        <Button
          text={item.selected ? "Отменить" : "Выбрать"}
          size="large"
          color={item.selected ? "dark-pink" : "light-grey"}
          hoverColor={item.selected ? "dark-pink" : "grey"}
          onClick={() => {
            onChange(!item.selected);
          }}
        ></Button>
      </div>
    </div>
  );
}

interface sellItemInterface {
  item: Item;
  onChange: (isSelect: boolean) => void;
}

export default SellItem;
