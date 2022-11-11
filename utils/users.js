const users = [];


function userJoin(id, username) {
    const user = { id , username };

    users.push(user);
    
    return user;
}

// get current user 
function getCurrentUser(id) { 
    return users.find(user => user.id === id);
}

//User leaves chat
function userLeave(id){
    const index = users.findIndex(user => user.id === id);
    if(index !== -1) {
        return users.slice(index, 1)[0];
    }
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave
}