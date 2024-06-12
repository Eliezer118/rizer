require('./configure');
//
const { default: makeWASocket, makeInMemoryStore, getMessageFromStore, Browsers, proto, useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, isJidBroadcast, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, getContentType, MessageRetryMap, BufferJSON } = require("@whiskeysockets/baileys")
const fs = require('fs')
const app = require("express")();

const NodeCache = require("node-cache")
const axios = require("axios")

const {
Boom
} = require('@hapi/boom')


const qrcode = require('qrcode-terminal')
//
const {
exec
 } = require('child_process')
//

const util = require('util')

const {bancodedados} = require('./bancodedados')
const { usuarioRifa } = require('./modelodobancodedados');
const { updateUser } = require('./basedb');

const MAIN_LOGGER = require('@whiskeysockets/baileys/lib/Utils/logger').default;

const logger = MAIN_LOGGER.child({});

logger.level = 'silent';

const msgRetryCounterCache = new NodeCache();

async function iniciar() {

const { version, isLatest } = await fetchLatestBaileysVersion()
const { state, saveCreds } = await useMultiFileAuthState('elizer-qrcode')


          const getBuffer = async (url, options) => {
                  try {
                          options ? options : {}
                          const res = await axios({
                                  method: "get",
                                  url,
                                  headers: {
                                          'DNT': 1,
                                          'Upgrade-Insecure-Request': 1
                                  },
                                  ...options,
                                  responseType: 'arraybuffer'
                          })
                          return res.data
                  } catch (e) {
                          console.log(`Error : ${e}`)
                  }
          }

console.log(`iniciando..`)
const ayu = makeWASocket({
version,
logger,
printQRInTerminal: true,
browser: Browsers.appropriate("Desktop"),
auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, logger) },
defaultQueryTimeoutMs: undefined,
generateHighQualityLinkPreview: false,
msgRetryCounterCache,
})


ayu.ev.on('connection.update', async (update) => {
const { connection, lastDisconnect } = update

if (connection === 'close') {

const shouldReconnect = new Boom(lastDisconnect?.error)?.output.statusCode

if(shouldReconnect) {

if(shouldReconnect == 428) {
console.log("A Conexão caiu tentando Reconectar... , se não conectar execute o comando: sh iniciar.sh")
} else if(shouldReconnect == 401) {
console.log("A CONEXÂO DO BOT FOI DESCONECTADA, RELEIA O QRCODE DENOVO PARA CONECTAR")
} else if(shouldReconnect == 515) {
console.log("Reiniciar necessario para estabilizar a conexão")
} else if(shouldReconnect == 440) {
return console.log("Reiniciando... Talvez Conflito de qrcode")
} else if(shouldReconnect == 503) {
console.log("ERRO DESCONHECIDO: 503")
} else if(shouldReconnect == 502) {
console.log("CONEXÃO QUERENDO CAIR, PROBLEMA NA REDE...")
} else if(shouldReconnect == 408) {
console.log("Conexão Lenta...")
} else {
console.log('Conexão Travada por: ', lastDisconnect?.error)
}

iniciar()
}

} else if (connection === 'open') {
console.log('Conexão Estabelecida com sucesso')
}
})

ayu.ev.on('creds.update', saveCreds)



ayu.ev.on('groups.update', async m => {
console.log(m);
})
ayu.ev.on('group-participants.update', async (num) => {
const mdata = await ayu.groupMetadata(num.id)


try {
if(num.action === 'add') {
mem = num.participants[0]

let buffx = await getBuffer(encodeURI(`https://telegra.ph/file/229166cb3788b34adfe9b.jpg`))
await ayu.sendMessage(mdata.id, { image: buffx, caption: `@${num.participants[0].split("@")[0]} Bem vindo a A&E Premiações Escolha sua cota e Boa Sorte!`, mentions: [num.participants[0]]}, {quoted: null}).then((res) => console.log(res)).catch((err) => console.log(err))
//fs.unlinkSync(ranzz)
//fs.unlinkSync(ran)
} else if(num.action === 'remove') {
return
}
} catch (e) {
console.log(e);
}
})

