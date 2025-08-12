
export default function Socials() {
    return(
        <>

        <div className="share">
            Share Us On:
        </div>

        <div className="links-top">
            <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://www.linkedin.com/company/maxx-potential/" target="_blank" >
            <img className="image" src="src\assets\in.png" width={250}/>
            </a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=https://www.facebook.com/maxxpotentialllc" target="_blank">
            <img className="image" src="src\assets\fbb.png" width={250}/>
            </a>
        </div>
        <div className="links-bot">
            <a href="https://www.instagram.com/maxxpotentialtech/?hl=en" target="_blank">
                <img className="image" src="src\assets\insta.png" width={250} />
                </a>
            <a href="https://twitter.com/intent/tweet?url=https://x.com/MaxxTechnology" target="_blank" >
                <img className="image" src="src\assets\xx.png" width={250} />
                </a>

        </div>


        
        
        
        </>
    );
}