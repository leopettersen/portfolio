declare global {
    interface Map<K, V> {
        getOrInsertComputed(key: K, callback: (key: K) => V): V;
    }
}

if (typeof Map !== 'undefined' && !Map.prototype.getOrInsertComputed) {
    Map.prototype.getOrInsertComputed = function <K, V>(this: Map<K, V>, key: K, callback: (key: K) => V): V {
        if (this.has(key)) return this.get(key) as V;

        const value = callback(key);
        this.set(key, value);
        return value;
    };
}

if (typeof ReadableStream !== 'undefined' && !(Symbol.asyncIterator in ReadableStream.prototype)) {
    Object.defineProperty(ReadableStream.prototype, Symbol.asyncIterator, {
        configurable: true,
        writable: true,
        value: function <R>(this: ReadableStream<R>): AsyncIterableIterator<R> {
            const reader = this.getReader();

            return {
                async next() {
                    try {
                        const { done, value } = await reader.read();

                        if (done) {
                            reader.releaseLock();
                            return { done: true, value: undefined };
                        }

                        return { done: false, value };
                    } catch (error) {
                        reader.releaseLock();
                        throw error;
                    }
                },
                async return() {
                    reader.releaseLock();
                    return { done: true, value: undefined };
                },
                [Symbol.asyncIterator]() {
                    return this;
                },
            };
        },
    });
}

export {};
