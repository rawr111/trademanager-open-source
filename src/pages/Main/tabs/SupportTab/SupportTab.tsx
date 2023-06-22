import react, { FC } from "react";
import './SupportTab.css';

const SupportTab: FC = () => {
  return (
    <>
      <div className="main">
        <div className="list-container">
          <div className="list-content">
            <div className="support-tab">
                <h3>Поддержка</h3>
                <div className="support-btn-container">
                    <div className="support-btn" onClick={()=>{
                        window.Main.window.openLink('http://pinkest.dev')
                    }}>Наш сайт</div>
                    <div className="support-btn">vamavama998@gmail.com</div>
                    <div className="link-btn" onClick={()=>{
                        window.Main.window.openLink('https://t.me/pinkestdev');
                    }}>
                        <img src="./assets/img/telegram.svg" alt="" />
                    </div>
                    <div className="link-btn" onClick={()=>{
                        window.Main.window.openLink('https://vk.com/pinkest_dev');
                    }}>
                        <img src="./assets/img/vk.svg" alt="" />
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupportTab;
