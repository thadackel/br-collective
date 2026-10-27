import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {load} from 'cheerio';
import {createServer} from '../scripts/serve.mjs';
const origin='https://batonrougegoldandsilver.com';
const report=JSON.parse(await fs.readFile('data/build-report.json'));
const config=JSON.parse(await fs.readFile('vercel.json'));
const redirects=new Map(config.redirects.map(r=>[r.source.replace(/\/$/,''),r.destination]));
const docs=new Map();for(const p of report.generated)docs.set(p.path,load(await fs.readFile(path.join('dist',decodeURIComponent(p.path),'index.html'),'utf8')));
test('all 53 pages have unique SEO metadata, one H1 and consistent canonical URLs',()=>{
 assert.equal(docs.size,53);const titles=new Set(),descriptions=new Set();for(const [url,$]of docs){const title=$('title').text(),desc=$('meta[name=description]').attr('content');assert.ok(title.length>10,url);assert.ok(!titles.has(title),'Duplicate title '+url);titles.add(title);assert.ok(desc?.length>40,url);assert.ok(!desc.endsWith('…'),url);assert.ok(!descriptions.has(desc),'Duplicate description '+url);descriptions.add(desc);assert.equal($('h1').length,1,url);assert.equal($('link[rel=canonical]').attr('href'),origin+encodeURI(url));assert.equal($('meta[name=robots]').attr('content'),report.indexable?'index,follow':'noindex,follow');assert.ok($('main#main').length);assert.ok($('a.skip-link').length);}
});
test('every internal page link and all referenced images resolve locally',async()=>{
 const errors=[];for(const [url,$]of docs){for(const el of $('a[href],img[src],link[rel=stylesheet],script[src]').toArray()){const attr=el.tagName==='img'||el.tagName==='script'?'src':'href',href=$(el).attr(attr);if(!href||/^(tel:|mailto:|#)/.test(href))continue;const u=new URL(href,origin);if(u.origin!==origin)continue;const p=decodeURIComponent(u.pathname);const key=p==='/'?'/':p.replace(/\/$/,'')+'/';if(attr==='href'&&!path.extname(p)){if(redirects.has(p.replace(/\/$/,'')))errors.push(`${url}: internal link still uses redirect ${p}`);if(!docs.has(key))errors.push(`${url}: missing page ${p}`);}else{const file=path.join('dist',p);try{await fs.access(file);}catch{errors.push(`${url}: missing asset ${p}`);}}if(href.includes('batonrougegoldandsilver.com/wp-content'))errors.push(`${url}: old absolute upload dependency`);}}
 assert.deepEqual([...new Set(errors)],[]);
});
test('every JSON-LD block is valid and breadcrumb schema matches visible navigation',()=>{
 for(const [url,$]of docs){const graph=JSON.parse($('script[type="application/ld+json"]').text())['@graph'];assert.ok(graph.find(n=>n['@type']==='JewelryStore'));assert.ok(graph.find(n=>n['@type']==='WebSite'));const bread=graph.find(n=>n['@type']==='BreadcrumbList');if(url!=='/'){assert.ok(bread,url);assert.equal(bread.itemListElement.at(-1).item,origin+encodeURI(url));assert.equal($('.breadcrumbs [aria-current=page]').text(),$('h1').text());}if(url==='/gold-and-silver-of-louisiana-location/')assert.ok(!graph.some(n=>n['@type']==='Service'));}
});
test('sixteen restored articles retain genuine original publication dates',()=>{
 const articles=report.generated.filter(p=>p.kind==='article');assert.equal(articles.length,16);for(const p of articles){const $=docs.get(p.path),article=JSON.parse($('script[type="application/ld+json"]').text())['@graph'].find(n=>n['@type']==='BlogPosting');assert.ok(article.datePublished,p.path);assert.ok(new Date(article.datePublished).getFullYear()<=2022);assert.ok($('time[datetime]').length);assert.ok($('.archive-note').length);}
});
test('all images have alt text, intrinsic dimensions and local image URLs',()=>{for(const [url,$]of docs){for(const img of $('img').toArray()){assert.ok($(img).attr('alt')!==undefined,url);assert.ok(Number($(img).attr('width'))>0,url);assert.ok(Number($(img).attr('height'))>0,url);assert.ok($(img).attr('src').startsWith('/'),url);}}});
test('sitemap contains all canonical pages exactly once',async()=>{const $=load(await fs.readFile('dist/sitemap.xml','utf8'),{xml:true});const locs=$('loc').map((_,el)=>$(el).text()).get();assert.equal(locs.length,docs.size);assert.equal(new Set(locs).size,docs.size);for(const p of docs.keys())assert.ok(locs.includes(origin+encodeURI(p)),p);});
test('Vercel redirect rules explicitly cover both slash variants',()=>{for(const r of config.redirects){if(path.extname(r.source))continue;const alternate=r.source.endsWith('/')?r.source.slice(0,-1):r.source+'/';assert.ok(config.redirects.some(x=>x.source===alternate&&x.destination===r.destination&&x.statusCode===301),'Missing exact edge rule for '+alternate);}});
test('no analytics, fake forms, obsolete runtime bundles or unsafe inline handlers',()=>{for(const [url,$]of docs){assert.equal($('form,[onclick]').length,0,url);assert.equal($('iframe').length,['/','/gold-and-silver-of-louisiana-location/'].includes(url)?1:0,url);$('iframe').each((_,el)=>assert.equal(new URL($(el).attr('src')).hostname,'www.google.com'));assert.equal($('script[src*="_next"]').length,0,url);assert.equal($('script[src]').length,1,url);assert.equal($('a[href*="fl_builder"]').length,0,url);}});
test('HTTP routes serve every page, preserve queries in redirects and return genuine 404',async()=>{
 const server=createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base=`http://127.0.0.1:${server.address().port}`;try{
 for(const p of docs.keys()){const r=await fetch(base+encodeURI(p));assert.equal(r.status,200,p);assert.match(r.headers.get('content-type'),/text\/html/);}
 for(const r of config.redirects){for(const suffix of ['',r.source.endsWith('.xml')?'':'/']){const response=await fetch(base+r.source+suffix+'?utm_source=test',{redirect:'manual'});assert.equal(response.status,301,r.source);assert.equal(response.headers.get('location'),r.destination+'?utm_source=test');const destination=await fetch(base+r.destination);assert.equal(destination.status,200);}}
 const variant=await fetch(base+'/rare-coins?ref=test',{redirect:'manual'});assert.equal(variant.status,308);assert.equal(variant.headers.get('location'),'/rare-coins/?ref=test');
 const missing=await fetch(base+'/this-page-does-not-exist/');assert.equal(missing.status,404);assert.ok((await missing.text()).includes('noindex,follow'));
 }finally{await new Promise(resolve=>server.close(resolve));}
});
