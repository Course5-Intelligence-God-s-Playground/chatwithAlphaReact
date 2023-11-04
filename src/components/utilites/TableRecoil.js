import { atom } from "recoil";

export const TableDataRecoil = atom({  //expanded table view data
    key: 'TableDataRecoil',
    default: null
});

export const TableViewRecoil = atom({  //expanded table view state
    key: 'TableViewRecoil',
    default: false
});