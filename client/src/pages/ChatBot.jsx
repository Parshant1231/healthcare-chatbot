import { Link } from 'react-router-dom';
import {Header} from '../components/Header'
import { ChatIcon } from '../components/ChatIcon';
import videoSrc from '../assets/Chitti.mp4'
export const ChatBot = () => {
  return (
    <div>

      <video
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Header/>
      <ChatIcon />
    </div>

    
  );
};