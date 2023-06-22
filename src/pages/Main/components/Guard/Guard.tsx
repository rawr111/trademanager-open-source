import react, { FC, useState, useEffect, useRef } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { observer } from "mobx-react";
import TableSteamAccountInterface from "../../../../../electron/interfaces/SteamAccount/TableSteamAccountInterface";
import uuid from "react-uuid";
import ReactTooltip from "react-tooltip";

const Guard: FC<{ code: string }> = observer((props) => {
  const [isCopied, setIsCopied] = useState(false);
  const timeToUpdate = 30 - ((Number(new Date()) / 1000) % 30);

  const [percent, setPercent] = useState(
    Number((((1 - timeToUpdate) / 30) * 100).toFixed(0))
  );
  const uniqueId = uuid();

  setInterval(() => {
    const timeToUpdate = 30 - ((Number(new Date()) / 1000) % 30);
    setPercent(Number(((timeToUpdate / 30) * 100).toFixed(0)));
  }, 1000);

  return (
    <div
      onMouseEnter={() => {
        setIsCopied(false);
      }}
      style={{ display: "flex", cursor: "pointer" }}
      data-tip="React-tooltip"
      data-for={uniqueId}
      onClick={() => {
        setIsCopied(true);
        navigator.clipboard.writeText(props.code);
      }}
    >
      <ReactTooltip place="top" type="dark" effect="float" id={uniqueId}>
        <span>{isCopied ? `Код скопирован!` : `Копировать Guard код`}</span>
      </ReactTooltip>
      <div
        style={{
          width: 35,
          height: 35,
          strokeWidth: 15,
          verticalAlign: "center",
          marginTop: "7px",
          marginRight: "5px",
        }}
      >
        <CircularProgressbar
          strokeWidth={20}
          text={`${(timeToUpdate % 30).toFixed(0)}s`}
          value={percent}
          styles={buildStyles({
            rotation: 1 / 2 + 1 / 8,
            strokeLinecap: "butt",
            pathColor: "#A101F6",
            trailColor: "#372447",
            textSize: "25pt",
            textColor: "#fff",
          })}
        />
      </div>
      <div style={{ lineHeight: "52px", whiteSpace: "nowrap" }}>
        {props.code}
      </div>
      <img
        src="./assets/img/copy.svg"
        style={{
          cursor: "pointer",
        }}
        alt=""
      />
    </div>
  );
});

export default Guard;
