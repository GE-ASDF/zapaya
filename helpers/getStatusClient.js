
async function getStatusClient(client){
    let status = await client.getConnectionState().then((status)=>{
        return status;
    })
    return status;
}

module.exports = getStatusClient