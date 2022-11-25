import SmallLoader from "./SmallLoader"


function Button(props: {text: string, onClick?: React.MouseEventHandler<HTMLDivElement> | undefined, bright?: boolean, invisible?: boolean, loading?: boolean}) {
  const {text, onClick, bright, invisible, loading} = props
  
  
  const innerText = invisible ? "" : text
  if(loading) return <div className="buttonContainer"><SmallLoader /></div>
  return (
    <div onClick={onClick} className={invisible ? "invisible" : bright ? "Button backgroundBright" : "Button"}><span style={{padding: "0 20px"}}>{innerText}</span></div>
  )
}

export default Button