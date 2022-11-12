
function NFTlistButton(props:any) {
const {text, bright} = props


  return (
    <div className={bright? "NFTlistButton backgroundBright" : "NFTlistButton"}>{text}</div>
  )
}

export default NFTlistButton