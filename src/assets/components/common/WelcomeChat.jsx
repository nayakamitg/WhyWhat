import { useTranslation } from "react-i18next";
import "../../style/chat.css"

const WelcomeChat=()=>{
    const {t}=useTranslation()
    return<>
    <h1 className="w-100 text-center pt-5 h-100">{t("welcome")}</h1>
    
    </>
}

export default WelcomeChat;