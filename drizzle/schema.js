"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messages = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
exports.messages = (0, pg_core_1.pgTable)('messages', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    content: (0, pg_core_1.text)('content').notNull(),
    embedding: (0, pg_core_1.vector)('embedding', { dimensions: 1536 }).notNull(),
});
