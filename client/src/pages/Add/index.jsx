import Header from "../../components/Header";
import "./add.css";
import socket from "../../services/socketio";
import { useEffect, useState, useContext} from "react";
import { toast } from "react-toastify";
import QRCode from "react-qr-code";
import ReactLoading from 'react-loading';
import { FcApproval } from "react-icons/fc";
import RedirectTimeout from "../../components/RedirectTimeout";
import { BotContext } from "../../contexts/chatbot";

export default function Add() {
  const { chatId } = useContext(BotContext);

  const [number, setNumber] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState('');

  const handleInputChange = (e) => {
    const cleanedValue = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
    setNumber(cleanedValue);
  };

  const [department, setDepartment] = useState('');
  const data = {
    number: number,
    department: department,
  };

  useEffect(() => {
    const handleError = (data) => {
      if (data.message === 'thisRegistered') {
        toast.error("This number is already registered!");
        setLoading('');
      }
    };

    socket.on("error", handleError);

    socket.on("clientqr", (data) => {
      const { qr } = data;
      setQrCode(qr);
      setLoading('loaded');
    });

    socket.on('clientisready', (data) => {
      if (data.message === 'clientisready') {
        setLoading('success');
      }
    });

    return () => {
      socket.off("error", handleError);
    };
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (number === '' && department === '') {
      toast.error("empty field");
      setLoading('');
    } else {
      setLoading('loading');
      socket.emit("add", { data });
      chatId(data.number);
    }
  }

  return (
    <>
      <Header />
      <div className="container">
        <form className="form-profile">
          <h3>Connection</h3>
          <label>Phone Number</label>
          <input
            type="text"
            placeholder="Example: 5511222222222"
            value={number}
            onChange={handleInputChange}
          />
          <label>Department</label>
          <input
            type="text"
            placeholder="Example: SAC"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
          <div className="qrcode">
            {loading === '' ? (
              <p></p>
            ) : loading === 'loading' ? (
              <ReactLoading
                type={"spin"}
                color={'#fff'}
                height={100}
                width={100}
                className="loading"
              />
            ) : loading === 'loaded' ? (
              <QRCode
                size={256}
                bgColor="transparent"
                fgColor="#fff"
                level="L"
                style={{ height: "auto", maxWidth: "100%", width: "100%", marginTop: "20px" }}
                value={qrCode}
                viewBox={`0 0 256 256`}
              />
            ) : loading === 'success' ? (
              <>
                <div className="success">
                <FcApproval
                  style={{
                    width: "100px",
                    height: "100px",
                    marginTop: "10px",
                    marginLeft: "auto",
                    marginRight: "auto"
                  }}
                />
                </div>
                <h3>successfully connected</h3>
                <RedirectTimeout to="/bot" timeout={5000}/>
              </>
            ) : null}
          </div>
          <button
            className="loginButton"
            type="submit"
            onClick={handleSubmit}
          >
            Generate QRcode
          </button>
        </form>
      </div>
    </>
  );
}
