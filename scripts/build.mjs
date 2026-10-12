import {copyFileSync,mkdirSync} from 'node:fs';
import * as sass from 'sass';
import {writeFileSync} from 'node:fs';
for(const [entry,out] of [['src/syx.scss','dist/assets/syx-frame4.css'],['src/wow4.scss','dist/assets/wow4.css']]){
 const result=sass.compile(entry,{style:'compressed',silenceDeprecations:['import','global-builtin','color-functions']});
 writeFileSync(out,result.css);
}
console.log('FRAME IV: SYX theme and project SCSS compiled.');

mkdirSync("dist/assets/gsap",{recursive:true});
for(const name of ["gsap.min.js","ScrollTrigger.min.js","MotionPathPlugin.min.js"]){copyFileSync("node_modules/gsap/dist/"+name,"dist/assets/gsap/"+name);}
writeFileSync("dist/assets/gsap/LICENSE-NOTICE.txt","GSAP 3.15.0 — Copyright 2026 GreenSock. All rights reserved.\nLicense: https://gsap.com/standard-license\nOriginal license notices are retained in each JavaScript file.\n");
