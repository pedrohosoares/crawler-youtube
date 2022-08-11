//const cron = require("node-cron");
const express = require("express");
const Parser = require('rss-parser');
const scrapeYt = require("scrape-yt");
const mysql = require('mysql2');
const table_youtube = "youtube_scrapper"

const connection = mysql.createConnection({
       host: 'crawler-youtube.cl9fk3vdebut.sa-east-1.rds.amazonaws.com',
        user: 'pedrohosoares',
        password: '46302113&Aws',
        database: 'youtube'
});

    

/*
CREATE TABLE `youtube_scrapper` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `url` VARCHAR(45) NOT NULL UNIQUE,
  `tags` VARCHAR(255) NULL,
  `views` INT UNSIGNED NULL,
  `likes` INT UNSIGNED NULL,
  `unlikes` INT UNSIGNED NULL,
  `updated_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC));

  ALTER TABLE `youtube_scrapper` 
DROP INDEX `id_UNIQUE` ,
ADD UNIQUE INDEX `id_UNIQUE` (`id` ASC, `tags` ASC);

*/

let parser = new Parser();
//app = express();

function dateNow() {
    const d_t = new Date();
    let year = d_t.getFullYear();
    let month = ("0" + (d_t.getMonth() + 1)).slice(-2);
    return year + '-' + month;
}

async function updateNewVideos() {
    const getVideosDatabase = "SELECT url FROM youtube_scrapper";

    return new Promise((resolve, reject) => {
        connection.query(getVideosDatabase, async (error, results, fields) => {
        let links = [];
        for (const key in results) {
            links.push(results[key].url);
        }

        for (const key in links) {
            try {
                console.log('Key: ', key)
    
                const link = links[key];
    
                console.log('LInk: ', link)
    
                await scrapeYt.getVideo(link, {
                    type: "video"
                }).then(videos => {
                    videos.dislikeCount = (videos.dislikeCount == null) ? 0 : videos.dislikeCount;
                    videos.viewCount = (videos.viewCount == null) ? 0 : videos.viewCount;
                    videos.likeCount = (videos.likeCount == null) ? 0 : videos.likeCount;
                    let query = "INSERT INTO " + table_youtube + " (url,tags,views,likes,unlikes,updated_at) ";
                    query += "VALUES('" + videos.id + "', '" + videos.tags.join(',') + "', '" + videos.viewCount + "', '" + videos.likeCount + "', '" + videos.dislikeCount + "',NOW()) ";
                    query += "ON DUPLICATE KEY UPDATE views = '" + videos.viewCount + "', likes = '" + videos.likeCount + "', unlikes = '" + videos.dislikeCount + "', updated_at = NOW()";
                    return connection.execute(query);
                }).then((r) => {
                    console.log('Atualizado');
                });
            }catch {}
        }

        resolve()
    });
    })

    
}

async function addNewVideos() {
    const xmldata = "https://www.youtube.com/feeds/videos.xml?channel_id=UC4g5C1dxdEDIz6O46pAf-vw";
    let feed = await parser.parseURL(xmldata);
    const links = []

    feed.items.forEach(item => {
        links.push(item.link.split('watch?v=')[1]);
    });

    return new Promise(async (resolve) => {
        for(const link of links) {
            try {
                await scrapeYt.getVideo(link, {
                    type: "video"
                }).then(videos => {
                    videos.dislikeCount = (videos.dislikeCount == null) ? 0 : videos.dislikeCount;
                    videos.viewCount = (videos.viewCount == null) ? 0 : videos.viewCount;
                    videos.likeCount = (videos.likeCount == null) ? 0 : videos.likeCount;
                    let query = "INSERT INTO " + table_youtube + " (url,tags,views,likes,unlikes,updated_at) ";
                    query += "VALUES('" + videos.id + "', '" + videos.tags.join(',') + "', '" + videos.viewCount + "', '" + videos.likeCount + "', '" + videos.dislikeCount + "',NOW()) ";
                    query += "ON DUPLICATE KEY UPDATE views = '" + videos.viewCount + "', likes = '" + videos.likeCount + "', unlikes = '" + videos.dislikeCount + "', updated_at = NOW()";
                    connection.query(query);
                }).then((r) => {
                    console.log('Inserido');
                });
            }catch {}
        }

        resolve()
    })
}

