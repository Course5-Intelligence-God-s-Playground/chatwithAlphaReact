import { atom } from "recoil";

export const loginState = atom({  
    key: 'loginState',
    default: false
});

export const loginMailId = atom({  
    key: 'loginMailId',
    default: null
});
