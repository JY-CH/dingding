import { useCallback } from 'react';

const useIndexedDB = (dbName: string, storeName: string) => {
  const openDatabase = useCallback((): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }, [dbName, storeName]);

  const saveData = useCallback(
    async (data: any) => {
      const db = await openDatabase();
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      store.add(data);

      return new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });
    },
    [openDatabase, storeName]
  );

  const getAllData = useCallback(async (): Promise<any[]> => {
    const db = await openDatabase();
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }, [openDatabase, storeName]);

  return { saveData, getAllData };
};

export default useIndexedDB;