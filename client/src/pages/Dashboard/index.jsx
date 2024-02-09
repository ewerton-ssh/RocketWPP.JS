import "./dashboard.css";
import socket from "../../services/socketio";
import { Link } from "react-router-dom";
import { IoReloadSharp } from "react-icons/io5";
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
  
  const { isReady, loading, setLoading } = useContext(StatusContext);
  const { chatId } = useContext(BotContext);

  useEffect(() => {
    const connectorsCallback = (data) => {
      setListConnectors(data.dataConnectors);
    }
    socket.emit("listConnectors");
    socket.on("connectors", connectorsCallback);
    socket.on("botsettings", () => {
      toast.error("Configure all bot's first!");
      setTimeout(() => {
        window.location.reload();
      }, "4000");
  })
    return () => {
      socket.off("connectors", connectorsCallback);
    };
  }, []);

  function deleteConnector(id, number) {
    socket.emit("closeSession");
    setLoading(true);
    setTimeout(() => {
      socket.emit("deleteConnectors", { id, number });
      toast.error("Deleted successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 4000);
    }, 10000);
  }

  function reload() {
    socket.emit("reloadSessions");
  }

  return (
    <>
      <Header />
      <Link className="addlink" to="/add">
        <button className="add">Add +</button>
      </Link>
      <div className="container">
        <h2>Connectors</h2>
        <button className="reload" onClick={reload} disabled={isReady} ><IoReloadSharp/></button>
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
                <div className="col col-3" data-label="status">Status: <span style={isReady && !loading ? { backgroundColor: "green" } : { backgroundColor: "red" }}>{isReady && !loading ? 'Active' : 'Dead'}</span></div>
                <div className="col col-4" data-label="editbot">
                  <button className="editbot" onClick={() => chatId(connector.number)}><Link className="editbot" to='/bot'>CHATBOT</Link></button>
                </div>
                <div className="col col-4" data-label="delete" onClick={(() => deleteConnector(connector._id, connector.number))}>
                  <div className="delete">
                  {!loading ? <button className="delete">DELETE</button> :
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
                  }
                  </div>
                </div>
              </li>
            )
            )
          )}
        </ul>
      </div>
    </>
  )
}