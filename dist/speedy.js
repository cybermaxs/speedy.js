!function(t){this.w=t,this.log=null;var n={reset:"font-size:12px;z-index:99999;text-align:left;font-family:Calibri,'Lucida Grande',Arial,sans-serif;text-shadow:none;box-shadow:none;display:inline-block;color:#444;font-weight:normal;border:none;margin:0;padding:0;background:none;",element:"position:fixed;margin:0 auto;top: 0;left:0;right:0;border-bottom:solid 1px #EFCEA1;box-shadow:0 2px 5px rgba(0,0,0,.1);",container:"background:#FFFDF2;background:rgba(255,253,242,.99);padding:2px;display:block;",header:"font-size:12px;font-weight:normal;margin:0 ;width:auto",button:"float:right;background:none;border-radius:5px;padding:2px;font-size:12px;line-height:130%;width:auto;margin:0 ;cursor:pointer"},e=["navigationStart","redirectStart","redirectEnd","fetchStart","domainLookupStart","domainLookupEnd","connectStart","secureConnectionStart","connectEnd","requestStart","responseStart","responseEnd","unloadEventStart","unloadEventEnd","domLoading","domInteractive","msFirstPaint","domContentLoadedEventStart","domContentLoadedEventEnd","domContentLoaded","domComplete","loadEventStart","loadEventEnd"],o=[{name:"network",color:[224,84,63],firstEventIndex:e.indexOf("navigationStart"),lastEventIndex:e.indexOf("connectEnd")},{name:"server",color:[255,188,0],firstEventIndex:e.indexOf("requestStart"),lastEventIndex:e.indexOf("responseEnd")},{name:"browser",color:[16,173,171],firstEventIndex:e.indexOf("unloadEventStart"),lastEventIndex:e.indexOf("loadEventEnd")}],r=function(t){var n=Object.keys(t);return n.length?n:Object.keys(Object.getPrototypeOf(t))},i=function(){for(var t=this.w.performance,n=t.timing,e=r(n),o={},i=n.navigationStart||0,a=0,s=0,d=e.length;d>s;s++){var c=n[e[s]];c&&c>0&&(a=c-i,o[e[s]]={time:a})}return o},a=function(){var t=document.createElement("div"),e=document.createElement("span"),o="";if(this.w.performance&&this.log){for(var r=0,i=this.log.sections.length;i>r;r++)o+='<span style="color:rgb('+this.log.sections[r].color.join(",")+')">'+this.log.sections[r].duration+" ms ("+this.log.sections[r].name+") </span> "+(i-1>r?" +":"");o='Page Load Time <span style="font-weight:bold">'+this.log.totaltime+" ms </span>  => "+o}else o="Your browser does not support Navigation Timing API.";return e.innerHTML=o,e.style.cssText=n.reset+n.header,t.appendChild(e),t},s=function(){var t=document.createElement("button");return t.innerHTML="close this box &times;",t.style.cssText=n.reset+n.button,t},d=function(){var t=this.w.document.createElement("div"),e=a(),o=s();return o.onclick=function(){o.onclick=null,t.parentNode.removeChild(t)},t.style.cssText=n.reset+n.container+n.element,e.appendChild(o),t.appendChild(e),t},c=function(){var t={totaltime:0,sections:[],ressources:[]};if(this.w.performance){for(var n=i(),r=0,a=o.length;a>r;r++){var s=o[r].firstEventIndex,d=o[r].lastEventIndex,c=e.slice(s,d+1),l=c.filter(function(t){return n.hasOwnProperty(t)});l.sort(function(t,e){return n[t].time-n[e].time}),s=l[0],d=l[l.length-1],t.sections.push({name:o[r].name,duration:n[d].time-n[s].time,color:o[r].color});for(var u=0,m=l.length;m>u;u++){var f=l[u];n[f]&&(n[f].sectionIndex=r)}}for(var p in t.sections)t.totaltime+=t.sections[p].duration;this.w.performance.getEntries&&(t.ressources=this.w.performance.getEntries().map(function(t){return{name:t.name,duration:t.duration}}))}this.log=t},l=function(){this.log||c();var t=d();document.body.appendChild(t)},u=function(t){var n=this.w.onload;this.w.onload="function"!=typeof this.w.onload?t:function(){n&&n(),t()}};"complete"===this.w.document.readyState?l():u(l)}(window);