const fs = require('fs');


const readMemory = () => {
    const memoryRaw = fs.readFileSync('./memory.json', 'utf8');

    return JSON.parse(memoryRaw);
};

const saveMemory = (memory) => {
    fs.writeFileSync('./memory.json', JSON.stringify(memory, null, 4));
};

module.exports = {
    readMemory,
    saveMemory
}
