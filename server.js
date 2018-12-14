
const http = require('http');
var rimraf = require('rimraf');
var url = require('url');
var fs = require('fs');

fs.mkdirSync("files"); // Cria a pasta raiz de todos os dados

function xss(string){
    p1 = string.indexOf("<");
    p2 = string.indexOf(">");
    if (p1 != -1 && p2 != -1) {
        r = string.replace("<", "").replace(">", "");
    } else {
        r = string
    }
    return r
}

function checkPath(){
    console.log("Server: Checking Paths Quantity");
    Quantility = fs.readdirSync("files");
    if (Quantility.length >= 300){
        console.log("Server: Aumont of Paths (FULL): "+String(Quantility.length));
        return "Full";
    }
    else{
        console.log("Server: Aumont of Paths (OK): "+String(Quantility.length));
        return "OK";
    }
}

function dellOld(id, mac, res){
    pastas = fs.readdirSync("files");
    for (i = 0;i < pastas.length;i++){
        macI = fs.readFileSync("files/"+pastas[i]+"/MAC.mac");
        if (mac == macI){
            rimraf("files/"+pastas[i], function () {console.log(id+":Deleted path.");})
            res.end("deleted");
            return pastas[i];
        }
    return "";
    }
}

function dellPath(id, mac, res){
    console.log("Chamando a função dellPath "+id.slice(0,id.length-1));
    pastas = fs.readdirSync("files");
    for (i = 0;i < pastas.length; i++){
        macI = String(fs.readFileSync("files/"+pastas[i]+"/MAC.mac"));
        if (macI == mac && pastas[i] == id.slice(0,id.length-1)){
            console.log(id+": Deleting path.");
            rimraf("files/"+id, function () {console.log(id+":Deleted path.");})
            res.end("deleted");
            return "";
        }
    }
    res.end("Path not found");
}

function addCookie(id, cookie, res){
    num = parseInt(fs.readFileSync("files/"+id+"/Count.ct"));
    num = num + 1;
    num = String(num);
    console.log(num);
    fs.writeFileSync("files/"+id+"/Count.ct", num);
    console.log('registrou o conter');
    fs.appendFile("files/"+id+"/Cookies.ck", num+"#"+cookie+"\n", function (err){
        if (err) console.log(err);
        console.log(id+":Added cookie "+cookie+".");
      
    res.end("");
    });
    res.end("");
}

function createDir(id, mac){
    console.log(id+":Creating directory");
    fs.mkdirSync("files/"+id);
    fs.appendFile("files/"+id+"/MAC.mac", mac, function (err){
        if (err) throw err; 
        console.log(id+":Created MAC.mac");
    });
    fs.appendFile("files/"+id+"/Cookies.ck", "", function (err){
        if (err) throw err;
        console.log(id+":Created Cookies.ck");
    });
    fs.appendFile("files/"+id+"/Count.ct", "0", function (err){
        if (err) throw err;
        console.log(id+":Created Count.ct");
    });
}

function checkSs(id, mac){
    console.log(id+":Checking session.");
    st = "No Equals"
    pastas = fs.readdirSync("files");
    for (i = 0;i <= pastas.length;i++){
        try{
            macI = String(fs.readFileSync("files/"+pastas[i]+"/MAC.mac"));
            if (macI == mac){
                console.log(id+":Found an equals session.");
                st = pastas[i]
                return pastas[i]
            }
        }
        catch(err){
            console.log("Error:"+err);
        }
    }
    console.log(id+":Didn't found an equals session.");
    return st
}

function checkCk(id, mac, res, at){
    console.log(id+": Checking for new cookies.");
    cookie = String(fs.readFileSync("files/"+id+"/Cookies.ck", "utf-8"));
    cookie = cookie.split("\n");
    if (at < cookie.length - 1){
        faltam = cookie.slice(at, cookie.length - 1);
        enviar = ""
        for (i = 0; i <= faltam.length-1;i++){
            cookie = String(faltam[i])
            tCookie = cookie.length;
            cookie = cookie.slice(2, tCookie);
            enviar += cookie+"#";
        }
        console.log(id+":New cookie(s) found.");
        res.end(enviar);
    }
    else{
        console.log(id+":No new cookie(s).");
        res.end("Nothing");

    }
}

function criar(id, mac, res){
    c = checkSs(id, mac)
    if (c != "No Equals"){
        res.end("login:"+c);
    }
    else{
        try{
            if (checkPath() == "OK"){
                createDir(id, mac);
                res.end("created");
            }
            else{
                //dellPath(id, mac, res);
                createDir(id, mac);
                res.end("created");
            }
        }
        catch(err){
            console.log("Error: "+err);
            res.end("An error.");
        }
    }
}

const server = http.createServer(function (req, res) {

    res.writeHead(200, {'Content-Type': 'text/html'});
    
    g = String(req.url).substring(1);
    
    inputs = g.split("@");
    
    for (i = 0; i < inputs.length; i++) {
        if (inputs[i].indexOf("option=") != -1) {option = xss(inputs[i].replace("option=", ""));}
        if (inputs[i].indexOf("id=") != -1) {id = xss(inputs[i].replace("id=", ""));}
        if (inputs[i].indexOf("mac=") != -1) {mac = xss(inputs[i].replace("mac=", ""));}
        if (inputs[i].indexOf("at=") != -1) {at = xss(inputs[i].replace("at=", ""));}
        if (inputs[i].indexOf("cookie=") != -1) {cookie = xss(inputs[i].replace("cookie=", ""));}
    }
    //id = xss(String(query.id));
    //mac = xss(String(query.mac));
    //at = xss(String(query.at));
    //cookie = xss(String(query.cookie));
    
    if (option == "create"){
        criar(id, mac, res);
    }
    if (option == "addCk"){
        addCookie(id, cookie, res);
    }
    if (option == "checkCk"){
        checkCk(id, mac, res, at);
    }
    if (option == "delete"){
        dellPath(id, mac, res);
    }
    if (option == "deleteOld"){
        dellOld(id, mac, res);
    }
});

server.listen(3000);
