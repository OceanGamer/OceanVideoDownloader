//global variables
const pages = [
    "youtube",
    "instagram",
    "tiktok",
    "facebook",
    "universal"
];

let id;


let darklight = localStorage.getItem("darklight") || "true";
if (darklight == 'true') {
    document.getElementById('mode').href = 'css/darkmode.css'
    document.getElementById('darklightbtn').innerHTML = '<img src="images/TopButtons/light.png">'
}else{
    document.getElementById('mode').href = 'css/lightmode.css'
    document.getElementById('darklightbtn').innerHTML = '<img src="images/TopButtons/dark.png">'
}
//obtiene la url de la pagina y verifica si es de Youtube, Instagram, Reddit, TikTok, Twitter o Facebook
chrome.tabs.query({
    'active': true,
    'currentWindow': true
}, function(tabs) {
    url = tabs[0].url;
    verifyALLurl(url);
});


function ChangeMode() {
    if (darklight == 'true') {
        document.getElementById('mode').href = 'css/lightmode.css'
        document.getElementById('darklightbtn').innerHTML = '<img src="images/TopButtons/dark.png">'
        darklight = 'false'
        localStorage.setItem("darklight", "false");
    } else {
        document.getElementById('mode').href = 'css/darkmode.css'
        document.getElementById('darklightbtn').innerHTML = '<img src="images/TopButtons/light.png">'
        darklight = 'true'
        localStorage.setItem("darklight", "true");
    }
}
function verifyALLurl(url) {
    //destruye la url
    let a = url.split('/');
    let b = a[0]+a[2];
    
    //verifica si es de youtube
    if (b == 'https:www.youtube.com') {
        let c = url.split('=')
        if (c[0] == 'https://www.youtube.com/watch?v') {
            document.getElementById('ytinput').value = url
        }
        OpenTab(0);
    }
    //verifica si es de instagram
    else if(b == 'https:www.instagram.com') {
        OpenTab(1);
        if (url != 'https://www.instagram.com/') {
            if(a[3] != 'direct' && a[3] != 'explore' && a[3] != 'stories' && a[3] != 'your_activity' && a[3] != 'accounts' && a[3] != 'push' && a[4] != 'saved'){
                if (a[3] == 'p') {
                    if (a[4] != '') {
                        document.getElementById('iginput').value = url;
                    }
                } else{
                    document.getElementById('iginput').value = url;
                }
            }
        }

    //verifica si es de TikTok
    } else if(b == 'https:www.tiktok.com') {
        OpenTab(2);
        if (a[4] == 'video') {
            if (a[5] != '') {
                document.getElementById('tkinput').value = url;
            }
        }
    }

    //verifica si es de Facebook
    else if(b == 'https:www.facebook.com') {
        OpenTab(3);
        if (a[4] == 'videos') {
            if (a[5] != '') {
                document.getElementById('fbinput').value = url;
            }
        }else if(a[3] == 'reel'){
            if (a[4] != '') {
                document.getElementById('fbinput').value = url;
            }
        }
    }else{
        OpenTab(4);
    }
    

    
    

}




//Descarga-Instagram
function DownloadInstagramMedia() {
    let url = document.getElementById('iginput').value;
    let a = url.split('/');
    let b = a[0]+a[2];

    if(b == 'https:www.instagram.com') {
        if (url != 'https://www.instagram.com/') {
            if(a[3] != 'direct' && a[3] != 'explore' && a[3] != 'stories' && a[3] != 'your_activity' && a[3] != 'accounts' && a[3] != 'push' && a[4] != 'saved'){
                if (a[3] == 'p') {
                    if (a[4] != '') {
                        let finalurl = url.replace('/', '%2F')
                        finalurl = finalurl.replace(':', '%3A')
                        let options = {
                            method: 'GET',
                            headers: {
                                'X-RapidAPI-Key': '88bca816afmsheec10f6037e665cp10974djsn7b5472f00fee',
                                'X-RapidAPI-Host': 'instagram-downloader-download-instagram-videos-stories.p.rapidapi.com'
                            }
                        };
                        fetch('https://instagram-downloader-download-instagram-videos-stories.p.rapidapi.com/index?url='+finalurl, options)
                            .then(response => response.json())
                            .then(response => ShowInstagramMedia(response))
                            .catch(err => console.error(err));
                    }else{
                        let content = document.getElementById('igcontent')
                        content.innerHTML = '<p>Esta no es una publicacion de instagram</p>'
                    }
                } else{
                    let finalurl = url.replace('/', '%2F')
                        finalurl = finalurl.replace(':', '%3A')
                    const options = {
                        method: 'GET',
                        headers: {
                            'X-RapidAPI-Key': '88bca816afmsheec10f6037e665cp10974djsn7b5472f00fee',
                            'X-RapidAPI-Host': 'instagram-downloader-download-instagram-videos-stories.p.rapidapi.com'
                        }
                    };
                    
                    fetch('https://instagram-downloader-download-instagram-videos-stories.p.rapidapi.com/index?url=https%3A%2F%2Fwww.instagram.com%2Fp%2FCbXzHzEFv5q%2F', options)
                        .then(response => response.json())
                        .then(response => ShowInstagramMedia(response))
                        .catch(err => console.error(err));
                }
            }
        }else{
            let content = document.getElementById('igcontent')
            content.innerHTML = '<p>Esta no es una publicacion de instagram</p>'
        }
    }else{
        let content = document.getElementById('igcontent')
        content.innerHTML = '<p>El link no es de instagram o esta vacio</p>'
    }
}

