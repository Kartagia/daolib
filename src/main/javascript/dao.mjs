
/**
 * The module defining the DAO.
 * @module dao
 */

import { entry } from "./webpack.config";

/**
 * An exception is an error with optional cause type.
 * @template [CAUSE=any] The cause type.
 */
export class Exception extends Error {

    /**
     * Create a new exception with a message and an optional cause.
     * @param {string} message The message of the exception. 
     * @param {CAUSE} [cause] The cause of the exception.
     */
    constructor(message, cause = undefined) {
        super(message, { cause });
        this.name = this.constructor.name;
    }
}

/**
 * A no such element exception indicates the requested
 * element does not exist.
 * @template [CAUSE=any] The cause type.
 */
export class NoSuchElementException extends Exception {

    /**
     * Create a new no such element exception.
     * @param {string} message The message of the exception.
     * @param {CAUSE} [cause] The cause of the exception. 
     */
    constructor(message, cause = undefined) {
        super(message, cause);
    }
}

/**
 * An unsupported exception indicates the operation was not supported.
 * @template [CAUSE=any] The cause type.
 */
export class UnsupportedException extends Exception {

    /**
     * Create a new unsupported exception with a message and an optional cause.
     * @param {string} message The message of the exception.
     * @param {CAUSE} [cause] The optional cause. 
     */
    constructor(message, cause = undefined) {
        super(message, cause);
    }
}

/**
 * Are two values equals.
 * @template TYPE The type of the compared values.
 * @callback Equality
 * @param {TYPE} compared The compared value.
 * @param {TYPE} comparee The value compared with.
 * @returns {boolean} True, if and only if the compared is equal to comparee.
 */

/**
 * A predicate testing a value.
 * @template TYPE The tested type.
 * @callback Predicate
 * @param {TYPE} tested The tested value.
 * @returns {boolean} True, if and only if the tested fulfils the predicate.
 */

/**
 * A predicate testing a value of an iteration.
 * @template TYPE The tested type.
 * @callback IteratorPredicate
 * @param {TYPE} tested The tested value.
 * @param {number} index The index of the iteration.
 * @returns {boolean} True, if and only if the tested at the index fulfils the predicate.
 */

/**
 * A predicate testing a value of an array.
 * @template TYPE The tested type.
 * @callback ArrayPredicate
 * @param {TYPE} tested Teh tested value.
 * @param {number} index The index of the array.
 * @param {TYPE[]} array The array containing the value.
 * @returns {boolean} True, if and only if the tested at the index of the array fulfils the predicate.
 */

/**
 * An entry is a identifier-value pair.
 * @template [ID=string] The identifier type.
 * @template TYPE The value type.
 * @typedef {Object} Entry
 * @property {ID} id The identifier of the entry.
 * @property {TYPE} value The value of the entry.
 */

/**
 * A supplier of a value.
 * @template TYPE The supplied value type.
 * @callback Supplier
 * @returns {Promise<TYPE>} The supplied value.
 */

/**
 * A getter of an existing value.
 * @template [ID=string] The identifier type.
 * @template TYPE The value type.
 * @callback Getter
 * @param {ID} id The queried identifier.
 * @returns {Promise<TYPE>} The promise of the value associated
 * with the id.
 * @throws {NoSuchElementException} The exception rejected, if no
 * element with given identifier exists.
 */

/**
 * Update an existing value.
 * @template [ID=string] The identifier type.
 * @template TYPE The updated type.
 * @callback Updater
 * @param {ID} id The identifier of the updated value.
 * @param {TYPE} value The new value associated to the id.
 * @param {TYPE} [target] The optional target of the update.
 * @returns {Promise<Void>} The promise of the successful update.
 * @throws {SyntaxError} The rejected error, if the given value is invalid.
 * @throws {NoSuchElementException} The rejected exception, if there is no value
 * associated with the given identifier.
 * @throws {UnsupportedException} The rejected exception, if the update operation is not supported.
 */

