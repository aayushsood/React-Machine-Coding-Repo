import React, {createContext, useState, useEffect} from 'react';
import './contextProvider.css'
export const ToastContext = createContext<IValues>({
    showToast:false,
    setShowToast:()=>{},
    properties:{
        message:"Toast Message",
        rightPos:"10px",
        topPos:"50px",
        delay:1000,
    },
    setProperties:()=>{}
});

interface IProps{
    children?: React.ReactNode;
}

interface IProperties{
    message?:string;
    rightPos?:string;
    topPos?:string;
    delay?:number;
}

interface IValues{
    showToast:boolean;
    setShowToast:React.Dispatch<React.SetStateAction<boolean>>;
    properties:IProperties;
    setProperties:React.Dispatch<React.SetStateAction<IProperties>>;
}



const ToastProvider:React.FC<IProps> = ({children}) =>{
    const [showToast, setShowToast] = useState<boolean>(false);
    const [properties, setProperties] = useState<IProperties>({
        message:"Toast Message",
        rightPos:"10px",
        topPos:"50px",
        delay:1000
    });

    console.log(showToast, 'this is show toast');

    useEffect(()=>{
        let timerId:ReturnType<typeof setTimeout>|undefined;
        if(showToast){
             timerId = setTimeout(() => {
             
               setShowToast(false);
    
             }, 
             properties.delay ? properties.delay: 1000
            );
        }

        return() => {
    if (timerId) {
      clearTimeout(timerId);
    }
  };
    },[showToast,properties.delay]);

    return (
        <ToastContext.Provider value={{showToast, setShowToast, properties, setProperties}}>
            {showToast && <div className='toastContainer' style={{
                position:"fixed",
                top:properties.topPos? properties.topPos:"50px",
                right:properties.rightPos? properties.rightPos:"10px",
            }}>
                <div className='toastContent'>
                    {properties.message?properties.message:"Toast Message"}
                </div>
            </div>}
            {children}
        </ToastContext.Provider>
    )
}


export default ToastProvider;