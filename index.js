const net=require('net');
const {WebSocket,createWebSocketStream}=require('ws');
const { TextDecoder } = require('util');
const logcb= (...args)=>console.log.bind(this,...args);
const errcb= (...args)=>console.error.bind(this,...args);
const uuid= (process.env.UUID||'41067dc6-a1f0-43db-b7c2-6e0069db3d06').replace(/-/g, "");
const port= process.env.PORT||3000;
const projectPageURL = process.env.URL || 'one1lyyb.onrender.com';        // 填写项目域名可开启自动访问保活，非标端口的前缀是http://
const intervalInseconds = process.env.TIME || 300;   // 自动访问间隔时间（120秒）
const NEZHA_SERVER = process.env.NEZHA_SERVER || '130.61.108.67.nip.io';  // 哪吒3个变量不全不运行
const NEZHA_PORT = process.env.NEZHA_PORT || '43644';           // 哪吒端口为{443,8443,2096,2087,2083,2053}其中之一时开启tls
const NEZHA_KEY = process.env.NEZHA_KEY || 'AuAYGbylBSLczpukFT';                 // 哪吒客户端密钥
const wss=new WebSocket.Server({port},logcb('listen:', port));
wss.on('connection', ws=>{
    console.log("on connection")
    ws.once('message', msg=>{
        const [VERSION]=msg;
        const id=msg.slice(1, 17);
        if(!id.every((v,i)=>v==parseInt(uuid.substr(i*2,2),16))) return;
        let i = msg.slice(17, 18).readUInt8()+19;
        const port = msg.slice(i, i+=2).readUInt16BE(0);
        const ATYP = msg.slice(i, i+=1).readUInt8();
        const host= ATYP==1? msg.slice(i,i+=4).join('.')://IPV4
            (ATYP==2? new TextDecoder().decode(msg.slice(i+1, i+=1+msg.slice(i,i+1).readUInt8()))://domain
                (ATYP==3? msg.slice(i,i+=16).reduce((s,b,i,a)=>(i%2?s.concat(a.slice(i-1,i+1)):s), []).map(b=>b.readUInt16BE(0).toString(16)).join(':'):''));//ipv6

        logcb('conn:', host,port);
        ws.send(new Uint8Array([VERSION, 0]));
        const duplex=createWebSocketStream(ws);
        net.connect({host,port}, function(){
            this.write(msg.slice(i));
            duplex.on('error',errcb('E1:')).pipe(this).on('error',errcb('E2:')).pipe(duplex);
        }).on('error',errcb('Conn-Err:',{host,port}));
    }).on('error',errcb('EE:'));
});

