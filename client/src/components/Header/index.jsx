import { useContext } from "react";
import "./header.css";
import { FaWhatsapp, FaRocketchat } from "react-icons/fa";
import { AuthContext } from "../../contexts/auth";
import { Link } from "react-router-dom";

export default function Header() {

    const { signOut } = useContext(AuthContext);

    return (
        <>
            <div className="header">
                <Link to='/dashboard'>
                    <div className="h1">
                        RocketWPP.JS
                        <FaWhatsapp
                            style={{
                                marginLeft: "5px",
                                marginRight: "5px",
                                color: "#4caf50"
                            }}
                        />
                        +
                        <FaRocketchat
                            style={{
                                marginLeft:
                                    "5px",
                                color: "#bc262c"
                            }} />
                    </div>
                </Link>
                <Link to='/settings'>
                    Settings
                </Link>
                <Link to='/' onClick={signOut} >
                    Logout
                </Link>
            </div>
        </>
    )
}