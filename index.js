//const cron = require("node-cron");
//const express = require("express");
const Parser = require('rss-parser');
const scrapeYt = require("scrape-yt");
const mysql = require('mysql2');
const table_youtube = "youtube_scrapper"

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'pedrohosoares',
    password: '46302113',
    database: 'top_franquias'
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


async function getSpecificVideos(idVideo) {
    try {
        const link = idVideo;
        await scrapeYt.getVideo(link, {
            type: "video"
        }).then(videos => {
            videos.dislikeCount = (videos.dislikeCount == null) ? 0 : videos.dislikeCount;
            videos.viewCount = (videos.viewCount == null) ? 0 : videos.viewCount;
            videos.likeCount = (videos.likeCount == null) ? 0 : videos.likeCount;
            videos.tags = (videos.tags == null) ? '' : videos.tags.join(',');
            console.log(videos.tags);
        }).then((r) => {
        });
    } catch { }
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
                        videos.tags = (videos.tags == null) ? '' : videos.tags.join(',');
                        let query = "INSERT INTO " + table_youtube + " (url,tags,views,likes,unlikes,updated_at) ";
                        query += "VALUES('" + videos.id + "', '" + videos.tags + "', '" + videos.viewCount + "', '" + videos.likeCount + "', '" + videos.dislikeCount + "',NOW()) ";
                        query += "ON DUPLICATE KEY UPDATE tags = '"+videos.tags+"', views = '" + videos.viewCount + "', likes = '" + videos.likeCount + "', unlikes = '" + videos.dislikeCount + "', updated_at = NOW()";
                        return connection.execute(query);
                    }).then((r) => {
                        console.log('Atualizado');
                    });
                } catch { }
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
        for (const link of links) {
            try {
                await scrapeYt.getVideo(link, {
                    type: "video"
                }).then(videos => {
                    videos.dislikeCount = (videos.dislikeCount == null) ? 0 : videos.dislikeCount;
                    videos.viewCount = (videos.viewCount == null) ? 0 : videos.viewCount;
                    videos.likeCount = (videos.likeCount == null) ? 0 : videos.likeCount;
                    videos.tags = (videos.tags == null) ? '' : videos.tags.join(',');
                    let query = "INSERT INTO " + table_youtube + " (url,tags,views,likes,unlikes,updated_at) ";
                    query += "VALUES('" + videos.id + "', '" + videos.tags + "', '" + videos.viewCount + "', '" + videos.likeCount + "', '" + videos.dislikeCount + "',NOW()) ";
                    query += "ON DUPLICATE KEY UPDATE tags = '"+videos.tags+"', views = '" + videos.viewCount + "', likes = '" + videos.likeCount + "', unlikes = '" + videos.dislikeCount + "', updated_at = NOW()";
                    connection.query(query);
                }).then((r) => {
                    console.log('Inserido');
                });
            } catch { }
        }

        resolve()
    })
}

