
function NFTlistButton(props: {type: "lend" | "retrieve"}) {
const {type} = props



  return (
    <div className={type == "lend" ? "NFTlistButton backgroundBright" : "NFTlistButton"}>{type}</div>
  )
}

export default NFTlistButton