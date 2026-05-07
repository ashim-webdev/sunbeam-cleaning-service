import React from 'react'
import { toast } from 'sonner'
import { useSelector } from "react-redux";


const LinearSocial = ({tiktok, x, whatsApp, telegram, noBG}) => {
  const { LightMode } = useSelector((state) => state.auth);
  // console.log(tiktok)
  
  const message = () => {
    toast.error("No available link")
  }

  const noBackground = noBG ? LightMode ? "shadow-darkSM bg-[#E8E8E8]" : "shadow-lightSM bg-[#3D3D3D]" : null
  return (
    <ul className={`
      ${noBackground}
      example-2 transition-colors duration-300 ease-in-out
    `}>
      {tiktok ?
        <li className="icon-content">
          <a
            data-social="tiktok"
            aria-label="tiktok"
            href={tiktok}
          >
            <div className="filled"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              className="bi bi-tiktok"
              viewBox="0 0 16 16"
              version="1.1"
            >
              <path
                fill="currentColor"
                d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"
              ></path>
            </svg>
          </a>
          <div className="socialTooltip z-10">Tiktok</div>
        </li>
        :
        <li className="icon-content">
          <a
            data-social="tiktok"
            aria-label="tiktok"
            onClick={message}
          >
            <div className="filled"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              className="bi bi-tiktok"
              viewBox="0 0 16 16"
              version="1.1"
            >
              <path
                fill="currentColor"
                d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"
              ></path>
            </svg>
          </a>
          <div className="socialTooltip z-10">Tiktok</div>
        </li>
      }
      


      {telegram ?
        <li className="icon-content">
          <a
            data-social="telegram"
            aria-label="telegram"
            href={telegram}
          >
            <div className="filled"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              className="bi bi-telegram"
              viewBox="0 0 16 16"
            >
              <path
                fill="currentColor"
                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09"
              ></path>
            </svg>
          </a>
          <div className="socialTooltip z-10">Telegram</div>
        </li>
        :
        <li className="icon-content">
          <a
            data-social="telegram"
            aria-label="telegram"
            onClick={message}
          >
            <div className="filled"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              className="bi bi-telegram"
              viewBox="0 0 16 16"
            >
              <path
                fill="currentColor"
                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09"
              ></path>
            </svg>
          </a>
          <div className="socialTooltip z-10">Telegram</div>
        </li>
      }
      


      {whatsApp ?
        <li className="icon-content">
          <a
            data-social="whatsApp"
            aria-label="whatsApp"
            href={whatsApp}
          >
            <div className="filled"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              className="bi bi-whatsapp"
              viewBox="0 0 16 16"
            >
              <path
                fill="currentColor"
                d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"
              ></path>
            </svg>
          </a>
          <div className="socialTooltip z-10">WhatsApp</div>
        </li>
        :
        <li className="icon-content">
          <a
            data-social="whatsApp"
            aria-label="whatsApp"
            onClick={message}
          >
            <div className="filled"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              className="bi bi-whatsapp"
              viewBox="0 0 16 16"
            >
              <path
                fill="currentColor"
                d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"
              ></path>
            </svg>
          </a>
          <div className="socialTooltip z-10">WhatsApp</div>
        </li>
      }
      
      {x ?
        <li className="icon-content">
          <a
            data-social="x"
            aria-label="x"
            href={x}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              className="bi bi-x"
              viewBox="0 0 640 640"
              ><path fill="currentColor" d="M453.2 112L523.8 112L369.6 288.2L551 528L409 528L297.7 382.6L170.5 528L99.8 528L264.7 339.5L90.8 112L236.4 112L336.9 244.9L453.2 112zM428.4 485.8L467.5 485.8L215.1 152L173.1 152L428.4 485.8z"/>
            </svg>
          </a>
          <div className="socialTooltip z-10"><i className="fa-brands fa-x-twitter text-lg"></i></div>
        </li>
        :
        <li className="icon-content">
          <a
            data-social="x"
            aria-label="x"
            onClick={message}
          >
            <div className="filled"></div>
            <svg 
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              className="bi bi-x"
              viewBox="0 0 640 640"
              ><path fill="currentColor" d="M453.2 112L523.8 112L369.6 288.2L551 528L409 528L297.7 382.6L170.5 528L99.8 528L264.7 339.5L90.8 112L236.4 112L336.9 244.9L453.2 112zM428.4 485.8L467.5 485.8L215.1 152L173.1 152L428.4 485.8z"/>
            </svg>
          </a>
          <div className="socialTooltip z-10"><i className="fa-brands fa-x-twitter text-lg"></i></div>
        </li>
      }
    </ul>
  )
}

export default LinearSocial;