async function insertVideos() {
    let videos = 'T92gcyt2kkQ,sIO91n3Gue0,T6tnHQFlzTI,O4PhFrI0rKE,coXhYZ5F3c4,V6Y9XmZTcK4,Yeiu1FDLkvA,8EwIe9ENcqc,dJ6M50jZIow,zjXhZnN2GgQ,cSGHwC_NlkM,2oP_uLLIxQM,j1t1KJGY3bM,iujapECOflQ,HArTkHKp4ac,uyHyUMsMUvw,sDkKZRxFY1U,nlINL8KPuis,dy_CTpgjV_M,I9tSEgMrY34,DnlbRRwMjn4,opWEcTf54DA,tzpo7hvzANE,Ijg5ch8t5DI,zwMyYZNNjVo,rO9rU1eCu9w,kQIGQHl14F4,sMYQWvdU4wM,GavR2X7mUBk,PqdRpuG9Omk,LrmT7ywJ4qw,l4Lc9-useGI&t=1s,WOYPf6PoVb8,kGBoudAVxW0,jshKQNk34Vg,-ntXEDcz3Z8,nhqSxIkFtVI,yn6svDtqUD4,6ouy0A03LIc,DG6g-Cg9U9I,nqhpPuAjxuQ,BIzziikIcl8,b-DadS6FTCw,Qa_KfVZ2sVo&t=2s,3vLJpwkGL6E,fjNAb6tV4As,rtnyATVGioY,ojtCTkr9i2A,RSj4z68SVq0,4y_qJejxIHc,khZzumwDwkc,Rz2EeLyopK0,ynlm-jZBPQc,Id780fa69Q8,6Rf1YhQ0jZc,yN-aI3WiUHg,Q_nPcQ8v170,blzvaxzQNdc,ebwD5MOdysg,WxcPBV2jDHA,Kw9T3QI0uFw,ruPy2W24_0A,VjasfRuvJDg,NzNJk960xV0,Z9RXd4LOesA,nDLmJNkaSsY,O9olpcAg0aI,Mk34cR4shik,F9tIFrRzCAc,iCLmVmvJBTQ,oY0w2YXIAzk,0PAPXIDKJ4I,5h7E59Yuhg0,SlU4DxXZGwY,mOyPw_-WD8w,h5WIE6OGzhg,iuejp4FqmUw&t=117s,tMuDlw1BafE,s-CVRoJcCUw,A1eiOjwFlcs,Zv4AcWlOrbY,LzaTQugFksE,Cv3LKaOJvCg,99Hb7_gpHoo,ZTykEx9zRRM,RqcBUMuA8zM,RvmPIj27aFI,mlK_FefXTFk,GXT1hdPpHbU,POMGQqhyVLk,aWLPKXETkdk,6X8pY-QpWlk,u-AfJgCWuDQ,CHYmC7B89K0,eQsmo5jtxxc,iNURdOZwFUs,i_AVraCfN2A,FRqWq8MWqY0,_Sddk1R3PH4,LB_N3YbYQdM,NldPMxbIhwQ,CBh9vOlryLc,7wilBRhUOBE,FHu43qqr1hY,kdEnL_l4OTU,Fp3guEHcMGo,MFeVtzpd31o,sUptT8gtQT0,LUDDaOrjEAo,-UfeC-Tf7C8,KQCyQAGQXjU,2aQOtKx6JlM,PazJwN2FfQA,O-nD894CQbM,zjosamOxFX4,-Wstc9UJmyI,R1tlIU6aV_8,xzZRF3gdqo0,uyWXLzrf6Zo,HTa7SzcoAzA,o1YZsGRFuXg,_O9O1B8MqDc,YzK-mQFBzwc,t2BYNsO6dD8,86Nfs9Y6wZE,azLR9PALBDU,5kf05MDAZPc,Ggjwg2zHREY,Z_RMqUeR22Q,oukgMBZyvXk,Etv7NujEcC0,n9lWB5BruoY,jtz5pCDW4yI,PhbtJhAPd3s,5DLdhXWLeus,LrHztb30-Gc,LOBAx8bSXas,zfhm_O3Bqyo,q4r9eUsudIk,QOf_CbKZuQ4,uy49hXE_8Z8,NPqSHVUfXso,rtzs5XFQqHA,BK86blh1eYQ,RG0QsQkFP7Q,uC5VbzXP5Tc,mt7oQKiIdSY,gmVb78XLzeE,LDZ4QCs-HgA,SeQFgiEofQE,3qUlRxawjQE,QtIN3p6MXVc,3Xi-mygiPGA,NX_uAuWXZjU,5pcnXktCxKY,rE1gtLUVzkY,_teFWaQbnwk,7SZ87VUWgfY,dRSiH-YN5ao,fuV9Wj8KPcA,q_Jm3-XJCww,aCzAyS4SY6U,yvrckhklzX0,YEVZOG5RZlY,14DpdYrjhA8,r7AfFmGP4V4,oB2yGy_B7IU,4nibNaiuI4s,GYO9Wid7p9w,SI-d2X2ck0k,F21wFip2-Sk,R17_X_w16PM,Nm-u9nDGzME,qKbrptcAgO0,8cASCY0Soko,V0pG1u6V7yU,Ygsjsfayr38,mTgPlAOY8NM,t2OH4qgGCJw,rvMo-DzIGAI,PfU-0VqgZsw,NyOOU9WprQM,BsY-sd7p5lc,kRnJYbAQm1Q,NTUY73TyT-8,gG4oIPIgldM,21sWlxTvQ1g,3p4DMUxz5Gw,6q-p98Opu8E,f5VVanXEFZ0,bRmvIVh0HD8,0nc3S7Ejt-E,IzQXaM_Ap3Y,okgMb6ijr5o,HvggGKeoBWw,kdd_OpZHpp4,7g0M54VsOlo,UljVOJK4Jmg,UuC5MnxP2pI,ZHSgUZW_nLU,P_jpaxiEXws,4edntJfAM24,aUc77kKKxMI,XBdM2VeMGuI,wubb9fwhpgE,dO62_rP9ycY,2pcHvTYmN-g,saKg3nn88pQ,Of3LP6dBS84,Nv3drwIznSw,KaEcm9pJNiw,G88XrZez88g,wSZ05wNKEeE,tZEn0w3AS5c,OL7XVvz8Lyw,TOybuSRW4Uk,y9EKY82cyV4,PxMUAtWGLac,nfkKdhNL3bw,0D6C7XkRmpI,q6YTe1RgxKw,nwy1O0iYE00,3QlJwZsEPqs,FhwHjL9Zqcs,3Y3q5rcDmxo,s9YzmrjUGaI,I0cTeyFlvr4,l4wKu4oYMV4,-uS1gSkPlkw,fv8lrbwd7u0,31KFCWyTrds,GjsmSTcwEo0,-00snc0QLxc,CLs-lMBt4Zc,ZGdYg2-Kde0,24nx9ipE1Wo,w-vt87MJd9c,E0j95kKyu4A,64qAFUVPqoc,atGm8YE1vV0,vk02fzYFm80,j4FH8qx1CZE,QHbtIIqQ6h8,EF3c2Ichg-4,AjimOAgmWJg,lpYwvUW9X44,3SXZGmUF-A4,_-E8LGly4po,usRVaR4iw0Q,DCazTH90PPc,E0XfucQF6Kk,QwgsYivKvOk,fExtP7rvllQ,2--DXR3TkV8,dKdjZR6OOS0,9WPeBtL5nyA,85-P-j87TUg,sz9OsQIOtxs,-yEJOWJGXwc,hlck0ydUOqg,YY2AczSJec4,WBG_D1IwAEA,pHhrWWEs3g4,Xw4_MSVSaDc,f36UX84T2Q4,b48Om0nIDjM,VH4E8RL0K8k,KuDwKPz3-gQ,FAp__grRE-I&t=13s,OHIeqcc9-dA,eUCo9-xmp1Y,ltFfw2ory_o,zoNqVg1-bro,U_2nD0CF2e4,QIkHPMDqmZY,O-m_TCKhjLY,rqFdaCFYzuE,mbF_crM6MEQ,3tUSlUQOjg8,Z9L_9dpcVJ0,8YLlb3gt9hY,8M-mpdEwAt0,S_e0ox-koyQ,pGAfQYP1kQE,RTqQ9JRoo9c,LKTwSTjuuWU,h9lT5eyA4Dk,3riDTIrSlNs,bZ70xbq752Q,Dz15K7NJLc4,B_E5F7cC6_I,JwQnT7It13I,idy7Ltu9Pjo,dMq6UilkazY,NrUiNm3F7u4,SspDK6yu6hE,R9yR7vniNRY,mIPc__ExGoI,yOTLa05AIgc,-crhQo_icdI,3BM2grBwHoM,qtDAKGTaTQ0,654UO7ev8dA,xX70EijMOEw,ZHqJ3625e7Y,XgTpc4OIRgE,K-w7-hHwQB0,-IZ1yQLNQOs,2V0BK0Z7cPg,UuoTGIaUXno,HgXXNiR52A4,AXGAb6ThoVY,HeFlqDGjpuw,DmsHHxwI_jA,fyJunfHVWzU,m_0eqH3k2Dg,90Ok8V1YpQI,XOvPg3HFHiM,gagW7tZDA6E,7y_cupM3OMo,VcjPhAXUdAI,sxUcBr2-38o,2SZG9VyyOSg,uoge6I4peL4,uK0F6yA8K_8,uI0HaRuNUrE,zCRjU820uXw,ggR8FgzyUM4,-jazNaW1Qqk,l53BnPSsNMc,R6kAa0WXKD4,_nxzPLcP2OQ,61lwwHiyPdQ,LJVI4DSi58c,RsyuaA8-9Gc,k2uS4eCvxEE,V_FvHbs4qsE,xUb1IB26q1g,_YMpqFLaxxk,F-6VRMfdFdc,hSng99O0MxY&t=4s,s9a03cj8dmI,OTd-tqtaHNg,Uxblslgf23o,MOYC2mowDvo,us_lwieIsMc,bjmMP8wfzx4,rQBZf5guEEU,UnqXDslPjN4,GQBoH1ThTcU,ShhjDfVxkrY,PmB9GMb7O4g,mVaOngrLY14,rwPlk-ACFRs,KN6JUH-RqQA&t=28s,sissV7GWHXk,9MVP1ULHLhs,AyvtN21BY0M,yr_CtHYGd6M&t=1s';
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
    return new Promise((resolve, reject) => {

        let query = "SELECT tags,views,likes FROM youtube_scrapper WHERE tags is NOT NULL";
        connection.query(query, function (error, results, fields) {
            results.forEach((value) => {
                let tagsSnakeCase = value.tags.toLowerCase();
                tagsSnakeCase = tagsSnakeCase.replace(/#/g, '').split(',');
                let tags = value.tags.replace(/#/g, '').split(',');
                tags = [...tags, ...tagsSnakeCase].join("','");
                tags = "'" + tags + "'";
                const query = `
                    INSERT INTO top_postmeta (post_id,meta_key,meta_value) 
                    SELECT p.ID,'youtube_views${dateNow()}',${value.views}
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
                    console.log(wordpress);
                });
            })
            resolve();
        });

    });


}


async function exec() {
    connection.connect();

    //await getSpecificVideos('rtnyATVGioY');
    await updateNewVideos();
    await addNewVideos();
    await relationTagWithPost();
    //insertVideos();
    connection.end()
}
exec();

/*
cron.schedule("16 23 * * *", () => {
    exec();
});
*/