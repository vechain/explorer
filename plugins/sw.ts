const VERSION = process.env.Version || ""

async function cachesClean() {
    const keys = await caches.keys()
    for (const name of keys) {
        if (name.includes('explorer') && !name.includes(VERSION)) {
            await caches.delete(name)
        }
        if(name.includes('workbox')) {
            await caches.delete(name)
        }
    }
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
        if (registrations.length === 1) {
            const reg = registrations[0]
            if (reg.active!.state === 'activated') {
                cachesClean()
            }
        }
    })
}