async function insertVideos() {
    let videos = 'fjNAb6tV4As&t=1s,fjNAb6tV4As&t=1s,rtnyATVGioY,rtnyATVGioY,ojtCTkr9i2A,ojtCTkr9i2A,RSj4z68SVq0,RSj4z68SVq0,4y_qJejxIHc,4y_qJejxIHc,khZzumwDwkc,khZzumwDwkc,Rz2EeLyopK0,Rz2EeLyopK0,ynlm-jZBPQc,ynlm-jZBPQc,Id780fa69Q8,Id780fa69Q8,6Rf1YhQ0jZc,6Rf1YhQ0jZc,yN-aI3WiUHg,yN-aI3WiUHg,Q_nPcQ8v170,Q_nPcQ8v170,blzvaxzQNdc,blzvaxzQNdc,ebwD5MOdysg,ebwD5MOdysg,WxcPBV2jDHA,WxcPBV2jDHA,Kw9T3QI0uFw,Kw9T3QI0uFw,ruPy2W24_0A,ruPy2W24_0A,VjasfRuvJDg,VjasfRuvJDg,NzNJk960xV0,NzNJk960xV0,Z9RXd4LOesA,Z9RXd4LOesA,nDLmJNkaSsY,nDLmJNkaSsY,O9olpcAg0aI,O9olpcAg0aI,Mk34cR4shik,Mk34cR4shik,F9tIFrRzCAc,F9tIFrRzCAc,iCLmVmvJBTQ,iCLmVmvJBTQ,oY0w2YXIAzk,oY0w2YXIAzk,0PAPXIDKJ4I,0PAPXIDKJ4I,5h7E59Yuhg0,5h7E59Yuhg0,SlU4DxXZGwY,SlU4DxXZGwY,mOyPw_-WD8w,mOyPw_-WD8w,h5WIE6OGzhg,h5WIE6OGzhg,iuejp4FqmUw,iuejp4FqmUw,tMuDlw1BafE,tMuDlw1BafE,s-CVRoJcCUw,s-CVRoJcCUw,A1eiOjwFlcs,A1eiOjwFlcs,Zv4AcWlOrbY,Zv4AcWlOrbY,LzaTQugFksE,LzaTQugFksE,Cv3LKaOJvCg,Cv3LKaOJvCg,99Hb7_gpHoo,99Hb7_gpHoo,ZTykEx9zRRM,ZTykEx9zRRM,RqcBUMuA8zM,RqcBUMuA8zM,RvmPIj27aFI,RvmPIj27aFI,mlK_FefXTFk,mlK_FefXTFk,GXT1hdPpHbU,GXT1hdPpHbU,POMGQqhyVLk,POMGQqhyVLk,aWLPKXETkdk,aWLPKXETkdk,6X8pY-QpWlk,6X8pY-QpWlk,u-AfJgCWuDQ,u-AfJgCWuDQ,CHYmC7B89K0,CHYmC7B89K0,eQsmo5jtxxc,eQsmo5jtxxc,iNURdOZwFUs,iNURdOZwFUs,i_AVraCfN2A,i_AVraCfN2A,FRqWq8MWqY0,FRqWq8MWqY0,_Sddk1R3PH4,_Sddk1R3PH4,LB_N3YbYQdM,LB_N3YbYQdM,NldPMxbIhwQ,NldPMxbIhwQ,CBh9vOlryLc,CBh9vOlryLc,7wilBRhUOBE,7wilBRhUOBE,FHu43qqr1hY,FHu43qqr1hY,kdEnL_l4OTU,kdEnL_l4OTU,Fp3guEHcMGo,Fp3guEHcMGo,MFeVtzpd31o,MFeVtzpd31o,sUptT8gtQT0,sUptT8gtQT0,LUDDaOrjEAo,LUDDaOrjEAo,-UfeC-Tf7C8,-UfeC-Tf7C8,KQCyQAGQXjU,KQCyQAGQXjU,2aQOtKx6JlM,2aQOtKx6JlM,PazJwN2FfQA,PazJwN2FfQA,O-nD894CQbM,O-nD894CQbM,zjosamOxFX4,zjosamOxFX4,-Wstc9UJmyI,-Wstc9UJmyI,R1tlIU6aV_8,R1tlIU6aV_8,xzZRF3gdqo0,xzZRF3gdqo0,uyWXLzrf6Zo,uyWXLzrf6Zo,HTa7SzcoAzA,HTa7SzcoAzA,o1YZsGRFuXg,o1YZsGRFuXg,_O9O1B8MqDc,_O9O1B8MqDc,YzK-mQFBzwc,YzK-mQFBzwc,t2BYNsO6dD8,t2BYNsO6dD8,86Nfs9Y6wZE,86Nfs9Y6wZE,azLR9PALBDU,azLR9PALBDU,5kf05MDAZPc,5kf05MDAZPc,Ggjwg2zHREY,Ggjwg2zHREY,Z_RMqUeR22Q,Z_RMqUeR22Q,oukgMBZyvXk,oukgMBZyvXk,Etv7NujEcC0,Etv7NujEcC0,n9lWB5BruoY,n9lWB5BruoY,jtz5pCDW4yI,jtz5pCDW4yI,PhbtJhAPd3s,PhbtJhAPd3s,5DLdhXWLeus,5DLdhXWLeus,LrHztb30-Gc,LrHztb30-Gc,LOBAx8bSXas,LOBAx8bSXas,zfhm_O3Bqyo,zfhm_O3Bqyo,q4r9eUsudIk,q4r9eUsudIk,QOf_CbKZuQ4,QOf_CbKZuQ4,uy49hXE_8Z8,uy49hXE_8Z8,NPqSHVUfXso,NPqSHVUfXso,rtzs5XFQqHA,rtzs5XFQqHA,BK86blh1eYQ,BK86blh1eYQ,RG0QsQkFP7Q,RG0QsQkFP7Q,uC5VbzXP5Tc,uC5VbzXP5Tc,mt7oQKiIdSY,mt7oQKiIdSY,gmVb78XLzeE,gmVb78XLzeE,LDZ4QCs-HgA,LDZ4QCs-HgA,SeQFgiEofQE,SeQFgiEofQE,3qUlRxawjQE,3qUlRxawjQE,QtIN3p6MXVc,QtIN3p6MXVc,3Xi-mygiPGA,3Xi-mygiPGA,NX_uAuWXZjU,NX_uAuWXZjU,5pcnXktCxKY,5pcnXktCxKY,rE1gtLUVzkY,rE1gtLUVzkY,_teFWaQbnwk,_teFWaQbnwk,7SZ87VUWgfY,7SZ87VUWgfY,dRSiH-YN5ao,dRSiH-YN5ao,fuV9Wj8KPcA,fuV9Wj8KPcA,q_Jm3-XJCww,q_Jm3-XJCww,aCzAyS4SY6U,aCzAyS4SY6U,yvrckhklzX0,yvrckhklzX0,YEVZOG5RZlY,YEVZOG5RZlY,14DpdYrjhA8,14DpdYrjhA8,r7AfFmGP4V4,r7AfFmGP4V4,oB2yGy_B7IU,oB2yGy_B7IU,4nibNaiuI4s,4nibNaiuI4s,GYO9Wid7p9w,GYO9Wid7p9w,SI-d2X2ck0k,SI-d2X2ck0k,F21wFip2-Sk,F21wFip2-Sk,R17_X_w16PM,R17_X_w16PM,Nm-u9nDGzME,Nm-u9nDGzME,qKbrptcAgO0,qKbrptcAgO0,8cASCY0Soko,8cASCY0Soko,V0pG1u6V7yU,V0pG1u6V7yU,Ygsjsfayr38,Ygsjsfayr38,mTgPlAOY8NM,mTgPlAOY8NM,t2OH4qgGCJw,t2OH4qgGCJw,rvMo-DzIGAI,rvMo-DzIGAI,PfU-0VqgZsw,PfU-0VqgZsw,NyOOU9WprQM,NyOOU9WprQM,BsY-sd7p5lc,BsY-sd7p5lc,kRnJYbAQm1Q,kRnJYbAQm1Q,NTUY73TyT-8,NTUY73TyT-8,gG4oIPIgldM,gG4oIPIgldM,21sWlxTvQ1g,21sWlxTvQ1g,3p4DMUxz5Gw,3p4DMUxz5Gw,6q-p98Opu8E,6q-p98Opu8E,f5VVanXEFZ0,f5VVanXEFZ0,bRmvIVh0HD8,bRmvIVh0HD8,0nc3S7Ejt-E,0nc3S7Ejt-E,IzQXaM_Ap3Y,IzQXaM_Ap3Y,okgMb6ijr5o,okgMb6ijr5o,HvggGKeoBWw,HvggGKeoBWw,kdd_OpZHpp4,kdd_OpZHpp4,7g0M54VsOlo,7g0M54VsOlo,UljVOJK4Jmg,UljVOJK4Jmg,UuC5MnxP2pI,UuC5MnxP2pI,ZHSgUZW_nLU,ZHSgUZW_nLU,P_jpaxiEXws,P_jpaxiEXws,4edntJfAM24,4edntJfAM24,aUc77kKKxMI,aUc77kKKxMI,XBdM2VeMGuI,XBdM2VeMGuI,wubb9fwhpgE,wubb9fwhpgE,dO62_rP9ycY,dO62_rP9ycY,2pcHvTYmN-g,2pcHvTYmN-g,saKg3nn88pQ,saKg3nn88pQ,Of3LP6dBS84,Of3LP6dBS84,Nv3drwIznSw,Nv3drwIznSw,KaEcm9pJNiw,KaEcm9pJNiw,G88XrZez88g,G88XrZez88g,wSZ05wNKEeE,wSZ05wNKEeE,tZEn0w3AS5c&t=4s,tZEn0w3AS5c&t=4s,OL7XVvz8Lyw,OL7XVvz8Lyw,TOybuSRW4Uk,TOybuSRW4Uk,y9EKY82cyV4,y9EKY82cyV4,PxMUAtWGLac,PxMUAtWGLac,nfkKdhNL3bw,nfkKdhNL3bw,0D6C7XkRmpI,0D6C7XkRmpI,q6YTe1RgxKw,q6YTe1RgxKw,nwy1O0iYE00,nwy1O0iYE00,3QlJwZsEPqs,3QlJwZsEPqs,FhwHjL9Zqcs,FhwHjL9Zqcs,3Y3q5rcDmxo,3Y3q5rcDmxo,s9YzmrjUGaI,s9YzmrjUGaI,I0cTeyFlvr4,I0cTeyFlvr4,l4wKu4oYMV4,l4wKu4oYMV4,-uS1gSkPlkw,-uS1gSkPlkw,fv8lrbwd7u0,fv8lrbwd7u0,31KFCWyTrds,31KFCWyTrds,GjsmSTcwEo0,GjsmSTcwEo0,-00snc0QLxc,-00snc0QLxc,CLs-lMBt4Zc,CLs-lMBt4Zc,ZGdYg2-Kde0,ZGdYg2-Kde0,24nx9ipE1Wo,24nx9ipE1Wo,w-vt87MJd9c,w-vt87MJd9c,E0j95kKyu4A,E0j95kKyu4A,64qAFUVPqoc,64qAFUVPqoc,atGm8YE1vV0,atGm8YE1vV0,vk02fzYFm80,vk02fzYFm80,j4FH8qx1CZE,j4FH8qx1CZE,QHbtIIqQ6h8,QHbtIIqQ6h8,EF3c2Ichg-4,EF3c2Ichg-4,AjimOAgmWJg,AjimOAgmWJg,lpYwvUW9X44,lpYwvUW9X44,3SXZGmUF-A4,3SXZGmUF-A4,_-E8LGly4po,_-E8LGly4po,usRVaR4iw0Q,usRVaR4iw0Q,DCazTH90PPc,DCazTH90PPc,E0XfucQF6Kk,E0XfucQF6Kk,QwgsYivKvOk,QwgsYivKvOk,fExtP7rvllQ,fExtP7rvllQ,2--DXR3TkV8,2--DXR3TkV8,dKdjZR6OOS0,dKdjZR6OOS0,9WPeBtL5nyA,9WPeBtL5nyA,85-P-j87TUg,85-P-j87TUg,sz9OsQIOtxs,sz9OsQIOtxs,-yEJOWJGXwc,-yEJOWJGXwc,hlck0ydUOqg,hlck0ydUOqg,YY2AczSJec4,YY2AczSJec4,WBG_D1IwAEA,WBG_D1IwAEA,pHhrWWEs3g4,pHhrWWEs3g4,Xw4_MSVSaDc,Xw4_MSVSaDc,f36UX84T2Q4,f36UX84T2Q4,b48Om0nIDjM,b48Om0nIDjM,VH4E8RL0K8k&t=51s,VH4E8RL0K8k&t=51s,KuDwKPz3-gQ,KuDwKPz3-gQ,FAp__grRE-I,FAp__grRE-I,OHIeqcc9-dA,OHIeqcc9-dA,eUCo9-xmp1Y,eUCo9-xmp1Y,ltFfw2ory_o,ltFfw2ory_o,zoNqVg1-bro,zoNqVg1-bro,U_2nD0CF2e4,U_2nD0CF2e4,QIkHPMDqmZY,QIkHPMDqmZY,O-m_TCKhjLY,O-m_TCKhjLY,rqFdaCFYzuE,rqFdaCFYzuE,mbF_crM6MEQ,mbF_crM6MEQ,3tUSlUQOjg8,3tUSlUQOjg8,Z9L_9dpcVJ0,Z9L_9dpcVJ0,8YLlb3gt9hY,8YLlb3gt9hY,8M-mpdEwAt0,8M-mpdEwAt0,S_e0ox-koyQ,S_e0ox-koyQ,pGAfQYP1kQE,pGAfQYP1kQE,RTqQ9JRoo9c,RTqQ9JRoo9c,LKTwSTjuuWU,LKTwSTjuuWU,h9lT5eyA4Dk,h9lT5eyA4Dk,3riDTIrSlNs,3riDTIrSlNs,bZ70xbq752Q,bZ70xbq752Q,Dz15K7NJLc4,Dz15K7NJLc4,B_E5F7cC6_I,B_E5F7cC6_I,JwQnT7It13I,JwQnT7It13I,idy7Ltu9Pjo,idy7Ltu9Pjo,dMq6UilkazY,dMq6UilkazY,NrUiNm3F7u4,NrUiNm3F7u4,SspDK6yu6hE,SspDK6yu6hE,R9yR7vniNRY,R9yR7vniNRY,mIPc__ExGoI,mIPc__ExGoI,yOTLa05AIgc,yOTLa05AIgc,-crhQo_icdI,-crhQo_icdI,3BM2grBwHoM,3BM2grBwHoM,qtDAKGTaTQ0,qtDAKGTaTQ0,654UO7ev8dA,654UO7ev8dA,xX70EijMOEw,xX70EijMOEw,ZHqJ3625e7Y,ZHqJ3625e7Y,XgTpc4OIRgE,XgTpc4OIRgE,K-w7-hHwQB0,K-w7-hHwQB0,-IZ1yQLNQOs,-IZ1yQLNQOs,2V0BK0Z7cPg,2V0BK0Z7cPg,UuoTGIaUXno,UuoTGIaUXno,HgXXNiR52A4,HgXXNiR52A4,AXGAb6ThoVY,AXGAb6ThoVY,HeFlqDGjpuw,HeFlqDGjpuw,DmsHHxwI_jA,DmsHHxwI_jA,fyJunfHVWzU,fyJunfHVWzU,m_0eqH3k2Dg,m_0eqH3k2Dg,90Ok8V1YpQI,90Ok8V1YpQI,XOvPg3HFHiM,XOvPg3HFHiM,gagW7tZDA6E,gagW7tZDA6E,7y_cupM3OMo,7y_cupM3OMo,VcjPhAXUdAI,VcjPhAXUdAI,sxUcBr2-38o,sxUcBr2-38o,2SZG9VyyOSg,2SZG9VyyOSg,uoge6I4peL4,uoge6I4peL4,uK0F6yA8K_8,uK0F6yA8K_8,uI0HaRuNUrE,uI0HaRuNUrE,zCRjU820uXw,zCRjU820uXw,ggR8FgzyUM4,ggR8FgzyUM4,-jazNaW1Qqk,-jazNaW1Qqk,l53BnPSsNMc,l53BnPSsNMc,R6kAa0WXKD4,R6kAa0WXKD4,_nxzPLcP2OQ,_nxzPLcP2OQ,61lwwHiyPdQ,61lwwHiyPdQ,LJVI4DSi58c,LJVI4DSi58c,RsyuaA8-9Gc,RsyuaA8-9Gc,k2uS4eCvxEE,k2uS4eCvxEE,V_FvHbs4qsE,V_FvHbs4qsE,xUb1IB26q1g,xUb1IB26q1g,_YMpqFLaxxk,_YMpqFLaxxk,F-6VRMfdFdc,F-6VRMfdFdc,hSng99O0MxY,hSng99O0MxY,s9a03cj8dmI,s9a03cj8dmI,OTd-tqtaHNg,OTd-tqtaHNg,Uxblslgf23o,Uxblslgf23o,MOYC2mowDvo,MOYC2mowDvo,us_lwieIsMc,us_lwieIsMc,bjmMP8wfzx4,bjmMP8wfzx4,rQBZf5guEEU,rQBZf5guEEU,UnqXDslPjN4,UnqXDslPjN4,GQBoH1ThTcU,GQBoH1ThTcU,ShhjDfVxkrY,ShhjDfVxkrY,PmB9GMb7O4g,PmB9GMb7O4g,mVaOngrLY14,mVaOngrLY14,rwPlk-ACFRs,rwPlk-ACFRs,KN6JUH-RqQA,KN6JUH-RqQA,sissV7GWHXk,sissV7GWHXk,9MVP1ULHLhs,9MVP1ULHLhs,AyvtN21BY0M,AyvtN21BY0M,yr_CtHYGd6M,yr_CtHYGd6M';
    videos = videos.split(',');
    let uniq = [...new Set(videos)];
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'pedrohosoares',
        password: '46302113',
        database: 'top_franquias'
    });
    connection.connect();
    uniq.forEach((video) => {
        let query = "INSERT INTO " + table_youtube + " (url) ";
        query += "VALUES('" + video + "') ";
        connection.query(query, function (error, results, fields) {
            if (error) throw error;
        });
    });
}

