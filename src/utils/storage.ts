import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { SavedMapping, ColumnMappings } from '../types';

interface ITAuditorDB extends DBSchema {
  columnMappings: {
    key: string;
    value: SavedMapping;
    indexes: { 'by-created': string };
  };
}

const DB_NAME = 'ITAuditorTool';
const STORE_NAME = 'columnMappings';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<ITAuditorDB> | null = null;

export const initDB = async (): Promise<IDBPDatabase<ITAuditorDB>> => {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<ITAuditorDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('by-created', 'createdAt');
      }
    },
  });

  return dbInstance;
};

export const saveMappingTemplate = async (
  name: string,
  mappings: ColumnMappings,
  testType: 'provision' | 'deprovision'
): Promise<void> => {
  const db = await initDB();
  const id = `${testType}_${name}_${Date.now()}`;
  
  await db.put(STORE_NAME, {
    id,
    name,
    mappings,
    createdAt: new Date().toISOString(),
  });
};

export const loadMappingTemplates = async (
  testType?: 'provision' | 'deprovision'
): Promise<SavedMapping[]> => {
  const db = await initDB();
  const allMappings = await db.getAll(STORE_NAME);
  
  if (testType) {
    return allMappings.filter((m) => m.id.startsWith(testType));
  }
  
  return allMappings;
};

export const deleteMappingTemplate = async (id: string): Promise<void> => {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
};



