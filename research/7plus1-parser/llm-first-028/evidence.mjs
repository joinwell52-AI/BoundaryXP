import fs from 'node:fs';
import path from 'node:path';
import {ROOT} from './bundle.mjs';
import {sha256} from './source.mjs';
export function fileInventory(directory){
 return fs.readdirSync(directory,{withFileTypes:true}).flatMap(e=>e.isDirectory()?fileInventory(path.join(directory,e.name)):e.isFile()?[path.join(directory,e.name)]:[]).sort();
}
export function implementationInventory(){return fileInventory(ROOT).map(file=>({path:path.relative(ROOT,file).replaceAll('\\','/'),sha256:sha256(fs.readFileSync(file))}));}
export function verifyInventory(inventory){return inventory.filter(x=>sha256(fs.readFileSync(path.join(ROOT,x.path)))!==x.sha256);}
