"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.softDeleteL5 = exports.softDeleteL4 = exports.softDeleteL3 = exports.softDeleteL2 = exports.softDeleteL1 = void 0;
const admin = require("firebase-admin");
const functions = require("firebase-functions");
admin.initializeApp();
const ARCHIVE_COLLECTION = process.env.ARCHIVE_COLLECTION ?? "_deleted";
const DELETED_AT_FIELD = process.env.DELETED_AT_FIELD ?? "timestampDeleted";
const EXCLUDED_COLLECTIONS = (process.env.EXCLUDED_COLLECTIONS ?? "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
async function handleDelete(snapshot) {
    const refPath = snapshot.ref.path;
    const segments = refPath.split("/");
    const topCollection = segments[0];
    if (topCollection === ARCHIVE_COLLECTION ||
        topCollection.startsWith("_ext_") ||
        EXCLUDED_COLLECTIONS.includes(topCollection)) {
        return null;
    }
    const docId = snapshot.ref.id;
    const originalData = snapshot.data();
    const archiveDocPath = `${ARCHIVE_COLLECTION}/${topCollection}/${docId}`;
    const archivedData = {
        ...originalData,
        [DELETED_AT_FIELD]: admin.firestore.FieldValue.serverTimestamp(),
        _originalPath: refPath,
    };
    functions.logger.info("Archiving deleted document", {
        originalPath: refPath,
        archivePath: archiveDocPath,
    });
    try {
        await admin.firestore().doc(archiveDocPath).set(archivedData);
    }
    catch (err) {
        functions.logger.error("Failed to archive deleted document", { err, refPath });
    }
    return null;
}
exports.softDeleteL1 = functions.firestore
    .document("{c1}/{d1}")
    .onDelete((snap) => handleDelete(snap));
exports.softDeleteL2 = functions.firestore
    .document("{c1}/{d1}/{c2}/{d2}")
    .onDelete((snap) => handleDelete(snap));
exports.softDeleteL3 = functions.firestore
    .document("{c1}/{d1}/{c2}/{d2}/{c3}/{d3}")
    .onDelete((snap) => handleDelete(snap));
exports.softDeleteL4 = functions.firestore
    .document("{c1}/{d1}/{c2}/{d2}/{c3}/{d3}/{c4}/{d4}")
    .onDelete((snap) => handleDelete(snap));
exports.softDeleteL5 = functions.firestore
    .document("{c1}/{d1}/{c2}/{d2}/{c3}/{d3}/{c4}/{d4}/{c5}/{d5}")
    .onDelete((snap) => handleDelete(snap));
