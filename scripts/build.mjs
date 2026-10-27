import fs from 'node:fs/promises';
import path from 'node:path';
import {load} from 'cheerio';
import sharp from 'sharp';

const root=process.cwd(), out=path.join(root,'dist');
const readJSON=async p=>JSON.parse((await fs.readFile(p,'utf8')).replace(/^\uFEFF/,''));
const pages=await readJSON('data/pages.json');
const template=await readJSON('data/template.json');
const config=await readJSON('vercel.json');
const origin='https://batonrougegoldandsilver.com';
const production=process.env.VERCEL_ENV==='production';
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalized=p=>{const decoded=decodeURIComponent(p).replace(/\\/g,'/').replace(/\/{2,}/g,'/');return decoded==='/'?'/':decoded.replace(/\/$/,'')+'/'};
const redirects=new Map(config.redirects.map(r=>[normalized(r.source),r.destination]));
const titles={
 '/':'Buy & Sell Gold, Silver, Jewelry & Rare Coins in Baton Rouge',
 '/rare-coins/':'Buy & Sell Rare Coins in Baton Rouge',
 '/bullion/':'Buy & Sell Gold and Silver Bullion in Baton Rouge',
 '/sell-gold-coins/':'Buy & Sell Gold Coins in Baton Rouge',
 '/sell-silver-coins/':'Buy & Sell Silver Coins in Baton Rouge',
 '/sell-silverware/':'Sell Sterling Silverware in Baton Rouge',
 '/antique-jewelry/':'Antique & Estate Jewelry in Baton Rouge',
 '/designer-jewelry/':'Buy & Sell Designer Jewelry in Baton Rouge',
 '/notes-currency/':'Buy & Sell Paper Currency in Baton Rouge',
 '/jewelry-repairs/':'Jewelry Repair in Baton Rouge',
 '/watch-battery-replacement/':'Watch Battery Replacement & Repair in Baton Rouge',
 '/jewelry-engraving/':'Jewelry Engraving in Baton Rouge',
 '/bottle-and-glass-engraving/':'Bottle & Glass Engraving in Baton Rouge',
 '/gold-and-silver-of-louisiana-location/':'Visit Our Baton Rouge Showroom',
 '/blog-posts/':'Gold, Silver & Jewelry Articles',
 '/buying-coins/':'Buying Gold, Silver & Platinum Coins in Baton Rouge',
 '/pmg-dealer/':'Paper Money & PMG Dealer Services in Baton Rouge',
 '/gold-and-silver-of-louisiana/':'About Gold & Silver of Louisiana',
};
const descriptions={
 '/':'Buy or sell gold, silver, rare coins and jewelry in Baton Rouge. Visit Gold & Silver of Louisiana at CitiPlace for a no-obligation evaluation.',
 '/rare-coins/':'Buy or sell rare U.S. and world coins in Baton Rouge. Visit Gold & Silver of Louisiana at CitiPlace for a professional, no-obligation evaluation.',
 '/bullion/':'Buy or sell gold, silver, platinum and palladium bullion in Baton Rouge. Discuss coins, bars and current availability with our CitiPlace team.',
 '/sell-gold-coins/':'Buy or sell gold coins in Baton Rouge. Our team considers precious-metal content, authenticity, condition and collector demand during your evaluation.',
 '/sell-silver-coins/':'Buy or sell silver coins and collections in Baton Rouge. Bring your bullion and collectible coins to CitiPlace for a no-obligation evaluation.',
 '/baton-rouge-platinum-buyer/':'Sell platinum jewelry, coins, bullion and scrap in Baton Rouge. Visit CitiPlace for testing and a clear explanation of the factors behind your offer.',
 '/notes-currency/':'Buy or sell collectible paper money in Baton Rouge. Our team evaluates age, rarity, condition, serial numbers and collector demand.',
 '/designer-jewelry/':'Buy or sell signed and designer jewelry in Baton Rouge. Visit our CitiPlace showroom to discuss your pieces or browse our changing selection.',
 '/antique-jewelry/':'Buy or sell antique, vintage and estate jewelry in Baton Rouge. Visit Gold & Silver of Louisiana at CitiPlace for a no-obligation evaluation.',
 '/costume-jewelry/':'Explore vintage and collectible costume jewelry in Baton Rouge. Bring signed pieces or collections to our CitiPlace showroom for an evaluation.',
 '/sell-used-or-scrap-jewelry/':'Sell used, broken or scrap gold, silver and platinum jewelry in Baton Rouge. Visit CitiPlace for a no-obligation evaluation of your items.',
 '/buying-and-selling-watches-in-baton-rouge/':'Buy or sell designer, luxury and vintage watches in Baton Rouge. Discuss condition, model, documentation and current availability with our team.',
 '/watch-battery-replacement/':'Visit our Baton Rouge showroom for watch battery replacement and repair assessment. Call ahead to discuss your watch and service needs.',
 '/sell-silverware/':'Sell sterling silver flatware and serving pieces in Baton Rouge. Bring your items to Gold & Silver of Louisiana at CitiPlace for an evaluation.',
 '/art-home-decor-antiques/':'Explore art, antiques and distinctive home decor at our Baton Rouge showroom. Contact our team to discuss items or consignment services.',
 '/jewelry-repairs/':'Discuss jewelry repair and restoration with our Baton Rouge team. Bring your piece to CitiPlace for an assessment of the work it needs.',
 '/rhodium-plating/':'Ask about rhodium plating for white-gold jewelry in Baton Rouge. Our team can assess your piece and explain maintenance and service options.',
 '/jewelry-engraving/':'Personalize rings, pendants, watches and gifts with jewelry engraving in Baton Rouge. Contact our CitiPlace showroom to discuss your design.',
 '/bottle-and-glass-engraving/':'Personalize bottles, glassware and crystal in Baton Rouge. Discuss engraving for weddings, gifts, awards and corporate events with our team.',
 '/custom-jewelry-designs/':'Discuss custom jewelry designs in Baton Rouge. Work with our team on a personal ring, pendant or other piece that suits your vision and budget.',
 '/monogram-jewelry/':'Explore personalized monogram jewelry in Baton Rouge. Contact our CitiPlace showroom to discuss materials, lettering and design options.',
 '/gold-and-silver-of-louisiana-location/':'Visit 2561 CitiPlace Ct., Suite 375, Baton Rouge. Open Monday–Friday 10–6 and Saturday 10–4:30. Call (225) 366-1000 for questions or directions.',
 '/how-we-buy-gold-and-silver/':'Learn what to expect when selling gold and silver in Baton Rouge, from purity and weight testing to market factors and a no-obligation offer.',
 '/baton-rouge-gold-buyers/':'Sell gold, silver, platinum and palladium in Baton Rouge. Visit CitiPlace for a clear evaluation of purity, weight and current market factors.',
 '/blog-posts/':'Read our articles about coins, gold, silver, jewelry and engraving. Explore collecting guides and dated market commentary from our archive.',
 '/foreign-coins-currency-dealer/':'Bring foreign coins and collectible paper money to our Baton Rouge showroom. We evaluate metal content, age, rarity, condition and demand.',
 '/u-s-90-silver-coins/':'Learn about U.S. 90% silver coins and discuss buying or selling your collection at Gold & Silver of Louisiana in Baton Rouge.',
 '/rose-gold/':'Learn about rose gold and discuss buying, selling or repairing rose-gold jewelry with our team at CitiPlace in Baton Rouge.',
 '/selling-and-buying-diamonds/':'Buy or sell loose and mounted diamonds in Baton Rouge. Discuss grading, condition and market factors with our CitiPlace jewelry team.',
 '/colored-diamonds/':'Learn about fancy colored diamonds and the factors that influence value, including color, rarity, size and quality, with our Baton Rouge team.',
 '/engraving-services/':'Explore jewelry, bottle, glass and gift engraving in Baton Rouge. Contact our CitiPlace showroom to discuss your project and available options.',
 '/buying-coins/':'Learn about buying gold, silver and platinum coins in Baton Rouge. Discuss bullion, collectible coins and your collecting goals with our team.',
 '/consignment-services/':'Discuss consignment services for jewelry, art and antiques in Baton Rouge. Contact our CitiPlace showroom to learn which items we can consider.',
 '/gold-and-silver-of-louisiana/':'Meet Gold & Silver of Louisiana, serving buyers and sellers of precious metals, coins and jewelry from our CitiPlace showroom in Baton Rouge.',
 '/pmg-dealer/':'Discuss collectible paper currency and PMG-related services with Gold & Silver of Louisiana in Baton Rouge. Call ahead for current service details.',
 '/silver-dollars/':'Explore silver dollars and discuss buying or selling your coins in Baton Rouge. Our team considers metal value, date, condition and collector demand.',
 '/turquoise/':'Learn about turquoise jewelry and discuss your pieces with Gold & Silver of Louisiana at our CitiPlace showroom in Baton Rouge.',
};

