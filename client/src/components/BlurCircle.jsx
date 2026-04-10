const BlurCircle = ({top = 'none' , left= 'none' , right = 'none', bottom = 'none' }) => {
  return (
    <div className="absolute -z-50 h-58 aspect-square rounded-full bg-primary/30 blur-3xl"
        style={{top: top , left: left , right: right, bottom: bottom}}
    ></div>
  )
}

export default BlurCircle   