ayu.ev.on('messages.upsert',
 async m => {
try {
const mek = m.messages[0]
 if (!mek.key.participant) mek.key.participant = mek.key.remoteJid
 mek.key.participant = mek.key.participant.replace(/:[0-9]+/gi, "")
 if (!mek.message) return
 if (mek.key.fromMe) return
const fromMe = mek.key.fromMe
const isBot = mek.key.id.startsWith('BAE5') && mek.key.id.length === 16
const content = JSON.stringify(mek.message)
const from = mek.key.remoteJid
const type = Object.keys(mek.message).find((key) => !["senderKeyDistributionMessage", "messageContextInfo"].includes(key))
const body = (getContentType(mek.message) === 'conversation') ? mek.message.conversation : (getContentType(mek.message) == 'imageMessage') ? mek.message.imageMessage.caption : (getContentType(mek.message) == 'videoMessage') ? mek.message.videoMessage.caption : (getContentType(mek.message) == 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (getContentType(mek.message) == 'templateButtonReplyMessage') ? mek.message.templateButtonReplyMessage.selectedId : (getContentType(mek.message) == 'interactiveResponseMessage') ? (JSON.parse(mek.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson)).id : false
const budy = (type === "conversation") ?
 mek.message.conversation: (type === "extendedTextMessage") ?
 mek.message.extendedTextMessage.text: ""
const bady = mek.message.conversation ? mek.message.conversation: mek.message.imageMessage ? mek.message.imageMessage.caption: mek.message.videoMessage ? mek.message.videoMessage.caption: mek.message.extendedTextMessage ? mek.message.extendedTextMessage.text: (mek.message.listResponseMessage && mek.message.listResponseMessage.singleSelectReply.selectedRowId) ? mek.message.listResponseMessage.singleSelectReply.selectedRowId: ''
const bidy = bady.toLowerCase()
const selectedButton = (type == 'buttonsResponseMessage') ? mek.message.buttonsResponseMessage.selectedButtonId: ''
const argsButton = selectedButton.trim().split(/ +/)
const isCmd = body.startsWith(prefix)
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase(): ''
 const isMedia = (type === 'imageMessage' || type === 'videoMessage')
const isQuotedImage = type === 'extendedTextMessage' &&content.includes('imageMessage')
const isQuotedVideo = type === 'extendedTextMessage' &&content.includes('videoMessage')
const isQuotedSticker = type === 'extendedTextMessage' &&content.includes('stickerMessage')
const isQuotedAudio = type === 'extendedTextMessage' &&content.includes('audioMessage')

const args = body.trim().split(/ +/).slice(1)
const q = args.join(' ')
const isGroup = from.endsWith('@g.us')
const sender = mek.key.fromMe ? (ayu.user.id.split(':')[0]+'@s.whatsapp.net' || ayu.user.id): (mek.key.participant || mek.key.remoteJid)
const senderNumber = sender.split('@')[0]
const botNumber = ayu.user.id.split(':')[0]
const botNumberv2 = ayu.user.id.split(':')[0]+'@s.whatsapp.net'
const pushname = mek.pushName || 'sem nome'
const groupMetadata = isGroup ? await ayu.groupMetadata(from).catch(e => {}): ''
const groupName = isGroup ? groupMetadata.subject: ''
const participants = isGroup ? await groupMetadata.participants: ''
const groupAdmins = isGroup ? await participants.filter(v => v.admin !== null).map(v => v.id): ''
const groupOwner = isGroup ? groupMetadata.owner: ''
const isBotAdmins = isGroup ? groupAdmins.includes(botNumberv2): false
const isAdmins = isGroup ? groupAdmins.includes(sender): false
const groupMembers = isGroup ? groupMetadata.participants: ''
const isOwner = coderNumero.includes(senderNumber)



  
async function responder(msg) {
await ayu.sendMessage(from, { text: msg, mentions: [sender]}, { quoted: mek}).then((res) => console.log(res)).catch((err) => console.log(err))
}

if (budy.startsWith('>')) {
if (!isOwner) return
try {
 let evaled = await eval(budy.slice(2))
 if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
// if (evaled === 'undefined') responder("")
 await responder(evaled)
} catch (err) {
 await responder(String(err))
}
 }

 if (budy.startsWith('$')) {
 if (!isOwner) return
exec(budy.slice(2), (err, stdout) => {
 if (err) return responder(err)
 if (stdout) return responder(stdout)
})
 }
 
async function upBailyesimg(link) {
imgupservidor = await prepareWAMessageMedia({ image: { url: link } }, { upload: ayu.waUploadToServer })
return imgupservidor.imageMessage
}
async function upBailyesvideo(link) {
const vdupservidor = await prepareWAMessageMedia({ video: { url: link } }, { upload: ayu.waUploadToServer })
return vdupservidor.videoMessage
}


async function ftbot(img) {
await ayu.updateProfilePicture(ayu.user.id, await getBuffer(img))
}

async function verificaNome(nome) {
let users = await usuarioRifa.findOne({nome: nome});
if(users !== null) {
return users.nome;
} else {
return false;
}
}
async function verificaNumeroDaRifa(codigo) {
let users = await usuarioRifa.findOne({codigo: codigo});
if(users !== null) {
return users.codigo;
} else {
return false;
}
}
        async function verificaNumeroDaRifa2(codigo) {
        let users = await usuarioRifa.findOne({codigo: codigo});
        if(users !== null) {
        return users;
        } else {
        return false;
        }
        }
if (!isGroup && isCmd && sender) console.log(`\x1b[1;37m╭━━━━━━━━━━━━━━━━━━━━━━━━━╮\n\x1b[1;37m┃ Número: ${sender.split('@')[0]}\n\x1b[1;37m┃ Data: ${new Date()}\n\x1b[1;37m┃ Comando: ${command}\n\x1b[1;37m┃ Palavras: ${args.length}\n\x1b[1;37m╰━━━━━━━━━━━━━━━━━━━━━━━━━╯`)
if (!isGroup && !isCmd && sender) console.log(`\x1b[1;37m╭━━━━━━━━━━━━━━━━━━━━━━━━━╮\n\x1b[1;37m┃ Número: ${sender.split('@')[0]}\n\x1b[1;37m┃ Data: ${new Date()}\n\x1b[1;37m┃ Comando: Não\n\x1b[1;37m┃ Palavras: ${args.length}\n\x1b[1;37m╰━━━━━━━━━━━━━━━━━━━━━━━━━╯`)
if (isCmd && isGroup && sender) console.log(`\x1b[1;37m╭━━━━━━━━━━━━━━━━━━━━━━━━━╮\n\x1b[1;37m┃ Número: ${sender.split('@')[0]}\n\x1b[1;37m┃ Data: ${new Date()}\n\x1b[1;37m┃ Comando: ${command}\n\x1b[1;37m┃ Palavras: ${args.length}\n\x1b[1;37m┃ Grupo: ${groupName}\n\x1b[1;37m╰━━━━━━━━━━━━━━━━━━━━━━━━━╯`)
if (!isCmd && isGroup && sender) console.log(`\x1b[1;37m╭━━━━━━━━━━━━━━━━━━━━━━━━━╮\n\x1b[1;37m┃ Número: ${sender.split('@')[0]}\n\x1b[1;37m┃ Data: ${new Date()}\n\x1b[1;37m┃ Comando: Não\n\x1b[1;37m┃ Palavras: ${args.length}\n\x1b[1;37m┃ Grupo: ${groupName}\n\x1b[1;37m╰━━━━━━━━━━━━━━━━━━━━━━━━━╯`)


switch (command) {

case 'addrifa':
if (!isOwner) return responder("somente meu criador pode usar este comando")
if (!q) return responder(`um breve emxemplo de como usar o comando: ${prefix}addrifa sayo/999/reservado`)
let rifatodo = args.join(' ').replace('@', '').split('/')
if (rifatodo[2].includes('reservado')) { 
pagounao = '❌' 
} else if(rifatodo[2].includes('pago')) { 
pagounao = '✅' 
} else {
return responder("coloque como terceiro pago ou reservado")
}
const tanalista = await fs.readFileSync('basedarifa.txt', 'utf-8')
if(!tanalista.includes(rifatodo[1])) return responder("não existe esse numero na lista de rifa verifique a lista\n\n"+tanalista)
if (!/^[a-zA-Z\s]+$/.test(rifatodo[0])) return responder(`o primeiro argumento não pode ser um número, um breve exemplo de como usar o comando: ${prefix}addrifa sayo/999/reservado`)
if (!/^\d+(\.\d+)?$/.test(rifatodo[1])) return responder( `o segundo argumento não pode ser um texto, um breve exemplo de como usar o comando: ${prefix}addrifa sayo/999/reservado`)
let nomejausado = await verificaNome(rifatodo[0].replace(/[~^;,.\`]/g, ''));
let codigojausado = await verificaNumeroDaRifa(rifatodo[1]);
let nomedapss = await verificaNome(rifatodo[0].replace(/[~^;,.\`]/g, ''))
let obj1 = { nome: nomedapss, codigo: rifatodo[1].replace(/[~^;,.\`]/g, ''), pago: pagounao.replace(/[~^;,.\`]/g, '') };
if (nomejausado) return usuarioRifa.create(obj1).then((res) => responder(`nova rifa adicionada para ${nomedapss}`)).catch((err) => console.log(err))
if (codigojausado) return responder('algúem ja ocupou este número na lista, tente por outro que não esteja ocupado')
let obj = { nome: rifatodo[0].replace(/[~^;,.\`]/g, ''), codigo: rifatodo[1].replace(/[~^;,.\`]/g, ''), pago: pagounao.replace(/[~^;,.\`]/g, '') };
usuarioRifa.create(obj)
user = rifatodo[0].replace(/[~^;,.\`]/g, '')
usercode = rifatodo[1].replace(/[~^;,.\`]/g, '')
userpago = pagounao.replace(/[~^;,.\`]/g, '')
responder(`usuario ${user} adicionado com sucesso na lista da rifa, seu número da rifa é ${usercode} esta pago?: ${userpago}`)
break

 case 'removerifa':
if (!isOwner) return responder("somente meu criador pode usar este comando") 
if(!q) return responder("preciso do codigo")
let seucodeusado = await verificaNumeroDaRifa(q);
if (!seucodeusado) return responder('ninguém ocupou este codigo ainda')
await updateUser(q)
responder(`rifas de ${q} esta livre agora`)
break


case "deletarifa":
if (!isOwner) return responder("somente meu criador pode usar este comando")
await usuarioRifa.deleteMany({})
responder(`lista de rifa resetada!`)
break

case "federal":
    ayu.sendMessage(from, {text: "oi",  
    contextInfo:{  
    forwardedNewsletterMessageInfo: { 
    newsletterJid: '120363160031023229@newsletter', 
    serverMessageId: '', 
    newsletterName: 'sayo' }, 
    forwardingScore: 9999999,  
    isForwarded: true,   
    mentionedJid:[sender],  
    "externalAdReply": {  
    "showAdAttribution": true,  
    "containsAutoReply": true,
    "renderLargerThumbnail": true,  
    "title": "textoaqui", 
    "mediaType": 2,  
    "thumbnail": await getBuffer("https://tohka.tech/img/ayu.jpg"),  
    "mediaUrl": "https://www.youtube.com/watch?v=AnUq-5s4bz4",  
    "sourceUrl": "https://www.youtube.com/watch?v=AnUq-5s4bz4"
    }}}, {quoted: null, ephemeralExpiration: 24*60*100, disappearingMessagesInChat: 24*60*100})
break

case 'rifa':
listadarifadeusuarios = await usuarioRifa.find({})
const lista = await fs.readFileSync('basedarifa.txt', 'utf-8')
const lista2 = await fs.readFileSync('basedarifa2.txt', 'utf-8')
const updatedLista = lista.split('\n').map((line, index) => {
const codigo = index.toString().padStart(2, '0');
const pessoa = listadarifadeusuarios.find(pessoa => pessoa.codigo === codigo);
if (pessoa) {
return `${pessoa.codigo} - ${pessoa.nome} : ${pessoa.pago}`;
} else {
return line;
}
}).join('\n');
responder(lista2+updatedLista)
break
case 'disponivel':
listadarifadeusuarios = await usuarioRifa.find({})
const listai = await fs.readFileSync('basedarifa.txt', 'utf-8')
const listai2 = await fs.readFileSync('basedarifa2.txt', 'utf-8')
const updatedListai = listai.split('\n').map((line, index) => {
const codigoi = index.toString().padStart(2, '0');
const pessoai = listadarifadeusuarios.find(pessoa => pessoa.codigo === codigoi);
if (pessoai) {
return ``;
} else {
return line;
}
}).join('\n');
responder(listai2+updatedListai)
break
case'pix':
await ayu.sendMessage(from, { image: await getBuffer("https://telegra.ph/file/ec1b593b78c181850803d.jpg"), caption: `Pix para Pagamento:\n\n74981512604\n(_enviar comprovante apos pagamento_)`, mentions: [sender]}, {quoted: mek}).then((res) => console.log(res)).catch((err) => console.log(err))
break
      

case 'informacoes':
if(!q) return responder("preciso do codigo")
let seucodeusadok = await verificaNumeroDaRifa(q);
if (!seucodeusadok) return responder('ninguém ocupou este codigo ainda')
let seucodeusado2 = await verificaNumeroDaRifa2(q)
responder(`STATUS DA RIFA: ${seucodeusado2.codigo}\n\nPAGO:✅ PENDENTE:❌\n dono: ${seucodeusado2.nome}\n\nstatus: ${seucodeusado2.pago}`)
break

case 'regras':
regrass = await ayu.groupMetadata(from)
responder(`REGRAS!:\n\n${regrass.desc}`)
break                 
case 'link':
responder(`link do grupo!\n\nhttps://chat.whatsapp.com/${await ayu.groupInviteCode(from)}`)
break                
case 'menu':
 responder(`COMANDOS:\n\n${prefix}rifa (mostrar rifa atualizada)\n\n${prefix}addrifa (adicionar pessoa na lista de rifa)\n\n${prefix}removerifa (deixar rifa livre)\n\n${prefix}deletarifa (reiniciar lista para começar uma nova rifa)\n\n${prefix}pix (mostrar formas de pagamento)\n\n${prefix}informacoes (mostrar status da sua rifa)\n\n${prefix}regras (mostra regras do grupo)\n\n${prefix}link (manda link do grupo)\n\n${prefix}disponivel (verificar números disponíveis)`)
break

}
} catch (e) {
const isError = String(e)
console.log(isError)
}
})
}
iniciar()
bancodedados()
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("WebSite Online na porta:", port));
