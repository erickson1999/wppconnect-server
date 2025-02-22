import {} from 'dotenv/config'
import cors from 'cors';
import express from 'express';
import {Server} from 'http'
import {Server as Socket} from "socket.io";
import {routes} from './routes';
import path from 'path'

const app = express();
const PORT = process.env.PORT || 21465;
//Caso sua aplicação fique em algum server
//o process.env.PORT vai pegar automaticamente a porta recebida.

//SocketIO
const options = {
    cors: true,
    origins: ["*"],
}
const server = Server(app);
const io = new Socket(server, options);

app.use(cors()); //Aceita que nosso server seja acessado através de um website
app.use(express.json()); //Aceita requisições via JSON
app.use('/files', express.static(path.resolve(__dirname, '..', 'WhatsAppImages')))

app.use((req, res, next) => {
    req.io = io;
    next();
});

//SocketIO
io.on('connection', sock => {
    console.log(`ID: ${sock.id} entrou`)

    sock.on('disconnect', () => {
        console.log(`ID: ${sock.id} saiu`)
    });
});

app.use(routes);

server.listen(PORT);
console.log(`O servidor está rodando na porta ${PORT}`)