// The build never fetches live content. Original uploads remain available at their old paths.
await fs.mkdir(out,{recursive:true});
await fs.cp('public',out,{recursive:true});
const imageInfo=new Map();
async function optimize(dir){for(const entry of await fs.readdir(dir,{withFileTypes:true})){const source=path.join(dir,entry.name);if(entry.isDirectory()){await optimize(source);continue;}if(!/\.(jpe?g|png)$/i.test(source))continue;const relative='/'+path.relative(path.join(root,'public'),source).split(path.sep).join('/');const file=path.join(out,relative),target=file.replace(/\.(jpe?g|png)$/i,'.webp');if((await fs.stat(target).catch(()=>null))?.mtimeMs < (await fs.stat(source)).mtimeMs || !await fs.stat(target).catch(()=>false)){await sharp(source).rotate().resize({width:1200,withoutEnlargement:true}).webp({quality:80}).toFile(target);}const meta=await sharp(target).metadata();imageInfo.set(relative,{src:relative.replace(/\.(jpe?g|png)$/i,'.webp'),width:meta.width,height:meta.height});}}
await optimize(path.join(root,'public'));
await sharp('public/gold-silver-louisiana-logo.png').resize({width:440,withoutEnlargement:true}).webp({quality:85}).toFile(path.join(out,'brand.webp'));
const brand=await sharp(path.join(out,'brand.webp')).metadata();
imageInfo.set('/gold-silver-louisiana-logo.png',{src:'/brand.webp',width:brand.width,height:brand.height});
const svg=`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#f4f0e6"/><rect x="0" y="0" width="18" height="630" fill="#9d7c43"/><text x="80" y="200" font-family="Georgia" font-size="67" fill="#20291f">Gold &amp; Silver</text><text x="84" y="255" font-family="Georgia" font-size="38" fill="#78623c">of Louisiana</text><text x="84" y="380" font-family="Arial" font-size="34" fill="#20291f">Coins. Jewelry. Precious metals.</text><text x="84" y="450" font-family="Arial" font-size="28" fill="#495144">Visit our Baton Rouge showroom at CitiPlace.</text><text x="84" y="550" font-family="Arial" font-size="26" fill="#495144">batonrougegoldandsilver.com</text></svg>`;
await sharp(Buffer.from(svg)).png().toFile(path.join(out,'og.png'));
await sharp('public/gold-silver-louisiana-logo.png').resize(64,64,{fit:'contain',background:'#f4f0e6'}).png().toFile(path.join(out,'favicon.png'));

