const express = require('express');
const { MapleUtilsParser } = require('mapleutils-parser-js');
const app = express();
const port = 3000;

app.get('/character/:name', async (req, res) => {
    const character = await MapleUtilsParser.new().getCharacter({
        name: req.params.name,
        cash: true,
        pet: true,
        equip: true,
        symbol: true,
    });
    res.send(JSON.stringify(character, undefined, 4));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
