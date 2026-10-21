import fs from 'node:fs';
import {CodexProvider} from './codex.mjs';
import {sha} from '../util.mjs';
export class FrozenCodexProvider extends CodexProvider{
 constructor(configuration){
  super({model:configuration.model_configuration.requested_model,reasoning:configuration.model_configuration.reasoning,timeout_ms:240000});
  if(!fs.existsSync(configuration.executable)||sha(fs.readFileSync(configuration.executable))!==configuration.executable_sha256)throw Error('FROZEN_CODEX_EXECUTABLE_CHANGED');
  this.exe=configuration.executable;
 }
}
