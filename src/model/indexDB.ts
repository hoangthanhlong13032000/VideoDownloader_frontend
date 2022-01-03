import CachedVideo from "./cached-video";

export default class IndexDB {
    #instance: IDBDatabase;
    name: string;
    version: number;
    #init: Promise<boolean>;

    constructor(name: string, version = 1) {
        this.#instance;
        this.name = name;
        this.version = version;
        this.#init = new Promise((resolve) => {
            if (!window.indexedDB) {
                console.log("--FAIL-- Your browser doesn't support a stable version of IndexedDB.");
                resolve(false)
            }
            else {
                const request = window.indexedDB.open(this.name, this.version);
                request.onerror = () => {
                    console.log("--FAIL-- Error open indexDB!");
                    resolve(false)
                };

                request.onupgradeneeded = (event: any) => {
                    this.#instance = event.target.result;
                    this.#instance.createObjectStore("video", { keyPath: "id" }).createIndex("expire", "expire", { unique: false });
                    console.log("--SUCCESS-- Create new indexDB name = [videoDatabase]");
                }

                request.onsuccess = async () => {
                    this.#instance = request.result;
                    console.log(`--SUCCESS-- Open existed indexDB name = [${this.name}], version = [${this.version}]`);
                    resolve(true);
                };
            }
        })

    }

    async read(id: string): Promise<CachedVideo> {
        if (!this.#instance) await this.#init;
        return new Promise((resolve) => {
            const request = this.#instance.transaction(["video"]).objectStore("video").get(id);

            request.onerror = () => {
                console.log(`--FAIL-- id = [${id}] couldn't be found in your database!`);
                resolve(undefined);
            };
            request.onsuccess = () => {
                if (!request.result) console.log(`--FAIL-- id = [${id}] couldn't be found in your database!`);
                resolve(request.result)
            };
        })
    }

    async readAll(): Promise<Array<CachedVideo>> {
        if (!this.#instance) await this.#init;
        return new Promise((resolve) => {
            const videos = [];
            const request = this.#instance.transaction(["video"]).objectStore("video").index('expire').openCursor(null, 'prev')
            request.onsuccess = (event: any) => {
                const cursor = event.target.result;
                if (cursor) {
                    videos.push(cursor.value)
                    cursor.continue();
                } else resolve(videos);
            };
            request.onerror = () => { resolve(videos) }
        })
    }

    async add(video: CachedVideo): Promise<boolean> {
        console.log(`--START-- Add video id: [${video.id}], expire at: ${new Date(video.expire).toLocaleDateString()}`);
        if (!this.#instance) await this.#init;

        return new Promise((resolve) => {
            const request = this.#instance.transaction(["video"], "readwrite").objectStore("video").put(video);
            request.onsuccess = () => {
                console.log(`--SUCCESS-- Add video id = [${video.id}]`);
                resolve(true);
            }
            request.onerror = () => {
                console.log(`--FAIL-- Add video id = [${video.id}]`);
                resolve(false)
            }
        })
    }

    async remove(id: string): Promise<boolean> {
        console.log(`--START-- Delete video id = [${id}]`);
        if (!this.#instance) await this.#init;

        return new Promise((resolve) => {
            const request = this.#instance.transaction(["video"], "readwrite").objectStore("video").delete(id);
            request.onsuccess = () => {
                console.log(`--SUCCESS-- Delete video id = [${id}]`);
                resolve(true);
            }
            request.onerror = () => {
                console.log(`--FAIL-- Delete video id = [${id}]`);
                resolve(false);
            }
        })
    }

    static deleteDB(name: string): void {
        console.log(`--START-- Delete database name = ${name}`);

        const request = window.indexedDB.deleteDatabase(name);
        request.onsuccess = () => console.log(`--SUCCESS-- Delete database name = ${name}`);
        request.onerror = () => console.log(`--FAIL-- Delete database name = ${name}`);
    }
}

