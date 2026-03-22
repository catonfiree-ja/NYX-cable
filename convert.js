const sharp=require('sharp');
const https=require('https');
const fs=require('fs');
const path=require('path');

const dir=path.join(__dirname,'frontend','public','images','gallery');
fs.mkdirSync(dir,{recursive:true});

// CORRECTED mapping verified from WordPress DOM structure (position-by-position)
const albums=[
  {name:'delivery-2025',url:'https://nyxcable.com/wp-content/uploads/2025/02/P1224537-1024x683.jpg'},
  {name:'delivery-2024',url:'https://nyxcable.com/wp-content/uploads/2025/01/delivery_2024_11-1024x768.jpg'},
  {name:'delivery-2023',url:'https://nyxcable.com/wp-content/uploads/2023/03/%E0%B8%AA%E0%B9%88%E0%B8%87%E0%B8%82%E0%B8%AD%E0%B8%87-2022-13.jpg'},
  {name:'delivery-2022',url:'https://nyxcable.com/wp-content/uploads/2023/03/cover-2022.jpg'},
  {name:'delivery-2021',url:'https://nyxcable.com/wp-content/uploads/2021/10/2021-update.jpg'},
  {name:'delivery-2020',url:'https://nyxcable.com/wp-content/uploads/2021/10/%E0%B8%AA%E0%B9%88%E0%B8%87%E0%B8%82%E0%B8%AD%E0%B8%87-2020_%E0%B9%92%E0%B9%91%E0%B9%90%E0%B9%91%E0%B9%91%E0%B9%94_11.jpg'},
  {name:'delivery-2019',url:'https://nyxcable.com/wp-content/uploads/2021/10/%E0%B8%AA%E0%B9%88%E0%B8%87%E0%B8%AA%E0%B8%B4%E0%B8%99%E0%B8%84%E0%B9%89%E0%B8%B2-62_%E0%B9%92%E0%B9%91%E0%B9%90%E0%B9%91%E0%B9%91%E0%B9%94_27.jpg'},
  {name:'delivery-2018',url:'https://nyxcable.com/wp-content/uploads/2021/10/%E0%B8%AA%E0%B8%B2%E0%B8%A2%E0%B8%84%E0%B8%AD%E0%B8%99%E0%B9%82%E0%B8%97%E0%B8%A3%E0%B8%A5-8-768x432-1.jpg'},
  {name:'delivery-2017',url:'https://nyxcable.com/wp-content/uploads/2021/10/LiYCY-25-1-768x432-1.jpg'},
  {name:'profile',url:'https://nyxcable.com/wp-content/uploads/2024/12/LINE_ALBUM_201224_241220_1-1024x768.jpg'},
  {name:'merit',url:'https://nyxcable.com/wp-content/uploads/2024/09/38920-1024x768.jpg'},
];

function dl(url){
  return new Promise((res,rej)=>{
    https.get(url,{headers:{'User-Agent':'Mozilla/5.0'}},(r)=>{
      if(r.statusCode>=300&&r.statusCode<400&&r.headers.location)return dl(r.headers.location).then(res).catch(rej);
      const chunks=[];r.on('data',c=>chunks.push(c));r.on('end',()=>res(Buffer.concat(chunks)));
    }).on('error',rej);
  });
}

(async()=>{
  for(const a of albums){
    const dest=path.join(dir,a.name+'.webp');
    const fn=decodeURIComponent(a.url.split('/').pop());
    console.log(a.name+' <- '+fn);
    try{
      const buf=await dl(a.url);
      await sharp(buf).resize(800,600,{fit:'cover'}).webp({quality:80}).toFile(dest);
      console.log('  OK ('+Math.round(fs.statSync(dest).size/1024)+'KB)');
    }catch(e){console.log('  ERR: '+e.message)}
  }
  console.log('All done!');
})();
