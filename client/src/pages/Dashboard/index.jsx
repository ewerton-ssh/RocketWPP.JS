import "./dashboard.css";
import socket from "../../services/socketio";
import { Link } from "react-router-dom";
import { FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import Header from "../../components/Header";
import { useEffect, useState, useContext } from "react";
import { TbMoodEmptyFilled } from "react-icons/tb";
import RedirectTimeout from "../../components/RedirectTimeout";
import ReactLoading from 'react-loading';
import { StatusContext } from "../../contexts/status";
import { BotContext } from "../../contexts/chatbot";
import { toast } from "react-toastify";

export default function Dashboard() {

  const [listConnectors, setListConnectors] = useState([]);
  
  const { actived } = useContext(StatusContext);
  const { chatId } = useContext(BotContext);

  useEffect(() => {
    const connectorsCallback = (data) => {
      setListConnectors(data.dataConnectors);
    }
    socket.emit("listConnectors");
    socket.on("connectors", connectorsCallback);
    return () => {
      socket.off("connectors", connectorsCallback);
    };
  }, []);

  function deleteConnector(id, number) {
    socket.emit("closeSession", {id, number});
    setTimeout(() => {
      socket.emit("deleteConnectors", { id, number });
      socket.emit("listConnectors");
      toast.error("Deleted successfully!");
    }, 10000);
  }

  function pauseConnector(sessionId) {
    console.log(sessionId)
    socket.emit("closeSession", {number: sessionId});
  }

  function reload(sessionId) {
    socket.emit("reloadSessions", {sessionId: sessionId });
  }

  return (
    <>
      <Header />
      <Link className="addlink" to="/add">
        <button className="add">Add +</button>
      </Link>
      <div className="container">
        <h2>Connectors</h2>
        <ul className="responsive-table">
          {listConnectors.length === 0 ? (
            <div className="empty">
              <h3>Empty <TbMoodEmptyFilled style={{ color: "#fff", width: "40px", height: "50px" }} /></h3>
            </div>
          ) : (
            listConnectors.map(connector => (
              <li key={connector._id} className="table-row">
                <div className="col col-1" data-label="department">Department: {connector.department}</div>
                <div className="col col-2" data-label="number">Number: {connector.number}</div>
                <div className="col col-3" data-label="status">Status: 
                  <span style={actived[connector.number] === "actived" ? { backgroundColor: "green" } : actived[connector.number] === "loading" ? { backgroundColor: "orange" } : { backgroundColor: "red" }}>
                    {actived[connector.number] === "actived" ? 'Active' : actived[connector.number] === "loading" ? 'Loading' : 'Dead'}
                  </span>
                </div>
                <div className="col col-4" data-label="editbot">
                  <button className="editbot" onClick={() => chatId(connector.number)}><Link className="editbot" to='/bot'>CHATBOT</Link></button>
                </div>
                <div className="col col-4" data-label="delete" onClick={(() => deleteConnector(connector._id, connector.number))}>
                  <div className="delete">
                  {actived[connector.number] === "loading" ?
                    <div>
                      <RedirectTimeout
                        to="/"
                        timeout={10000}
                      />
                      <ReactLoading
                        type={"spin"}
                        color={'#000'}
                        height={'20px'}
                        width={'20px'}
                      />
                    </div> 
                    :
                    <button className="delete">DELETE</button>
                  }
                  </div>
                </div>
                  {actived[connector.number] === "actived" ? 
                    <button className="pause" disabled={actived[connector.number] === "loading"} onClick={(() => pauseConnector(connector.number))}><FaPauseCircle/></button> 
                    : 
                    <button className="reload" disabled={actived[connector.number] === "loading"} onClick={(() => reload(connector.number))}><FaPlayCircle/></button>
                  }
              </li>
            )
            )
          )}
        </ul>
      </div>
    </>
  )
}