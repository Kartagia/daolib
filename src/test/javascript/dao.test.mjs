
import { describe, it } from "mocha";
import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import { BasicDao, FunctionalDao, NoSuchElementException, UnsupportedException } from "../../main/javascript/dao.mjs";
use(chaiAsPromised);

describe("Testing DAO module", function () {
    describe("Testing class BasicDao<string, string>", function () {
        it(`Constructor`, function () {
            let result;
            expect(() => { result = new BasicDao() }).not.throw();
            expect(result.getAll()).eventually.eql([]);
            expect(result.get("foo")).eventually.throw(NoSuchElementException);
            expect(result.update("foo", "bar")).eventually.throw(UnsupportedException);
            expect(result.remove("foo")).eventually.throw(UnsupportedException);
            expect(result.create("bar")).eventually.throw(UnsupportedException);
        });
    });

    describe("Testing in memory FunctionalDao<string, Record<string, string>>", function () {
        describe("Constructor", function () {
            it(`Readonly DAO`, function () {
                let result;
                /**
                 * The entries storage in memory used to store DAO content.
                 * @type {Map<string, Record<string, string>>}
                 */
                const entries = new Map([["Foo", { "bar": "barbar" }], ["Bar", { "foo": "foobar" }], ["Barbar", { "foo": "bar", "bar": "foo" }]]);
                expect(() => {
                    result = new FunctionalDao({
                        getAll: () => {
                            /**
                             * @type {import("../../main/javascript/dao.mjs").Entry<string, Record<string, string>>}
                             */
                            const result = [...entries.entries()].map(([id, value]) => ({ id, value }));
                            return Promise.resolve(result);
                        }
                    })
                }).not.throw();
                expect(result.getAll()).eventually.eql([...entries.entries()].map(([id, value]) => ({ id, value })));
                expect(result.get("foo")).eventually.not.throw(NoSuchElementException);
                expect(result.get("foo")).eventually.eql(entries.get("foo"));
                expect(result.update("foo", "bar")).eventually.throw(UnsupportedException);
                expect(result.remove("foo")).eventually.throw(UnsupportedException);
                expect(result.create("bar")).eventually.throw(UnsupportedException);
            });
            it(`Fully functional DAO`, function () {
                let result;
                /**
                 * The entries storage in memory used to store DAO content.
                 * @type {Map<string, Record<string, string>>}
                 */
                const entries = new Map([["Foo", { "bar": "barbar" }], ["Bar", { "foo": "foobar" }], ["Barbar", { "foo": "bar", "bar": "foo" }]]);
                /**
                 * The reserved identifiers.
                 * @type {Set<string>}
                 */
                const ids = new Set(entries.keys());
                const idGen = () => {
                    let hash;
                    do {
                        hash = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16);
                    } while (ids.has(hash));
                    ids.add(hash);
                    return hash;
                }
                const validValue = (value) => (typeof value === "object" && Object.getOwnPropertyNames(value).every(
                    (prop) => (typeof prop === "string" && typeof (value[prop]) === "string")
                ));
                expect(() => {
                    result = new FunctionalDao({
                        getAll: () => {
                            /**
                             * @type {import("../../main/javascript/dao.mjs").Entry<string, Record<string, string>>}
                             */
                            const result = [...entries.entries()].map(([id, value]) => ({ id, value }));
                            return Promise.resolve(result);
                        },
                        update: (id, value, target = undefined) => {
                            if (validValue(value)) {
                                if (ids.has(id)) {
                                    entries.set(id, value);
                                    return Promise.resolve();
                                } else {
                                    return Promise.reject(new NoSuchElementException(`No value to update for key ${id}`));
                                }
                            } else {
                                return Promise.reject(new SyntaxError("Invalid value"));
                            }
                        },
                        remove: (id, target = undefined) => {
                            if (ids.has(id)) {
                                entries.delete(id);
                                ids.delete(id);
                                return Promise.resolve();
                            } else {
                                return Promise.reject(new NoSuchElementException(`No value to remove for key ${id}`));
                            }
                        },
                        /**
                         * 
                         * @param {Record<string, string>} value 
                         * @returns {Promise<void>}
                         */
                        create: (value) => {
                            if (validValue(value)) {
                                const id = idGen();
                                entries.set(id, value);
                                return Promise.resolve(id);
                            } else {
                                return Promise.reject(new SyntaxError("Invalid value"));
                            }
                        },
                        /**
                         * 
                         * @param {string} id 
                         * @param {Record<string, string>} value 
                         * @param {Record<string, string>} target 
                         * @returns {Promise<void>}
                         */
                        patch: (id, value, target = undefined) => {
                            if (validValue(id)) {
                                if (entries.has(id)) {
                                    return new Promise( (resolve, reject) => {
                                        const actualTarget = target == undefined ? {...entries.get(id)} : {...target};
                                        try {
                                            Object.getOwnPropertyNames(value).map( prop => {
                                                actualTarget[prop] = value[prop];
                                            });
                                            entries.set(id, actualTarget);
                                            resolve();
                                        } catch(err) {
                                            reject(err);
                                        }
                                    });
                                } else {
                                    return Promise.reject(new NoSuchElementException(`No value to update for key ${id}`));
                                }
                            } else {
                                return Promise.reject(new SyntaxError("invalid value"));
                            }
                        }
                    })
                }).not.throw();
                expect(result.getAll()).eventually.eql([...entries.entries()].map(([id, value]) => ({ id, value })));
                expect(result.get("foo")).eventually.not.throw(NoSuchElementException);
                expect(result.get("foo")).eventually.eql(entries.get("foo"));
                expect(result.update("foo", "bar")).eventually.throw(SyntaxError);
                expect(result.remove("foo")).eventually.not.throw();
                expect(result.get("foo")).eventually.throw(NoSuchElementException);
                expect(result.create("bar")).eventually.throw(SyntaxError);
            });
        });
    });
});