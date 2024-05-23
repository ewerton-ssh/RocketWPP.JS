import "./footer.css";
import { FaGithub } from "react-icons/fa";

export default function Footer() {

    return (
        <>
            <div className="footer-container">
                <p className='version'>Version 3.0.0 + <img 
                        style={{
                            maxWidth: '2vh',
                            marginRight: '2px',
                            marginLeft: '0px',
                            marginTop: '2px'
                        }} 
                        src="https://ps.w.org/typebot/assets/icon-256x256.png?rev=2875440">
                    </img>Typebot</p>
                <p className='version'><FaGithub /> Dev <a className="version" target="blank" href="https://github.com/ewerton-ssh/">ewerton.ssh</a></p>
            </div>
        </>
    )
}