/**
 * @template [ID=string] The identifier type.
 * @template TYPE The updated type.
 * @callback Patcher
 * @param {ID} id The identifier of the patched value.
 * @param {Partial<TYPE>} value The updated properties.
 * @param {TYPE} [target] The optional target of the patching.
 * @returns {Promise<Void>} The promise of the successful update.
 * @throws {SyntaxError} The rejected error, if the given value is invalid.
 * @throws {NoSuchElementException} The rejected exception, if there is no value
 * associated with the given identifier.
 * @throws {UnsupportedException} The rejected exception, if the patch operation is not supported.
 */

/**
 * Remove an existing value.
 * @template [ID=string] The identifeir type.
 * @callback Remover
 * @param {ID} id The identifier of the removed value.
 * @param {TYPE} [target] The optional removed value. 
 * @returns {Promise<Void>} The promise of the successful removal.
 * @throws {NoSuchElementException} The rejected exception, if there was no value
 * associated with the given identifier.
 * @throws {UnsupportedException} The rejected exception, if the removal operation is not supported.
 */

/**
 * Create a new entry with a value. 
 * @template [ID=string] The identifier type.
 * @template TYPE The value type of the added value.
 * @callback Creator
 * @param {TYPE} value The added value.
 * @returns {Promise<ID>} The promise of the identifier associated to the created value.
 * @throws {SyntaxError} The rejected error, if the given value could not be added.
 * @throws {UnsupportedException} The rejected exception, if the new element creation is not supported.
 */

/**
 * A dao reprents a data access object storing and supplying values associated with an 
 * identifer.
 * @template [ID=string] The identifier type.
 * @template TYPE The value type of the DAO.
 * @typedef {Object} DAO
 * @property {Getter<ID, TYPE>} get Get the element associated to the identifier.
 * @property {Supplier<Entry<ID, TYPE>[]>} getAll Get all identifier-value pairs of the dao.
 * @property {Creator<ID, TYPE>} create Create a new entry in DAO.
 * @property {Remover<ID>} remove Remove a avleu from DAO.
 * @property {Updater<ID, TYPE>} update Update an existing value associated to the identifier.
 * @property {Patcher<ID, TYPE>} patch Update some properties of an existing value associated
 * to the idnetifier.
 */

/**
 * The basic dao options.
 * @template [ID=string] The identifier type.
 * @template TYPE The value type of the DAO.
 * @typedef {Object} BasicDaoOptions
 * @property {Equality<ID>} [equalId] The identifier equality function.
 * @property {Equality<VALUE>} [equalValue] The value equality function.
 */

/**
 * A basic implementation of a DAO.
 * @template [ID=string] The identifier type.
 * @template TYPE The value type of the DAO.
 * @extends {DAO<ID, TYPE>}
 */
export class BasicDao {

    /**
     * The default equality is a strict equality.
     * @template VALUE THe type of the tested value.
     */
    static DEFAULT_EQUALITY = (/** @type {VALUE} */ compared, /** @type {VALUE} */ comparee) => (
        compared === comparee
    );

    /**
     * Are identifiers equals.
     * @type {Equality<ID>} 
     */
    equalId(compared, comparee) {
        return this._equalid(compared, comparee);
    }

    /**
     * Are values equals.
     * @type {Equality<TYPE>}
     */
    equalValue(compared, comparee) {
        return this._equalValue(compared, comparee);
    }

    /**
     * Create a new basic dao.
     * @param {BasicDaoOptions<ID, TYPE>} [options] 
     */
    constructor(options = {}) {
        /**
         * The equaöity of idenfiers.
         * @type {Equality<ID>}
         */
        this._equalId = options.equalId == null ? BasicDao.DEFAULT_EQUALITY : options.equalId;
        /**
         * Teh equailty of values.
         * @type {Equality<TYPE>}
         */
        this._equalValue = options.equalValue == null ? BasicDao.DEFAULT_EQUALITY : options.equalValue;
    }

    getAll() {
        /** @type {Entry<ID, TYPE>[]} */
        const result = [];
        return Promise.resolve(result);
    }

    /**
     * Get value of id.
     * @type {Getter<ID, TYPE>}
     */
    get(id) {
        return this.getAll().then(
            (values) => {
                const found = values.find((entry) => (this.equalId(entry.id, id)));
                if (found == null) {
                    throw new NoSuchElementException("No such value exists");
                } else {
                    return found.value;
                }
            }
        );
    }

