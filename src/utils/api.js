import Config from "../../config";

export const GetCards = async(id) => {
    console.log("Get cards")
    let res = await fetch(Config.backendUrlLocal+'/cards/getAllCards');
        res = await res.json();
        console.log(res);    
    return res;
}

export const CreateCard = async(body) => {
    let res = await fetch(Config.backendUrlLocal+'/cards/createCard',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
            },
            body:JSON.stringify(body),
    }).catch(error => {throw error});
    res = await res.json();
    console.log(res);
    return res;
}

export const CreateMediaCard = async(body) => {
    let res = await fetch(Config.backendUrlLocal+'/cards/createCard',{
        method:'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',
        },
        body:JSON.stringify(body),
    })
    .catch((error) => {throw error});

    res = res.json();

    return res;
}

export const DeleteCard = async(id) => {
    console.log("id",id)
    let res = await fetch(Config.backendUrlLocal+'/cards/deleteCard/'+id,{
        method:'DELETE',
    }).catch(error => {throw error});
    res = await res.json();
    console.log(res);
    return res;
}

export const UploadFile = async(file) => {
    console.log("iasu",file);
    const formData = new FormData();

    
    for(var i=0;i<file.length;i++){
        
        formData.append('file',file[i]);
    }
    
    let res = await fetch(Config.backendUrlLocal+'/cards/uploadFile',{
        method:'POST',
        body :formData,
    }).catch(error => {throw error});
    res = await res.json();
    console.log(res);
    return res;
}

export const UpdateCard = async(body,id) => {
    console.log("UpdateCard", id , body);
    let res = await fetch(Config.backendUrlLocal+'/cards/updateCard/'+id,{
        method:'PUT',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',
        },
        body:JSON.stringify(body),
    }).catch(error => {throw error});
    res = res.json();

    return res;
}