

function Button(props: {text: string, onClick?: React.MouseEventHandler<HTMLDivElement> | undefined, bright?: boolean, invisible?: Boolean}) {
  const {text, onClick, bright, invisible} = props

  const innerText = invisible ? "" : text

  return (
    <div onClick={onClick} className={invisible ? "invisible" : bright ? "Button backgroundBright" : "Button"}><span style={{margin: "0 30px"}}>{innerText}</span></div>
  )
}

export default Button