    /**
     * Update value of identifier.
     * @type {Updater<ID, TYPE>}
     */
    update(id, value, target=undefined) {
        /**
         * The promise of a successful update.
         * @type {Promise<Never>}
         */
        const result = Promise.reject(new UnsupportedException("Update not supported"));
        return result;
    }

    /**
     * Patch value associated with id.
     * @type {Patcher<ID, TYPE>}
     */
    patch(id, value, target=undefined) {
        return Promise.reject(new UnsupportedException("Patch not supported"));
    }


    /**
     * Remove value associated with identifier.
     * @type {Remover<ID, TYPE>}
     */
    remove(id, target=undefined) {
        return Promise.reject(new UnsupportedException("Remove not supported"));
    }

    /**
     * Create a new value associated with appointed identifier.
     * @type {Creator<ID, VALUE>}
     */
    create(value) {
    /** @type {Promise<ID>} */     
    const result = Promise.reject(new UnsupportedException("Create not supported"));
    return result;
    }
}

/**
 * The options specific to the functional dao. 
 * @template [ID=string] The identifier type.
 * @template TYPE The value type of the DAO.
 * @typedef {Object} FunctionalDaoOptions
 * @property {Supplier<Entry<ID, TYPE>[]>} [getAll] The function retrieving
 * all entries from the storage.
 * @property {Creator<ID, TYPE>} [create] The creator function updating the 
 * data storage. 
 * @property {Updater<ID, TYPE>} [update] The updater function updating the 
 * data storage.
 * @property {Remover<ID>} [remove] The remover function updating the data storage.
 * @property {Updater<ID, Partial<TYPE>>} [patch] The partial udpater of the
 * stored value. 
 */

/**
 * A functional DAO is defined by the functions implementing
 * the DAO operators getAll, create, patch, update, and remove.
 * @template [ID=string] The identifier type.
 * @template TYPE The value type of the DAO.
 * @extends {BasicDao<ID, TYPE>}
 * @implements {DAO<ID, TYPE>}
 */
export class FunctionalDao extends BasicDao {

    /**
     * Create a new functional DAO.
     * @param {BasicDaoOptions<ID, TYPE> & FunctionalDaoOptions<ID, TYPE>} [options] The construciton options. 
     */
    constructor(options={}) {
        super(options);
        /**
         * @type {Supplier<Entry<ID, TYPE>[]>}
         */
        this._getAll = options.getAll;
        /**
         * @type {Updater<ID, TYPE>}
         */
        this._update = options.update;

        /**
         * @type {Remover<ID, TYPE>}
         */
        this._remove = options.remove;

        /**
         * @type {Creator<ID, TYPE>}
         */
        this._create = options.create;

        /**
         * @type {Patcher<ID, TYPE>}
         */
        this._patch = options.patch;
    }

    getAll() {
        if (this._getAll) {
            return this._getAll();
        } else {
            return super.getAll();
        }
    }

    update(id, value, target=undefined) {
        if (this._update) {
            return this.get(id).then(
                (target) => {
                    return this._update(id, value, target);
                }, 
                (error) => {
                    throw new NoSuchElementException("Cannot update non-existing value");
                }
            );
        } else {
            return super.update(id, value);
        }
    }

    remove(id, target = undefined) {
        if (this._remove) {
            return this.get(id).then(
                (target) => {
                    return this._remove(id);
                },
                (error) => {
                    throw new NoSuchElementException("Cannot remove non-existing value");
                }
            )
        } else {
            return super.update(id);
        }
    }
    patch(id, value, target = undefined) {
        if (this._patch) {
            return this.get(id).then(
                (target) => {
                    return this._patch(id, value, target);
                }, 
                (error) => {
                    throw new NoSuchElementException("Cannot patch non-existing value");
                }
            )
            return this._patch(id, value);
        } else {
            return super.patch(id, value);
        }
    }

    /**
     * Add a new value ot the DAO.
     * @param {TYPE} value The added value.
     * @returns {Promise<ID>} The promise of the identifier associated with the value.
     */
    create(value) {
        if (this._create) {
            return this._create(value);
        } else {
            return super.create(value);
        }
    }
}