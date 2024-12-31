self.addEventListener("install",function(event){
    console.log('service worker installed ...');
    
});

self.addEventListener("activate",function(event){
    console.log('service worker activated ...');
    return self.clients.claim();
});

self.addEventListener("fetch",function(event){
    console.log('service worker fetching ...',event);
    event.respondWith(fetch(event.request)) 
});