function ShowInstagramMedia(media) {
    if (Array.isArray(media.media)) {
        let content = document.getElementById('igcontent')
        content.innerHTML = ''
        content.innerHTML += '<h3>Se han encontrado varios archivos</h3><br><p>'+media.title+'</p>'
        const mediadescomprimed = media.media
        mediadescomprimed.forEach(tempobj => {
            if (tempobj.includes('mp4')) {
                content.innerHTML += '<div class="preview"><div><div><video src="'+tempobj+'" controls="controls" autoplay="false" id="photo2"></video><button class="download" id"download">Descargar</button></div></div></div>'
            }else{
                content.innerHTML += '<div class="preview"><div><div><img src="'+tempobj+'" id="photo2" alt=""></img><button class="download" id"download">Descargar</button></div></div></div>'
            }
        });
    } else {
        let content = document.getElementById('igcontent')
        content.innerHTML = ''
        content.innerHTML += '<h3>Se ha encontrado un archivo</h3><br><p>'+media.title+'</p>'
        if (media.media.includes('mp4')) {
            content.innerHTML += '<div class="preview"><div><div><video src="'+media.media+'" controls="controls" autostart="false" id="photo2"></video><button class="download" id"download">Descargar</button></div></div></div>'
        }else{
            content.innerHTML += '<div class="preview"><div><div><img src="'+media.media+'" id="photo2" alt=""></img><button class="download" id"download">Descargar</button></div></div></div>'
        }
    }
    let buttons = document.querySelectorAll('.download');
    buttons.forEach(button => {
        button.addEventListener('click', event => {
            const button = event.target;
            const div = button.parentElement;
            const iframe = div.querySelector('#photo2');
            const src = iframe.src;
            chrome.downloads.download({
                url: src,
                filename: Math.random()+'.jpg'
            });
        });
    });
}



//Descarga TikTok
function DownloadTikTokMedia() {
    let url = document.getElementById('tkinput').value;
    let a = url.split('/');
    let b = a[0]+a[2];
    if(b == 'https:www.tiktok.com') {
        OpenTab(2);
        if (a[4] == 'video') {
            if (a[5] != '') {
                let finalurl = url.replace('/', '%2F')
                finalurl = finalurl.replace(':', '%3A')
                const options = {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': '88bca816afmsheec10f6037e665cp10974djsn7b5472f00fee',
                        'X-RapidAPI-Host': 'tiktok-video-no-watermark2.p.rapidapi.com'
                    }
                };
                
                fetch('https://tiktok-video-no-watermark2.p.rapidapi.com/?url='+finalurl, options)
                    .then(response => response.json())
                    .then(response => LoadTiktokMedia(response))
                    .catch(err => console.error(err));
            }else{
                let content = document.getElementById('tkcontent')
                content.innerHTML = '<p>El link esta roto</p>' 
            }
        }else{
            let content = document.getElementById('tkcontent')
            content.innerHTML = '<p>El link no es un video de tiktok</p>' 
        }
    }else{
        let content = document.getElementById('tkcontent')
        content.innerHTML = '<p>El link no es de tiktok o esta vacio</p>' 
    }
}

