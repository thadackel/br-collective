import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const config=JSON.parse(await fs.readFile(new URL('../vercel.json',import.meta.url)));
const root=path.resolve(fileURLToPath(new URL('../dist/',import.meta.url)));
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml'};
export function createServer(){return http.createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://localhost');let pathname;try{pathname=decodeURIComponent(url.pathname);}catch{res.writeHead(400);res.end('Bad request');return;}
 const normalized=pathname.replace(/\/{2,}/g,'/');
 const redirect=config.redirects.find(r=>r.source===normalized);
 if(redirect){res.writeHead(redirect.statusCode,{Location:redirect.destination+url.search});res.end();return;}
 if(normalized!==pathname){res.writeHead(308,{Location:encodeURI(normalized)+url.search});res.end();return;}
 if(pathname!=='/'&&!pathname.endsWith('/')&&!path.extname(pathname)){res.writeHead(308,{Location:encodeURI(pathname) + '/'+url.search});res.end();return;}
 let file=path.resolve(root,'.'+pathname);if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(400);res.end('Bad request');return;}
 if(pathname.endsWith('/'))file=path.join(file,'index.html');
 const headerRule=config.headers[0];for(const header of headerRule.headers)res.setHeader(header.key,header.value);
 res.setHeader('X-Robots-Tag','noindex, follow');
 let data;try{data=await fs.readFile(file);}catch{res.statusCode=404;file=path.join(root,'404.html');data=await fs.readFile(file);}
 res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(req.method==='HEAD'?undefined:data);
 }catch(error){console.error(error);res.writeHead(500);res.end('Server error');}});}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){const port=Number(process.env.PORT||4173);createServer().listen(port,'127.0.0.1',()=>console.log(`Local preview: http://localhost:${port}`));}
