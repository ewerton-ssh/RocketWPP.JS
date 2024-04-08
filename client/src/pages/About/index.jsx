import './about.css';
import Header from '../../components/Header';
import { FaGithub, FaExternalLinkSquareAlt } from "react-icons/fa";

export default function About(){
    return(
        <>
            <Header/>
            <div className='about-container'>
                <h2>About this project</h2>
                <p className='about-p'>Developed for</p>
                <p className='about-p2'> 
                    <FaGithub className='about-icon'/>
                    <a className='about-a' target="blank" href="https://github.com/ewerton-ssh/">ewerton.ssh</a>
                </p>
                <p className='about-p2'> 
                    <a className='about-a2' target="blank" href="https://github.com/ewerton-ssh/">Official repository <FaExternalLinkSquareAlt className='about-icon'/></a>
                </p>
            </div>
        </>
    )
}