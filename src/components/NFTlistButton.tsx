

function NFTListButton(props: {type: "lend" | "retrieve", onClick: React.MouseEventHandler<HTMLDivElement> | undefined}) {
  const {type, onClick} = props


  return (
    <div onClick={onClick} className={type == "lend" ? "NFTListButton backgroundBright" : "NFTListButton"}>{type}</div>
  )
}

export default NFTListButton