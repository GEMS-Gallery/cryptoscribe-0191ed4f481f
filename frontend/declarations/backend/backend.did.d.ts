import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Category { 'name' : string, 'description' : string }
export interface Post {
  'id' : bigint,
  'title' : string,
  'content' : string,
  'categoryName' : string,
  'author' : Principal,
  'timestamp' : bigint,
}
export interface _SERVICE {
  'addCategory' : ActorMethod<[string, string], undefined>,
  'addPost' : ActorMethod<[string, string, string], undefined>,
  'getCategories' : ActorMethod<[], Array<Category>>,
  'getPosts' : ActorMethod<[string], Array<Post>>,
  'initializeCategories' : ActorMethod<[], undefined>,
  'whoami' : ActorMethod<[], Principal>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
