var clientWidth = document.documentElement.clientWidth;
var clientHeight = document.documentElement.clientHeight;

var margin_parallel = { top: 30, right: 30, bottom: 10, left: 55 },
 width_parallel = (clientWidth - margin_parallel.left - margin_parallel.right)*0.5,
 height_parallel = (clientHeight - margin_parallel.top -margin_parallel.bottom)*0.4;

var marginBar = {top: 20, right: 20, bottom: 70, left: 50},
 widthBar = (clientWidth - marginBar.left - marginBar.right)*0.35,
 heightBar = (clientHeight - marginBar.top - marginBar.bottom)*0.33;

var marginScatter = {top: 20, right: 20, bottom: 70, left: 40},
 widthScatter = (clientWidth - marginScatter.left - marginScatter.right)*0.35,
 heightScatter = (clientHeight - marginScatter.top - marginScatter.bottom)*0.35;

var marginLine = {top: 30, right: 30, bottom: 20, left: 60},
 widthLine = (clientWidth - marginLine.left - marginLine.right)*0.42,
 heightLine = (clientHeight - marginLine.top - marginLine.bottom)*0.35;

var marginDepth = {top: 10, right: 30, bottom: 30, left: 30},
 widthDepth = (clientWidth - marginDepth.left - marginDepth.right)*0.05,
 heightDepth = (clientHeight - marginDepth.top - marginDepth.bottom)*0.20;

var marginDepth2 = {top2: 10, right2: 20, bottom2: 30, left2: -10},
 widthDepth2 = (clientWidth - marginDepth2.left2 - marginDepth2.right2)*0.05,
 heightDepth2 = (clientHeight - marginDepth2.top2 - marginDepth2.bottom2)*0.2;

 var marginBox = {top: 10, right: 30, bottom: 30, left: 30},
 widthBox = (clientWidth - marginBox.left - marginBox.right)*0.05,
 heightBox = (clientHeight - marginBox.top - marginBox.bottom)*0.2;

 var marginBox2 = {top2: 10, right2: 40, bottom2: 30, left2: -10},
 widthBox2 = (clientWidth - marginBox2.left2 - marginBox2.right2)*0.05,
 heightBox2 = (clientHeight - marginBox2.top2 - marginBox2.bottom2)*0.2;

var widthRadar = clientWidth*0.15,
 heightRadar = clientWidth*0.15;
