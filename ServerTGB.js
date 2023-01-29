const fs = require("fs")
const hapi = require("@hapi/hapi")
const hostname = "0.0.0.0"
const port = 4000
const dayfile = "./diary.json"

class entry {
    user;
    text;
    datetime;

        constructor(data) {
            this.user = data.user;
            this.text = data.text;
            this.datetime = data.datetime;
        }
}

function readtextfromfile() {
    try{
        const dataBuffer = fs.readFileSync(diaryfile)
        const data = dataBuffer.toString()
        const json = JSON.parse(data)
        return json
    } catch (e) {
        return[]
    }
}

const startApp = async () => {
    const server = hapi.server({
        port: port,
        host: hostname,
        routes: {
            cors:{
                origin: ["*"]
            }
        }
    })
    await server.start();
    console.log("Server running on %", server.info.uri);

    server.route({
        method: "Get",
        path:"/diary",
        handler: (request, reply) => {
            return readtextfromfile().reverse() 
        }
    })

    server.route({
        method:"POST",
        path: "/diary",
        handler:(request,response) => {
            const diary = readtextfromfile();
            const diarys = new entry(request.payload);
            diary.push(diarys)
            fs.writeFileSync(diaryfile, JSON.stringify(diary))
            return response.response(diarys).code(201)
        }
    })
}

startApp();