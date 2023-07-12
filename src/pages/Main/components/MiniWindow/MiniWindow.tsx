import react, { FC } from 'react';
import { observer } from 'mobx-react';
import "./MiniWindow.css";

interface MiniWindowInterface {
    title: string;
    width: string;
    height: string;
    maxHeight?: string;
    content: JSX.Element;
    onClose: () => void;
}

const MiniWindow: FC<MiniWindowInterface> = observer((props) => {
    return (
        <div className='dark-background' onClick={(event) => {
            const target = event.target as HTMLDivElement;
            if (target.className === 'dark-background' || target.className === 'table-settings__cross') props.onClose();
        }}>
            <div className='table-settings' style={{ width: props.width, height: props.height }}>
                <div className='table-settings__caption'>
                    <div>{props.title}</div>
                    <div className='table-settings__cross'></div>
                    </div>
                <div className='table-settings__content' style={{ height: `calc(${props.height} - 40px)`, maxHeight: `calc(${props.maxHeight} - 40px)`, overflow: 'auto', minHeight: '200px' }}>
                    {props.content}
                </div>
            </div>
        </div>
    );
});


export default MiniWindow;