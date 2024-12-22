import { mockDeep } from 'jest-mock-extended';
import {
  QueryDocumentSnapshot,
  DocumentData,
  SnapshotMetadata,
  Firestore,
  CollectionReference,
} from 'firebase/firestore';

jest.mock('./config/firebaseConfig', () => {
  const mockedFirestore = mockDeep<typeof import('firebase/firestore')>();

  // Mocked DocumentSnapshot
  const mockedDocSnapshot: QueryDocumentSnapshot<DocumentData> = {
    exists(this: QueryDocumentSnapshot<DocumentData>): this is QueryDocumentSnapshot<DocumentData> {
      return true;
    },
    data: jest.fn(() => ({
      id: 'test-user',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    get: jest.fn(),
    id: 'test-user',
    metadata: { fromCache: false, hasPendingWrites: false } as SnapshotMetadata,
    ref: {} as any,
  };

  mockedFirestore.getDoc.mockResolvedValue(mockedDocSnapshot);

  // Mock `collection()` to return a CollectionReference
  const mockCollection = {
    id: 'users', // ID of the collection
    path: 'users', // Path of the collection
    parent: null as any, // Root-level collection has no parent
  } as Partial<CollectionReference<DocumentData>>;
// Mock `collection` with support for Firestore or CollectionReference
mockedFirestore.collection.mockImplementation((...args: any[]) => {
  // First overload: Firestore as the first argument
  if (args[0] instanceof Object && 'app' in args[0]) {
    const [firestore, path] = args;
    return {
      id: path,
      path,
      parent: null,
      type: 'collection',
    } as CollectionReference<DocumentData>;
  }

  // Second overload: CollectionReference as the first argument
  if ('type' in args[0] && args[0].type === 'collection') {
    const [reference, path] = args;
    return {
      id: path,
      path: `${reference.path}/${path}`,
      parent: reference,
      type: 'collection',
    } as CollectionReference<DocumentData>;
  }

  throw new Error('Invalid arguments provided to collection()');
});

  return { db: mockedFirestore };
});
