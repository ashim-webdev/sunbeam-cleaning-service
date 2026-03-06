import React from 'react'

const Del_Res = ({text, svg, className, spanClass, onClick}) => {
  return (
    <>
      <button onClick={(e) => {
          e.stopPropagation();
          onClick?.(e)
        }} className={`button active:scale-95 transition-transform duration-200 ease-in-out shadow-inner " type="button ${className}`}>
      <span className="button__text ">{text}</span>
      <span className={`button__icon  shadow-inner ${spanClass}`}>
        {svg}
        </span>
      </button>
    </>
  )
}

export default Del_Res;



