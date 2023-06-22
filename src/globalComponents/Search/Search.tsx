import React, { FC } from "react";
import "./Search.css";

interface SearchPropsInterface {
  onChange: (value: string) => void;
}

const Search: FC<SearchPropsInterface> = (props) => {
  return (
    <div className="search">
      <img src="./assets/img/Search.svg" className="search-img"></img>
      <input
        type="text"
        className="search-input text-white-medium"
        onChange={(event) => {
          const target = event.target;
          props.onChange(target.value);
        }}
      ></input>
    </div>
  );
};

export default Search;
