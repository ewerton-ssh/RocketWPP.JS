import Header from "../../components/Header";
import { useEffect, useState, useContext } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import socket from "../../services/socketio";
import {toast} from "react-toastify";
import "./chatbot.css";
import { BotContext } from "../../contexts/chatbot";

export default function ChatBot() {

    const { botId } = useContext(BotContext);

    const [main, setMain] = useState('');
    const [options, setOptions] = useState('');

    useEffect(() => {
        socket.emit("botAndOptions", botId);
        socket.on("textbot", (data) => {
            if(data === null){
                setMain(data);
            } else {
                setMain(JSON.stringify(data, null, 2));
            }
        });
        socket.on("botoptions", (data) => {
            setOptions((data));
        });

        socket.on("sucess", () => {
            toast.success("Saved!");
        });
        return () => {
            socket.off("sucess");
        };
    }, [botId]);

    async function saveDialogs(){
        socket.emit("insertText", main);
    }

    async function saveOptions(){
        socket.emit("insertOptions", options);
    }

    return (
        <>
            <Header />
            <div className="title">
                <h2>Text Bot ({botId})</h2>
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
                    <label className="botlabel">Case Options (JavaScript)</label>
                    <CodeEditor
                        value={options}
                        language="js"
                        placeholder="Please enter js code."
                        onChange={(e) => setOptions(e.target.value)}
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
                    <button className="save" onClick={saveOptions}>Save</button>
                    <label className="botlabel">For configure the bot, please README in<a className="botlabel" target="blank" href="https://github.com/ewerton-ssh/RocketWPP.JS/tree/main">here</a></label>
                    <label className="botlabel">PS: After save, please, restart connectors in main page.</label>
                </div>
            </div>
        </>
    );
}