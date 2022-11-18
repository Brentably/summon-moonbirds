

function Button(props: {text: string, onClick?: React.MouseEventHandler<HTMLDivElement> | undefined, bright?: boolean, invisible?: Boolean}) {
  const {text, onClick, bright, invisible} = props

  const innerText = invisible ? "" : text

  return (
    <div onClick={onClick} className={invisible ? "invisible" : bright ? "Button backgroundBright" : "Button"}>{innerText}</div>
  )
}

export default Button