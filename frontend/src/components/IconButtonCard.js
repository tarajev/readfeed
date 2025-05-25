export default function IconButtonCard({ text, icon, selected, onClick}) {

    return (
        <div onClick={onClick} className={`w-20 h-20 flex flex-col justify-center items-center shadow-md border border-dark  rounded-md cursor-pointer ${selected? "bg-primary" : ""}`}>
            <img src={icon} className="w-1/2 h-1/2"></img>
            <div className="font-playfair font-medium">{text}</div>

        </div>)
}