import { Server } from "../../utilites/ServerUrl";

const max_retry = 3;

export async function saveResponseReceived(data, number_of_retries = 0) {
    try {
        const req = await fetch(Server.saveQA, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const res = await req.json();

        if (!req.ok) {
            throw new Error('Request failed');
        }
        else{
            localStorage.setItem(`${data?.response?.id}detailsSaved`,data?.response?.id)
        }
        
    } catch (error) {
        if (number_of_retries < max_retry) {
            retryFunction(data, number_of_retries);
        } else {
            console.error('Max retries reached:', error);
        }
    }
}

function retryFunction(data, number_of_retries) {
    setTimeout(() => {
        saveResponseReceived(data, number_of_retries + 1);
    }, 1000); // Optional delay before retrying, adjust as needed
}