function LoadTiktokMedia(media) {
    let content = document.getElementById('tkcontent')
    content.innerHTML = ''
    content.innerHTML += '<h3>Se ha encontrado un archivo</h3><br><p>'+media.data.title+'</p>'
    content.innerHTML += '<div class="preview"><div><div><video src="'+media.data.play+'" controls="controls" autostart="false" id="photo2"></video><button class="download" id"download">Descargar</button></div></div></div>'
    let buttons = document.querySelectorAll('.download');
    buttons.forEach(button => {
        button.addEventListener('click', event => {
            const button = event.target;
            const div = button.parentElement;
            const iframe = div.querySelector('#photo2');
            const src = iframe.src;
            chrome.downloads.download({
                url: src,
                filename: Math.random()+'.jpg'
            });
        });
    });
}

//Descarga Facebook
function DownloadFacebookMedia() {
    let url = document.getElementById('fbinput').value;
    let a = url.split('/');
    let b = a[0]+a[2];
    if(b == 'https:www.facebook.com') {
        if (a[4] == 'reel' || a[4] == 'videos') {
            if (a[5] != '') {
                let finalurl = url.replace('/', '%2F')
                finalurl = finalurl.replace(':', '%3A')
                const options = {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': '88bca816afmsheec10f6037e665cp10974djsn7b5472f00fee',
                        'X-RapidAPI-Host': 'facebook-video-and-reel-downloader.p.rapidapi.com'
                    }
                };
                
                fetch('https://facebook-video-and-reel-downloader.p.rapidapi.com/?url='+finalurl, options)
                    .then(response => response.json())
                    .then(response => LoadFacebookMedia(response))
                    .catch(err => console.error(err));
            }else{
                let content = document.getElementById('fbcontent')
                content.innerHTML = '<p>El enlace esta roto</p>' 
            }
        }
        else if(a[3] == 'reel'){
        console.log('xd')
            if (a[4] != '') {
                let midurl = url.split('?')
                let centralurl = midurl[0]
                let finalurl = centralurl.replace('/', '%2F')
                    finalurl = finalurl.replace(':', '%3A')
                    const options = {
                        method: 'GET',
                        headers: {
                            'X-RapidAPI-Key': '88bca816afmsheec10f6037e665cp10974djsn7b5472f00fee',
                            'X-RapidAPI-Host': 'facebook-video-and-reel-downloader.p.rapidapi.com'
                        }
                    };
                    
                    fetch('https://facebook-video-and-reel-downloader.p.rapidapi.com/?url='+finalurl, options)
                        .then(response => response.json())
                        .then(response => LoadFacebookMedia(response))
                        .catch(err => console.error(err));
            }else{
                let content = document.getElementById('fbcontent')
                content.innerHTML = '<p>El enlace esta roto</p>' 
            }
        }else{
            let content = document.getElementById('fbcontent')
            content.innerHTML = '<p>El link no es un reel o video</p>' 
        }
    }else{
        let content = document.getElementById('fbcontent')
        content.innerHTML = '<p>El link no es de facebook o esta vacio</p>' 
    }
}

function LoadFacebookMedia(media) {
    let content = document.getElementById('fbcontent')
    content.innerHTML = ''
    content.innerHTML += '<h3>Se ha encontrado un archivo</h3><br><p>'+media.title+'</p>'
    content.innerHTML += '<div class="preview"><div><div><video src="'+media.hd+'" controls="controls" autostart="false" id="photo2"></video><button class="download" id"download">Descargar</button></div></div></div>'
    let buttons = document.querySelectorAll('.download');
    buttons.forEach(button => {
        button.addEventListener('click', event => {
            const button = event.target;
            const div = button.parentElement;
            const iframe = div.querySelector('#photo2');
            const src = iframe.src;
            chrome.downloads.download({
                url: src,
                filename: Math.random()+'.jpg'
            });
        });
    });
}


//Descarga Youtube
function DownloadYoutubeMedia() {
    let url = document.getElementById('ytinput').value;
    let a = url.split('/');
    let b = a[0]+a[2];
    
    //verifica si es de youtube
    if (b == 'https:www.youtube.com') {
        let c = url.split('=')
        if (c[0] == 'https://www.youtube.com/watch?v' && c[1] != '') {
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': '88bca816afmsheec10f6037e665cp10974djsn7b5472f00fee',
                    'X-RapidAPI-Host': 'ytstream-download-youtube-videos.p.rapidapi.com'
                }
            };
            
            fetch('https://ytstream-download-youtube-videos.p.rapidapi.com/dl?id='+c[1], options)
                .then(response => response.json())
                .then(response => LoadYoutubeMedia(response))
                .catch(err => console.error(err));
        }else{
            let content = document.getElementById('ytcontent')
            content.innerHTML = '<p>El link esta roto</p>' 
        }
    }else{
        let content = document.getElementById('ytcontent')
        content.innerHTML = '<p>El link no es de youtube o esta vacio</p>' 
    }
}