const credentials='<div class="credential-logos credential-text" aria-label="Professional credentials"><span>BBB Accredited Business</span><span>NGC Authorized Dealer</span><span>PMG Authorized Dealer</span><span>GIA Graduate on Staff</span><span>ANA Member</span></div>';
const maps='https://www.google.com/maps/search/?api=1&query=2561+Citiplace+Ct+STE+375+Baton+Rouge+LA+70808';
function repair(html,page){const $=load(html,null,false);
 if(page?.path!=='/')$('.credential-logos').each((_,el)=>$(el).replaceWith(credentials));
 $('script,style,form,object,embed').remove();
 $('br').after(' ');
 $('strong,b').each((_,el)=>{if($(el).text().length>140)$(el).replaceWith($(el).html());});
 if(page?.path!=='/')$('iframe').each((_,el)=>$(el).replaceWith(`<a class="map-preview" href="${escape(maps)}" aria-label="Open directions to our Baton Rouge showroom in Google Maps"><span class="map-pin" aria-hidden="true">◎</span><strong>CitiPlace · Baton Rouge</strong><span>2561 CitiPlace Ct., Suite 375</span><span class="map-direction">Open in Google Maps ↗</span></a>`));
 $('[style], [onclick]').removeAttr('style').removeAttr('onclick');
 $('a[href]').each((_,el)=>{let href=$(el).attr('href').replace(/\\/g,'').trim();if(href.startsWith('#')||/^(tel:|mailto:)/i.test(href))return;try{const u=new URL(href,origin);if(u.origin===origin||u.hostname==='br-collective.vercel.app'){u.searchParams.delete('fl_builder');let p=u.pathname;if(!/\.[a-z0-9]+$/i.test(p)){p=normalized(p);p=redirects.get(p)||p;}$(el).attr('href',p+u.search+u.hash);}else{$(el).attr('rel','noopener noreferrer');}}catch{$(el).removeAttr('href');}});
 $('img').each((_,el)=>{const im=$(el);let src=im.attr('src')||'';try{const u=new URL(src,origin);if(u.hostname===new URL(origin).hostname||src.startsWith('/'))src=decodeURIComponent(u.pathname);}catch{}const optimized=imageInfo.get(src);if(optimized)im.attr({src:optimized.src,width:optimized.width,height:optimized.height});else im.attr('src',src);im.removeAttr('srcset').removeAttr('sizes').removeAttr('fetchpriority');im.attr({decoding:'async',loading:im.hasClass('brand-logo')?'eager':'lazy'});if(!im.attr('alt')&&!im.hasClass('hero-company-logo'))im.attr('alt',page?.title?`${page.title} at Gold & Silver of Louisiana`:'Gold & Silver of Louisiana');});
 $('a[href^="tel:"]').attr('href','tel:+12253661000');
 return $.html();}

