import "./footer.css";
import { FaGithub } from "react-icons/fa";

export default function Footer() {

    return (
        <>
            <div className="footer-container">
                <p className='version'>Version 1.5.1</p>
                <p className='version'><FaGithub /> Dev <a className="version" target="blank" href="https://github.com/ewerton-ssh/">ewerton.ssh</a></p>
            </div>
        </>
    )
}
