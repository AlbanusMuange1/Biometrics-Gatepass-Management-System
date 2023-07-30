const ImageKit = require('imagekit');
const express = require("express");

const imagekit = new ImageKit({
    publicKey: "public_67S01h6rtMzxVM3CiDRS7OU4d0k=",
    privateKey: "private_pFLcFfEt4zQ+R1z/VM1ULrdrG54=",
    urlEndpoint: "https://ik.imagekit.io/kodb5krduls"
});


function imagekitAuth (req, res) {
    const result = imagekit.getAuthenticationParameters();
    console.log(result);
    res.send(result);
}

module.exports = {
    imagekitAuth
}