import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Category { 'name' : string, 'description' : string }
export interface _SERVICE {
  'addCategory' : ActorMethod<[string, string], undefined>,
  'getCategories' : ActorMethod<[], Array<Category>>,
  'initializeCategories' : ActorMethod<[], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
