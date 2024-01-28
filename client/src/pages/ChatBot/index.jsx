import Header from "../../components/Header";
import { useEffect, useState } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import socket from "../../services/socketio";
import {toast} from "react-toastify";
import "./chatbot.css";

export default function ChatBot() {

    const [main, setMain] = useState();
    const [options, setOptions] = useState();

    useEffect(() => {
        socket.emit("botAndOptions");
        socket.on("textbot", (data) => {
            setMain(JSON.stringify(data, null, 2));
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
    }, []);

    async function saveDialogs(){
        socket.emit("editDialogs", main);
    }

    async function saveOptions(){
        socket.emit("editOptions", options);
    }

    return (
        <>
            <Header />
            <div className="title">
                <h2>Text Bot</h2>
                <div className="container">
                    <label className="botlabel">Case Dialogs (JSON)</label>
                    <CodeEditor
                        value={main}
                        language="json"
                        placeholder="Please enter json code."
                        onChange={(evn) => setMain(evn.target.value)}
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
                        onChange={(evn) => setOptions(evn.target.value)}
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
                    <label className="botlabel">PS: After save, please, restart connectors in main page.</label>
                </div>
            </div>
        </>
    );
}