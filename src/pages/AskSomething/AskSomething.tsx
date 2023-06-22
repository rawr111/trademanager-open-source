import react, { FC, useState, useEffect } from "react";
import InfoType from "../../../electron/components/application/askInfo/InfoType";
import "./AskSomething.css";
import FamilyPin from "./FamilyPin";
import MailCode from "./MailCode";
import SmsCode from "./SmsCode";

const AskSomething: FC = () => {
  const [id, setId] = useState("");
  const [steamAccountName, setSteamAccountName] = useState("");
  const [infoType, setInfoType] = useState<InfoType>("none");

  useEffect(() => {
    window.AskFamilyPin.askFamilyPinApi
    window.AskFamilyPin.askFamilyPinApi.onGetParams(
      (event, { steamAccountName, id, infoType }) => {
        console.log(id);
        setSteamAccountName(steamAccountName);
        setId(id);
        setInfoType(infoType);
      }
    );
  });

  switch (infoType) {
    case "none":
      return <>тут пока ничего нету...</>;
    case "familyPin":
      return <FamilyPin steamAccountName={steamAccountName} id={id} />;
    case "mailCode":
      return <MailCode steamAccountName={steamAccountName} id={id} />
    case "smsCode":
      return <SmsCode steamAccountName={steamAccountName} id={id} />
    default:
      return <>Что???</>
  }
};

export default AskSomething;
