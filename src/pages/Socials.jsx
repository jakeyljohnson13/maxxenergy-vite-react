import inLogo from '../assets/in.png';
import fbLogo from '../assets/fbb.png';
import instaLogo from '../assets/insta.png';
import xLogo from '../assets/xx.png';

export default function Socials() {
    return(
        <>

        <div className="share">
            Share Us On:
        </div>

        <div className="links-top">
            <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://www.linkedin.com/company/maxx-potential/" target="_blank" >
            <img className="image" src={inLogo} width={250}/>
            </a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=https://www.facebook.com/maxxpotentialllc" target="_blank">
            <img className="image" src={fbLogo} width={250}/>
            </a>
        </div>
        <div className="links-bot">
            <a href="https://www.instagram.com/maxxpotentialtech/?hl=en" target="_blank">
                <img className="image" src={instaLogo} width={250} />
                </a>
            <a href="https://twitter.com/intent/tweet?url=https://x.com/MaxxTechnology" target="_blank" >
                <img className="image" src={xLogo} width={250} />
                </a>

        </div>


        
        
        
        </>
    );
}