/** USE FOR ONLY FIRST TIME */
async function associeteTagYoutubeWithWordpress() {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'pedrohosoares',
        password: '46302113',
        database: 'top_franquias'
    });
    connection.connect();
    let query = "INSERT INTO " + table_youtube + " (url) ";
    query += "VALUES('" + video + "') ";
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
    });
}


async function relationTagWithPost() {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'pedrohosoares',
        password: '46302113',
        database: 'top_franquias'
    });
    connection.connect();

    let query = "SELECT tags,views,likes FROM youtube_scrapper WHERE tags is NOT NULL";
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
        results.forEach((value) => {
            let tagsSnakeCase = value.tags.toLowerCase();
            tagsSnakeCase = tagsSnakeCase.replace(/#/g, '').split(',');
            let tags = value.tags.replace(/#/g, '').split(',');
            tags = [...tags, ...tagsSnakeCase].join("','");
            tags = "'" + tags + "'";
            const query = `SELECT p.ID 
            FROM top_posts p 
            INNER JOIN top_term_relationships tr ON (p.ID = tr.object_id) 
            INNER JOIN top_term_taxonomy tt ON (tr.term_taxonomy_id = tt.term_taxonomy_id) 
            INNER JOIN top_terms t ON (tt.term_id = t.term_id) 
            WHERE 
            tt.taxonomy = 'post_tag'
            AND p.post_type = 'franquias'
            AND t.slug IN (${tags}) 
            GROUP BY p.ID`;
            connection.query(query, function (error, wordpress, fields) {
                if (error) throw error;
                for (const key in wordpress) {
                    if (Object.hasOwnProperty.call(wordpress, key)) {
                        const ID = wordpress[key];
                        let insertNews = "INSERT INTO top_postmeta (post_id,meta_key,meta_value) ";
                        insertNews += "VALUES('" + ID.ID + "', 'youtube_views" + dateNow() + "', '" + value.views + "'); ";
                        connection.query(insertNews, function (error, results, fields) {
                            if (error) throw error;
                        });
                    }
                }
            });
        })
    });


}


async function exec() {
    connection.connect();

    await updateNewVideos();
    await addNewVideos();

    connection.end()
}

exec()

//relationTagWithPost();
/*
cron.schedule("0 3 * * *", () => {
    updateNewVideos();
});
cron.schedule("0 3 * * *", () => {
    relationTagWithPost();
});
*/
//app.listen(1313);