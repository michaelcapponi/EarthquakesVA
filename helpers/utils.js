var magDiv = document.getElementById("magPanel");
var showValues = document.getElementById("showValues")
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var place1Div = document.getElementById("place1");
var place2Div = document.getElementById("place2");


function movingMean(dati)
{ 
  var sum=0
  var len=dati.length
  for (i=0;i<len;i++)
  { 
    sum=sum+dati[i];
  }
  var result=sum/parseFloat(len)
  return result
}

function freq(dat)
{
   var freqData=[]
   for (i=0;i<dat.length;i++)
   {
   		freqData.push(+dat[i][0])
   }
   return freqData
}


function unique(origArr) {
  var newArr = [],
      origLen = origArr.length,
      found, x, y;

  for (x = 0; x < origLen; x++) {
      found = undefined;
      for (y = 0; y < newArr.length; y++) {
          if (origArr[x] === newArr[y]) {
              found = true;
              break;
          }
      }
      if (!found) {
          newArr.push(origArr[x]);
      }
  }
  return newArr;
}

function list_push(data){
  var list = document.querySelector("select[name='select']");
  var l = list.options.length;
  for (i = l-1; i >= 0 ; i--){
    list.options[i]=null
  }
  for (i = 0; i < data.length; i++){
    list.options[list.options.length] = new Option(data[i], data[i]);
    if (data[i] == "2020"){
      list.options[list.options.length-1].checked = true;
      manager.triggerYearFilterEvent(data[i]);
    } 
  }
}




function chooseColorByMag(mag,plID){
  if (manager.compareMode == true && plID != 0){
    if (plID == 1){
      if /*(mag<4.5){ return    '#c7e9c0'} 
      else if (mag<5){ return   "#a1d99b"} 
      else if */(mag<5){ return "#57be73"} 
      else if (mag<6){ return   "#207a3e"} 
      else if (mag<7){ return   "#015021"} 
      else{ return              "#00250f"} 
    }
    else{
      if /*(mag<4.5){ return      '#dadaeb'} 
      else if (mag<5){ return   "#E9CFEC"} 
      else if */(mag<5){ return "#e252be"} 
      else if (mag<6){ return   "#a52d7d"} 
      else if (mag<7){ return   "#8400e9"} 
      else{ return              "#311432"} 
    }
  }
  else if (manager.compareMode == false && plID == 1){
    if /*(mag<4.5){ return      '#c7e9c0'} 
    else if (mag<5){ return   "#a1d99b"} 
    else if */(mag<5){ return "#57be73"} 
    else if (mag<6){ return   "#207a3e"} 
    else if (mag<7){ return   "#015021"} 
    else{ return              "#00250f"} 
  }
  else{
    if /*(mag<4.5){ return      '#c7e9c0'} 
    else if (mag<5){ return   "#a1d99b"} 
    else if */(mag<5){ return "#FFC281"} 
    else if (mag<6){ return   "#EF7215"} 
    else if (mag<7){ return   "#B80F0A"} 
    else{ return              "#3A1F04"} 
  }
  
}
