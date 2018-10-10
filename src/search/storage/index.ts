import Dexie from 'dexie'

import { StorageManager } from '../types'

export abstract class FeatureStorage {
    constructor(protected storageManager: StorageManager) {}
}

/**
 * Error hanlder captures `OpenFailedError`s relating to `createObjectStore` IDB issues,
 * allowing all other errors to get thrown. We do this as some users experience a fatal issue
 * with this error rendering the DB unusable, but spamming our sentry error tracker.
 */
export const initErrHandler = <T>(defReturnVal: T = null) => (
    err: Dexie.DexieError,
) => {
    if (
        err.message === 'Data fetch failed' ||
        (err.name === Dexie.errnames.OpenFailed &&
            err.message.includes('createObjectStore'))
    ) {
        return defReturnVal
    }

    throw err
}