function LoadYoutubeMedia(media) {
    console.log(media)
    let content = document.getElementById('ytcontent')
    content.innerHTML = ''
    content.innerHTML += '<h3>Se ha encontrado un archivo</h3><br><p>'+media.title+'</p>'
    content.innerHTML += '<div class="preview"><div><div><video src="'+media.formats[1].url+'" controls="controls" autostart="false" id="photo"></video><button class="download" id"download">Descargar Media Calidad</button></div></div></div>'
    content.innerHTML += '<div class="preview"><div><div><video src="'+media.formats[2].url+'" controls="controls" autostart="false" id="photo"></video><button class="download" id"download">Descargar Alta Calidad</button></div></div></div>'
    let buttons = document.querySelectorAll('.download');
    buttons.forEach(button => {
        button.addEventListener('click', event => {
            const button = event.target;
            const div = button.parentElement;
            const iframe = div.querySelector('#photo');
            const src = iframe.src;
            chrome.downloads.download({
                url: src,
                filename: Math.random()+'.jpg'
            });
        });
    });
    buttons.forEach(button => {
        button.addEventListener('click', event => {
            const button = event.target;
            const div = button.parentElement;
            const iframe = div.querySelector('#photo3');
            const src = iframe.src;
            chrome.downloads.download({
                url: src,
                filename: 'youtube.mp3'
            });
        });
    });
}


//DownloadAllMedia
function DownloadAllMedia() {
     //destruye la url
     let url = document.getElementById('allinput').value;
     let a = url.split('/');
     let b = a[0]+a[2];
     
     //verifica si es de youtube
     if (b == 'https:www.youtube.com') {
        OpenTab(0);
        document.getElementById('ytinput').value = document.getElementById('allinput').value
        DownloadYoutubeMedia()
     }
     //verifica si es de instagram
     else if(b == 'https:www.instagram.com') {
        OpenTab(1);
        document.getElementById('iginput').value = document.getElementById('allinput').value
        DownloadInstagramMedia()
 
     //verifica si es de TikTok
     } else if(b == 'https:www.tiktok.com') {
        OpenTab(2);
        document.getElementById('tkinput').value = document.getElementById('allinput').value
        DownloadTikTokMedia() 
     }
 
     //verifica si es de Facebook
     else if(b == 'https:www.facebook.com') {
        OpenTab(3);
        document.getElementById('fbinput').value = document.getElementById('allinput').value
        DownloadFacebookMedia() 
     }else{
        let content = document.getElementById('allcontent')
        content.innerHTML = '<p>El link no es de youtube, instagram, tiktok o facebook</p>' 
     }
}

//Abre un nuevo tab
function OpenTab(newid) {
    for (let i = 0; i < 5; i++) {
        if (newid == i) {
            document.getElementById(pages[i]).style.display = 'block'
            document.querySelector('#'+pages[i]+'btn').disabled = true;
        }else{
            document.getElementById(pages[i]).style.display = 'none'
            document.querySelector('#'+pages[i]+'btn').disabled = false;
        }
        
    }
    id = newid;
}



//abrir otra pestana
document.getElementById("youtubebtn").addEventListener("click", function() {
    OpenTab(0);
});
document.getElementById("instagrambtn").addEventListener("click", function() {
    OpenTab(1);
});

document.getElementById("tiktokbtn").addEventListener("click", function() {
    OpenTab(2);
});

document.getElementById("facebookbtn").addEventListener("click", function() {
    OpenTab(3);
});

document.getElementById("universalbtn").addEventListener("click", function() {
    OpenTab(4);
});

document.getElementById("igdownloadbtn").addEventListener("click", DownloadInstagramMedia);
document.getElementById("tkdownloadbtn").addEventListener("click", DownloadTikTokMedia);
document.getElementById("fbdownloadbtn").addEventListener("click", DownloadFacebookMedia);
document.getElementById("ytdownloadbtn").addEventListener("click", DownloadYoutubeMedia);
document.getElementById("alldownloadbtn").addEventListener("click", DownloadAllMedia);
document.getElementById("darklightbtn").addEventListener("click", ChangeMode);

