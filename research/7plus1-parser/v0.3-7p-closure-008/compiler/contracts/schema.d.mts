import type {ContractMap} from './registry.js';
export const CONTRACT_VERSION: '0.3';
export function makeContract<K extends keyof ContractMap>(name:K,data:ContractMap[K]):ContractMap[K];
export function assertContract<K extends keyof ContractMap>(name:K,data:unknown):ContractMap[K];
export function validateContract<K extends keyof ContractMap>(name:K,data:unknown):{valid:boolean;errors:unknown[]};
export function serialize<K extends keyof ContractMap>(name:K,data:ContractMap[K]):string;
export function deserialize<K extends keyof ContractMap>(name:K,serialized:string):ContractMap[K];
