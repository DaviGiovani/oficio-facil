export class LocalStorageRepository<T extends { id: string }> {
  private readonly storageKey: string;

  constructor(collectionName: string) {
    this.storageKey = `@oficio_facil:${collectionName}`;
  }

  private getStorage(): Storage | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
      return globalThis.localStorage;
    }
    return null;
  }

  private getCollection(): T[] {
    try {
      const storage = this.getStorage();
      if (!storage) return [];

      const data = storage.getItem(this.storageKey);
      return data ? (JSON.parse(data) as T[]) : [];
    } catch (e) {
      console.error(`Erro ao carregar dados da chave ${this.storageKey}:`, e);
      return [];
    }
  }

  private saveCollection(items: T[]): void {
    try {
      const storage = this.getStorage();
      if (!storage) {
        throw new Error('Mecanismo de armazenamento LocalStorage não disponível.');
      }
      storage.setItem(this.storageKey, JSON.stringify(items));
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        throw new Error('Limite de armazenamento local atingido. Exporte um backup.');
      }
      throw e;
    }
  }

  public getAll(): T[] {
    return this.getCollection();
  }

  public getById(id: string): T | undefined {
    return this.getCollection().find((item) => item.id === id);
  }

  public insert(item: T): void {
    const items = this.getCollection();
    items.push(item);
    this.saveCollection(items);
  }

  public update(id: string, updatedItem: Partial<T>): void {
    const items = this.getCollection();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Item ${id} não localizado para atualização.`);
    }

    items[index] = { ...items[index], ...updatedItem };
    this.saveCollection(items);
  }

  public delete(id: string): void {
    const items = this.getCollection().filter((item) => item.id !== id);
    this.saveCollection(items);
  }

  public clear(): void {
    const storage = this.getStorage();
    if (storage) {
      storage.removeItem(this.storageKey);
    }
  }
}
