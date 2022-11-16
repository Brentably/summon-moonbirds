

function Button(props: {text: string, onClick: React.MouseEventHandler<HTMLDivElement> | undefined, bright?: boolean}) {
  const {text, onClick, bright} = props


  return (
    <div onClick={onClick} className={bright ? "Button backgroundBright" : "Button"}>{text}</div>
  )
}

export default Button