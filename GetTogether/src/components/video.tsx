import React from 'react'

function video(props : any) {

  if(!props.url){
    return(
      <div>
        loading...
      </div>
    )
  }
  return (
    <div>
      <video width='800px' height='500px' controls>
        <source src={props.url}/>
    </video>
    </div>
  )
}

export default video;
