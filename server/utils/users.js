//addUser(id,name,room)
//removeUser(id)
//getUser(id)
//getUserList(room)


// var user = [];
//
// var addUser = (id,name,room) => {
//     user.push({});
// }
//
// module.exports = {addUser};
// //method 1


// class Person {
//     constructor(name, age) { // chemata default
//         this.name = name; // se refera la current instance
//         this.age = age;
//     }
//
//     getUserDescription() {
//         return `${this.name} is ${this.age} year(s) old`;
//     }
// }
//
// var me = new Person('Dorin', 25);
// var description = me.getUserDescription();
// console.log(description);

class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {
        var user = {
            id: id,
            name: name,
            room: room
        };
        this.users.push(user);
        return user;
    }

    removeUser(id) {
        // var user = this.users.filter((user) => user.id === id)[0];
        var user = this.getUser(id);
        if (user) {
            this.users = this.users.filter((user) => user.id !== id);
        }
        return user;
    }

    getUser(id) {
        //return user object
        return this.users.filter((user) => user.id === id)[0]; //shorthand, e la fel ca mai jos
    }

    getUserList(room) {
        //return array of user names
        var users = this.users.filter((user) => {
            return user.room === room;
        });
        var namesArray = users.map((user) => {
            return user.name;
        });
        return namesArray;
    }
}

module.exports = {Users};