const header=repair(template.header);
const $header=load(header,null,false);$header('header').prepend('<a class="skip-link" href="#main">Skip to content</a>');
const footer=repair(template.footer).replace('© 2026','© '+new Date().getUTCFullYear());
const servicePages=pages.filter(p=>p.kind==='service'&&p.path!=='/');
const serviceLinks=servicePages.map(p=>`<a href="${escape(p.path)}">${escape(titles[p.path]||p.title)}</a>`).join('');
const footerExtra=`<section class="service-directory" aria-label="Explore our services"><details><summary>Explore all services &amp; information</summary><div>${serviceLinks}<a href="/blog-posts/">Articles &amp; collecting guides</a></div></details></section>`;
const mobileCall='<a class="mobile-call" href="tel:+12253661000">Call our Baton Rouge showroom <span>(225) 366-1000</span></a>';
const contact='<section class="inline-contact"><h2>Talk with our Baton Rouge team</h2><p>Visit 2561 CitiPlace Ct., Suite 375, or call ahead to discuss your items and current availability.</p><div class="hero-actions"><a class="primary" href="tel:+12253661000">Call (225) 366-1000</a><a class="text-link" href="/gold-and-silver-of-louisiana-location/">Hours &amp; directions →</a></div></section>';
const business={'@type':'JewelryStore','@id':origin+'/#business',name:'Gold & Silver of Louisiana',alternateName:'Baton Rouge Gold & Silver',url:origin+'/',image:origin+'/og.png',logo:origin+'/brand.webp',telephone:'+1-225-366-1000',email:'goldandsilverla@gmail.com',address:{'@type':'PostalAddress',streetAddress:'2561 CitiPlace Ct., Suite 375',addressLocality:'Baton Rouge',addressRegion:'LA',postalCode:'70808',addressCountry:'US'},areaServed:{'@type':'City',name:'Baton Rouge'},openingHoursSpecification:[{'@type':'OpeningHoursSpecification',dayOfWeek:['Monday','Tuesday','Wednesday','Thursday','Friday'],opens:'10:00',closes:'18:00'},{'@type':'OpeningHoursSpecification',dayOfWeek:'Saturday',opens:'10:00',closes:'16:30'}]};
const website={'@type':'WebSite','@id':origin+'/#website',url:origin+'/',name:business.name,publisher:{'@id':business['@id']},inLanguage:'en-US'};
const navRelated={
 '/rare-coins/':['/sell-gold-coins/','/sell-silver-coins/','/silver-dollars/','/foreign-coins-currency-dealer/'],
 '/bullion/':['/buying-coins/','/sell-gold-coins/','/sell-silver-coins/','/baton-rouge-platinum-buyer/'],
 '/designer-jewelry/':['/antique-jewelry/','/selling-and-buying-diamonds/','/designer-jewelry-in-a-secondary-market/'],
 '/art-home-decor-antiques/':['/consignment-services/','/sell-silverware/','/antique-jewelry/'],
};
function related(p){const list=navRelated[p.path]|| (p.kind==='article'?['/rare-coins/','/baton-rouge-gold-buyers/','/blog-posts/']:[]);return list.length?`<nav class="related" aria-label="Related information"><h2>Explore more</h2>${list.map(url=>`<a href="${url}">${escape(titles[url]||pages.find(x=>x.path===url)?.title||url)} →</a>`).join('')}</nav>`:'';}
function articleHTML(p){const date=p.published?new Date(p.published).toLocaleDateString('en-US',{timeZone:'America/Chicago',year:'numeric',month:'long',day:'numeric'}):'';return `<section class="detail-hero"><p class="eyebrow">From our archive</p><h1>${escape(p.title)}</h1>${date?`<p class="article-date">Originally published <time datetime="${escape(p.published)}">${date}</time></p>`:''}<p class="archive-note">This article reflects the information and market conditions at its original publication date.</p></section><section class="detail-content"><article class="original-copy">${p.html}</article><aside><p class="eyebrow">Visit CitiPlace</p><h2>Local expertise.<br>Personal service.</h2><p>Questions about buying or selling today?</p><a class="primary" href="tel:+12253661000">Call our team</a></aside></section>`;}
const generated=[];
for(const p of pages){p.path=normalized(p.path);p.title=titles[p.path]||p.title;p.description=descriptions[p.path]||(p.kind==='article'?`Read “${p.title}” from the Gold & Silver of Louisiana archive, with information for coin, jewelry and precious-metals buyers and sellers.`:p.description);if(!p.description||p.description.endsWith('…'))throw new Error('Missing complete description '+p.path);
 let content=p.kind==='article'?articleHTML(p):p.html;
 const $=load(repair(content,p),null,false);
 if(p.path==='/'){$('.hero-lead').text($('.hero-lead').text().replace('gold, silver, platinum','gold, silver, jewelry, platinum'));}
 else {$('h1').first().text(p.title);$('h1').slice(1).each((_,el)=>$(el).replaceWith(`<h2>${escape($(el).text())}</h2>`));}
 if(p.path==='/rare-coins/'){$('article').html(`<p>Rare coins can have collector value beyond their precious-metal content. At Gold &amp; Silver of Louisiana, we help buyers and sellers evaluate rare U.S. and world coins in Baton Rouge.</p><h2>What we consider</h2><p>Authenticity, date, mint mark, condition, scarcity and collector demand can all influence a coin’s value. Bullion value and numismatic value are different, and we explain the relevant factors before discussing an offer.</p><h2>Bring individual coins or a collection</h2><p>Bring your coins, original holders, grading certificates and any documentation you have. Certified coins can stay in their holders. Please avoid cleaning or polishing coins before your visit: doing so can affect their collectible value.</p><h2>A clear evaluation process</h2><p>Our team examines your items, researches current market information and discusses buying or selling options with you. There is no obligation to sell. Call ahead if you have a large collection or a particular coin you would like to purchase.</p><div class="coin-gallery"><img src="/wp-content/uploads/2022/07/GSAdollar.jpg" alt="Encapsulated GSA silver dollar" width="248" height="273"><img src="/wp-content/uploads/2012/10/IMG_1446.jpg" alt="Coins displayed at Gold &amp; Silver of Louisiana" width="300" height="200"></div>`);}
 if(p.path==='/rare-and-numismatic-coins/'){$('article').html(`<p>Numismatics is the study and collection of coins and currency. A collectible coin’s value may reflect its date, mint mark, condition, scarcity and demand as well as its precious-metal content.</p><p>Age alone does not make a coin rare. Some older coins were produced in large quantities, while certain dates, mint marks or varieties can be harder to find. Grading services such as NGC, PCGS and ANACS assess authenticity and condition; a coin does not need to be certified to be collectible.</p><h2>Bullion and collector value</h2><p>Bullion coins are commonly traded for their metal content and market premium. Some examples of otherwise common bullion issues may also attract collector interest. Morgan and Peace dollars, pre-1933 U.S. gold coins and world coins can have both metal value and numismatic value, depending on the individual piece.</p><p>Bring your coins and any holders or documentation to our Baton Rouge showroom. We can discuss the characteristics of your collection and explain the factors behind an evaluation. Do not clean or polish coins before bringing them in.</p><p><a href="/rare-coins/">Learn about buying and selling rare coins in Baton Rouge →</a></p>`);}
 if(p.path==='/gold-and-silver-of-louisiana-location/'){$('article').html(`<h2>Find us at CitiPlace</h2><p>2561 CitiPlace Ct., Suite 375<br>Baton Rouge, LA 70808</p><p>Our showroom is located off Corporate Boulevard in CitiPlace.</p><h2>Showroom hours</h2><dl class="hours"><dt>Monday–Friday</dt><dd>10:00 AM–6:00 PM</dd><dt>Saturday</dt><dd>10:00 AM–4:30 PM</dd><dt>Sunday</dt><dd>Closed</dd></dl><p>Call ahead with questions about your visit or holiday hours.</p><div class="hero-actions"><a class="primary" href="${escape(maps)}">Get directions ↗</a><a class="text-link" href="tel:+12253661000">(225) 366-1000</a></div><h2>Contact our team</h2><p><a href="mailto:goldandsilverla@gmail.com">goldandsilverla@gmail.com</a></p><p>Bring the items you would like evaluated, together with any grading reports, original packaging or documentation you have. Contact us before travelling with a large collection or a specific service request.</p>`);}
 if(p.path==='/blog-posts/'){$('article').html(`<p>Collecting guides, jewelry information and historical market commentary from Gold &amp; Silver of Louisiana.</p><div class="article-list">${pages.filter(x=>x.kind==='article').sort((a,b)=>(b.published||'').localeCompare(a.published||'')).map(x=>`<article><p class="eyebrow">${x.published?new Date(x.published).getUTCFullYear():'Archive'}</p><h2><a href="${escape(x.path)}">${escape(x.title)}</a></h2><a class="text-link" href="${escape(x.path)}">Read article →</a></article>`).join('')}</div>`);}
 if(p.path==='/pmg-dealer/'){$('article').append('<h2>Discuss your paper currency</h2><p>Bring your notes, existing holders and any documentation to our Baton Rouge showroom. Call ahead to discuss current services, submission options and any applicable fees before making plans.</p><p><a href="/notes-currency/">Learn about collectible paper currency →</a></p>');}
 let body=repair($.html(),p);const $final=load(body,null,false);if(p.path!=='/'){$final('.back-link').remove();$final.root().prepend(`<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span>${p.kind==='article'?'<a href="/blog-posts/">Articles</a><span aria-hidden="true">/</span>':''}<span aria-current="page">${escape(p.title)}</span></nav>`);}
 body=$final.html()+related(p)+(p.path==='/'?'':contact);
 const url=origin+encodeURI(p.path), graph=[business,website,{'@type':p.kind==='blog'?'Blog':p.path==='/gold-and-silver-of-louisiana-location/'?'ContactPage':'WebPage','@id':url+'#page',url,name:p.title,description:p.description,isPartOf:{'@id':website['@id']},about:{'@id':business['@id']}}];
 if(p.path!=='/'){const crumbs=[{'@type':'ListItem',position:1,name:'Home',item:origin+'/'}];if(p.kind==='article')crumbs.push({'@type':'ListItem',position:2,name:'Articles',item:origin+'/blog-posts/'});crumbs.push({'@type':'ListItem',position:crumbs.length+1,name:p.title,item:url});graph.push({'@type':'BreadcrumbList',itemListElement:crumbs});}
 if(p.kind==='article')graph.push({'@type':'BlogPosting','@id':url+'#article',headline:p.title,description:p.description,mainEntityOfPage:{'@id':url+'#page'},author:{'@type':'Organization',name:business.name,url:origin+'/'},publisher:{'@id':business['@id']},image:[origin+'/og.png'],...(p.published?{datePublished:p.published}:{}),inLanguage:'en-US'});
 else if(p.kind==='service'&&!['/','/gold-and-silver-of-louisiana-location/','/gold-and-silver-of-louisiana/','/how-we-buy-gold-and-silver/','/buying-coins/','/rose-gold/','/colored-diamonds/','/u-s-90-silver-coins/','/silver-dollars/','/turquoise/'].includes(p.path))graph.push({'@type':'Service',name:p.title,url,provider:{'@id':business['@id']},areaServed:{'@type':'City',name:'Baton Rouge'}});
 const title=p.path==='/'?p.title:`${p.title} | Gold & Silver of Louisiana`;
 const pageCSS=p.path==='/'?'/reference-home.css':'/site.css';
 const homeStart=p.path==='/'?'<div class="site">':'';
 const homeEnd=p.path==='/'?'</div>':'';
 const pageFooter=p.path==='/'?footer:footerExtra+footer+mobileCall;
 const html=`<!doctype html><html lang="en-US"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)}</title><meta name="description" content="${escape(p.description)}"><meta name="robots" content="${production?'index,follow':'noindex,follow'}"><link rel="canonical" href="${url}"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(p.description)}"><meta property="og:url" content="${url}"><meta property="og:type" content="${p.kind==='article'?'article':'website'}"><meta property="og:image" content="${origin}/og.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Gold &amp; Silver of Louisiana — Baton Rouge"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(title)}"><meta name="twitter:description" content="${escape(p.description)}"><meta name="twitter:image" content="${origin}/og.png"><link rel="icon" href="/favicon.png"><link rel="preload" href="/brand.webp" as="image" fetchpriority="high"><link rel="stylesheet" href="${pageCSS}"><script src="/site.js" defer></script><script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c')}</script></head><body>${homeStart}${$header.html()}<main id="main" class="${p.path==='/'?'home-main':'detail-main'}">${body}</main>${pageFooter}${homeEnd}</body></html>`;
 const filename=path.join(out,decodeURIComponent(p.path),'index.html');await fs.mkdir(path.dirname(filename),{recursive:true});await fs.writeFile(filename,html);generated.push({path:p.path,title,description:p.description,kind:p.kind,bytes:Buffer.byteLength(html)});
}
const errorHTML=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | Gold &amp; Silver of Louisiana</title><meta name="robots" content="noindex,follow"><link rel="stylesheet" href="/site.css"></head><body>${$header.html()}<main id="main" class="detail-main"><section class="detail-hero"><p class="eyebrow">Page not found</p><h1>Let’s help you find your way.</h1><p>This address doesn’t match a page on our website.</p><a class="primary" href="/">Return home →</a> <a class="text-link" href="/gold-and-silver-of-louisiana-location/">Contact our showroom</a></section></main>${footer}</body></html>`;
await fs.writeFile(path.join(out,'404.html'),errorHTML);
await fs.writeFile(path.join(out,'robots.txt'),`User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
await fs.writeFile(path.join(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(p=>`<url><loc>${escape(origin+encodeURI(p.path))}</loc></url>`).join('\n')}\n</urlset>\n`);
await fs.writeFile('data/build-report.json',JSON.stringify({indexable:production,pages:generated.length,optimizedImages:imageInfo.size,generated},null,2)+'\n');
console.log(`Built ${generated.length} static pages; ${imageInfo.size} optimized images. Indexing: ${production?'production enabled':'preview noindex'}.`);
