const sessioIdToUserMap = new Map(); //hashmap

function setUser(id,user){
    sessioIdToUserMap.set(id,user);
}
function getUser(id){
    return sessioIdToUserMap.get(id);
}

module.exports = {
    setUser,
    getUser,
}