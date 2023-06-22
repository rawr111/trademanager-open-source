import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import "./InputImg.css";

function InputImg(props: inputImgInterface) {
  const [img, setImg] = useState("");

  const { register } = useFormContext();
  const { name } = props;

  function FindFile() {
    const input = document.getElementById("inputLogo");
    if (input != null) input.click();
  }

  function setImgPath(e: any) {
    console.log(e.target.value);
    var imgfile = e.target.files[0];

    var reader = new FileReader();
    reader.onload = function (e: any) {
      setImg(e.target.result);
    };
    reader.readAsDataURL(imgfile);
  }

  function handleFileValidation(e: any) {
    console.log(e)
    if (e.FileList != undefined) {
      if (e.FileList[0].type == "image/jpeg" || "image/png") {
        return true;
      }
      return false;
    }
    return true
  }

  return (
    <div className="input-img__container">
      <div className="input-img" onClick={() => FindFile()}>
        {img == "" ? (
          <img src="./assets/img/Photo.svg"></img>
        ) : (
          <img src={img} className="input-img__preview"></img>
        )}
      </div>

      <input
        type="file"
        id="inputLogo"
        {...register(name, {
          validate: (e) => handleFileValidation(e),
          onChange: (e) => setImgPath(e),
        })}
      />
    </div>
  );
}

interface inputImgInterface {
  name: string;
}

export default InputImg;
