class SuperMethods {
    static Sleep(ms: number){
        return new Promise((resolve)=>{
            setTimeout(resolve, ms);
        })
    }
    static TimeoutFunc = (timeout: NodeJS.Timeout, cb: () => void, startNew: boolean = true) => {
        clearTimeout(timeout);
        if (startNew) {
            const newTimeout = setTimeout(cb, 40000);
            return newTimeout;
        }
    }
}

export default SuperMethods;