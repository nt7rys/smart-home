const { io } = require("socket.io-client");
const uuid = require('uuid').v4;

const utils = require('./utils');

console.log('Start');
let memory;
const socket = io.connect('http://localhost:5000');

socket.on('connect', () => {
    console.log('Connected!');
    init();
});

socket.on('disconnect', () => {
    console.log('Disconnected!');
});

socket.on('event', (message) => {
    try {
        const messageObj = JSON.parse(message);

        if(messageObj.auth.uniqueId) {
            if(messageObj.auth.uniqueId === memory.uniqueId) {
                updateState(messageObj.action.toggle);
            }
        } else if (messageObj.auth.type) {
            if(messageObj.auth.type === memory.type) {
                updateState(messageObj.action.toggle);
            }
        } else {
            console.log('Unknown message from server!');
        }
    } catch(error) {
        console.log('invalid message format!');
    }

});

process.stdin.on('data', (data) => {
    if(memory.name === undefined) {
        memory.name = data.toString().trim();
        memory.uniqueId = uuid();
        socket.emit('register', JSON.stringify(memory));
        utils.saveMemory(memory);
    } else {
        const message = data.toString().trim();
        socket.emit('event', message);
    }
})

const init = () => {
    try {
        memory = utils.readMemory();

        if(memory.name !== undefined) {
            socket.emit('register', JSON.stringify(memory));
        }
    } catch(error) {
        memory = {
            location: 'kitchen',
            state: 'on',
            type: 'fridge',
        }
    }
};

const updateState = (state) => {
    memory.state = state;
    utils.saveMemory(memory);
    socket.emit('update', JSON.stringify({ state: memory.state }));
    console.log(`Change own state to: ${memory.state}`);
};

