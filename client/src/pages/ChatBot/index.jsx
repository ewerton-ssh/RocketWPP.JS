import Header from "../../components/Header";
import { useEffect, useState, useContext } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import socket from "../../services/socketio";
import "./chatbot.css";
import { BotContext } from "../../contexts/chatbot";

export default function ChatBot() {

    const { botId } = useContext(BotContext);

    const [main, setMain] = useState('');

    useEffect(() => {
        socket.emit("botDialogs", botId);
        socket.on("textbot", (data) => {
            if(data === null){
                setMain(data);
            } else {
                setMain(JSON.stringify(data, null, 2));
            }
        });
        socket.on("reload", () => {
            window.location.reload();
        })
        return () => {};
    }, [botId]);

    function saveDialogs(){
        socket.emit("insertText", main);
    }

    return (
        <>
            <Header />
            <div className="title">
                <h2>Rocket Text Bot ({botId})</h2>
                <div className="container">
                    <label className="botlabel">Case Dialogs (JSON)</label>
                    <CodeEditor
                        value={main}
                        language="json"
                        placeholder="Please enter json code."
                        onChange={(e) => setMain(e.target.value)}
                        padding={15}
                        data-color-mode="dark"
                        className="teste"
                        style={{
                            backgroundColor: '#282a37',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                        }}
                    />
                    <button className="save" onClick={saveDialogs}>Save</button>
                    <label className="botlabel">For configure the bot, please README in<a className="botlabel" target="blank" href="https://github.com/ewerton-ssh/RocketWPP.JS/tree/main">here</a></label>
                    <label className="botlabel">PS: After save, please, restart connectors in main page.</label>
                    <img 
                        style={{
                            maxWidth: '15vh',
                            marginRight: '10px',
                            marginLeft: '5px',
                            marginTop: '50px'
                        }} 
                        src="https://github.com/baptisteArno/typebot.io/raw/main/.github/images/logo-dark.png">
                    </img>
                    <label className="botlabel">TypeBot bot link must be the same as connector number, exemple:</label>
                    <label className="botlabel">http://localhost:3006/{botId}</label>
                </div>
            </div>
        </>
    );
}
