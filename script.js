//Corporate Cats
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { initializeCanvas, readPsd, writePsd } from "ag-psd";
import * as Canvas from "canvas";
import { exit } from "process";
import sharp from 'sharp';
import excelToJson from 'convert-excel-to-json';
import pkg from "json2xls";
console.time('test');

const mintNumber = 2000;
const sizePercentage = 100;
const scale = sizePercentage / 100;
const canvasSize = 1200 * (sizePercentage / 100)
const psdFileName  = "psy cats"
function newPSD(psdInput, sizePercentage) {
  const psd = {
    width: psdInput.width * (sizePercentage / 100),
    height: psdInput.height * (sizePercentage / 100),
    children: [],
  };
  return psd;
}
function hideLayers(layer) {
  layer.hidden = true;
  layer.children?.forEach((child) => hideLayers(child));
}
function showLayers(layer) {
  layer.hidden = false;
  layer.children?.forEach((child) => hideLayers(child));
}

function convertToJSON(array) {
  var first = array[0].join()
  var headers = first.split(',');

  var jsonData = [];
  for (var i = 1, length = array.length; i < length; i++) {

    var myRow = array[i].join();
    var row = myRow.split(',');

    var data = {};
    for (var x = 0; x < row.length; x++) {
      data[headers[x]] = row[x];
    }
    jsonData.push(data);

  }
  return jsonData;
};
function saveLayerExcel(data, fileName) {
  // excel
  const json2xls = pkg;
  var xls = json2xls(data);
  fs.writeFileSync(fileName+".xlsx", xls, 'binary', (err) => {
    if (err) {
      console.log("writeFileSync :", err);
    }
    console.log(filename + " file is saved!");
  });
}
function rangeOfNumbers(start, end) {
  return Array.from({ length: end - start + 1 });
}
// The generator.  Return anything, not just numbers.
const randomizeSet = arr => {
  const newArr = arr.slice()
  for (let i = newArr.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
  }
  return newArr
};
const randomSet = (n) => Math.ceil(Math.random() * n);
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
function getRandomData(rarityData) {
  const layerData = {};
  groups.forEach((group) => {
    let set = [];
    for (var i = 0; i < mintNumber; i++) {

      const random = randomSet(group.children.length) - 1;

      rarityData.push({ Group: group.name, Layer: group.children[random].name, LayerIndex: random, Percentage: 0, Count: 0 });

      set.push(random);



      // console.log(group.name,group.children.length,random);

    }
    layerData[group.name] = set;
  });
}

function savePSDFile(i){
  let fileName = ""
  let addEffect = false

  psdList[i].children.forEach((group, index) => {
    try {
      fileName = fileName + " " + group.name;
      const layerRating = rarityData.find(_layer => _layer.Layer == group.children[0].name.trim() && _layer.Group == group.name);
      if(layerRating){
        layerRating.Count += 1;

      }
      var find = '-';
      var re = new RegExp(find, 'g');
      const value = group.children[0].name.split("[")[0].replace(re, ' ');
      const finalValue = value.charAt(0).toUpperCase() + value.slice(1);
      psdList[i].children.forEach((item, itemIndex) => {
        item.children[0].hidden = false
  
        if (item.children[0].name.toLowerCase().includes("[show-")) {
          addEffect = true;
          

          // item.children[0].name = item.children[0].name.split("[")[0].replace(re, ' ');
        }

      }
      );
    } catch (error) {
      console.log(group.children[0].name);
    }
  }
  );
  if(addEffect){
    const group = groups.find(_group => _group.name == "front effect" );
    group.hidden = false;
    group.children[0].hidden = false;
    psdList[i].children.splice(4, 0, group);
  }


  const outputBuffer = writePsd(psdList[i]);

  fs.writeFileSync("./psd/image" + i + ".psd", Buffer.from(outputBuffer));
  
}
const buffer = fs.readFileSync("./"+psdFileName+".psd");
const createCanvas = (width, height) => {
  const canvas = Canvas.createCanvas(width, height);
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

const readExcel = () => {

  const result = excelToJson({
    sourceFile: 'ratings.xlsx',
    header: {
      // Is the number of rows that will be skipped and will not be present at our result object. Counting from top to bottom
      rows: 1 // 2, 3, 4, etc.
    },
    columnToKey: {
      A: 'Group',
      B: 'Layer',
      C: 'LayerIndex',
      D: 'Percentage',

      E: 'Count'

    }
  });
  const rarityData = result ? result['Sheet 1'].filter(item => item.Layer !== "Total"): null;
  return rarityData;
}
const createCanvasFromData = (data) => {
  const image = new Image();
  image.src = "data:image/jpeg;base64," + agPsd.byteArrayToBase64(data);
  const canvas = Canvas.createCanvas(canvasSize, canvasSize);
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  // drawImage(img,0,0,150,150,0,0,300,300);
  const ctx = canvas.getContext("2d")
  ctx.canvas.width = canvasSize;
  ctx.canvas.height = canvasSize;

  // context.scale will scale the original drawings to fit on
  // the newly resized canvas
  ctx.scale(scale, scale);

  ctx.drawImage(image, 0, 0);
  // always clean up! Reverse the scale
  ctx.scale(-scale, -scale);

  return canvas;
};

initializeCanvas(createCanvas, createCanvasFromData);

// read only document structure
const psd = readPsd(buffer, { useImageData: true });

hideLayers(psd);
let layerData = {};
const exportData = [];
let rarityData = [];

const groups = psd.children;

groups.forEach(item => {
  item.children.forEach((layer, index) => {
    exportData.push({ Group: item.name, Layer: layer.name, LayerIndex: index, Percentage: 0, Count: 0 });

  });
  exportData.push({ Group: "Total", Layer: "", LayerIndex: null, Percentage: 0, Count: 0 });
});

saveLayerExcel(exportData,"layers");
// groups.forEach((group) => {
//   let set = [];
//   for (var i = 0; i < mintNumber; i++) {

//     const random = randomSet(group.children.length) - 1;

//     rarityData.push({ Group: group.name, Layer: group.children[random].name, LayerIndex: random, Percentage: 0, Count: 0 });

//     set.push(random);
//     // console.log(group.name,group.children.length,random);

//   }
//   layerData[group.name] = set;
// });

rarityData = readExcel();
const rarityDataExport = [];
const layerDataOverride = {};
if (rarityData.length > 0) {
  // console.log(rarityData)
  const list = rarityData.filter(layer => layer.Group !== "Total" || (layer.Layer && layer.Layer.toLowerCase() !== "none"));
  list.forEach(layer => {
    const numberForLayer = mintNumber * (layer.Percentage / 100);
    if (layer.LayerIndex == 127) {
      console.log("");
    }
    layerData[layer.Group] && layerData[layer.Group].length > 0 ? layerData[layer.Group] : layerData[layer.Group] = [];
    layerData[layer.Group] = [...layerData[layer.Group], ...rangeOfNumbers(0, numberForLayer - 1).map(item => layer.LayerIndex)]
    layerData[layer.Group] = randomizeSet(layerData[layer.Group])

    rarityDataExport.push(layerData[layer.Group]);
  });
}
// } else {
//   layerData = getRandomData(rarityData);
// }
// console.log(layerData)
// excel
// var xls = json2xls();
// fs.writeFileSync("rarityDataExport.xlsx", xls, 'binary', (err) => {
//   if (err) {
//     console.log("writeFileSync :", err);
//   }
//   console.log(filename + " file is saved!");
// });
saveLayerExcel(rarityDataExport,"rarityDataExport");

groups.forEach(item => {
  item.width = canvasSize;
  item.height = canvasSize;
  item.children.forEach((layer, index) => {
    layer.width = canvasSize;
    layer.height = canvasSize;
    exportData.push({ Group: item.name, Layer: layer.name, LayerIndex: index, Percentage: 0, Count: 0 });

    // if (sizePercentage !== 100) {
    //   const imageData = layer.imageData;
    //   if (!!imageData && !!imageData.data) {
    //     const canvas = Canvas.createCanvas(1200, 1200);
    //     const canvas2 = Canvas.createCanvas(canvasSize, canvasSize);

    //     const ctx = canvas.getContext("2d");
    //     const ctx2 = canvas2.getContext("2d");
    //     ctx.putImageData(imageData, 0, 0);
    //     ctx2.drawImage(canvas, 0, 0, 1200, 1200, 0, 0, canvasSize, canvasSize);

    //     layer.canvas = canvas2;
    //     layer.top = layer.top * scale;
    //     layer.bottom = layer.bottom * scale;
    //     layer.left = layer.left * scale;
    //     layer.right = layer.right * scale;
    //     layer.referencePoint.x = layer.referencePoint.x * scale;
    //     layer.referencePoint.y = layer.referencePoint.y * scale;
    //     layer.imageData = null;
    //   }

    // }
  }
  );

});


const psdList = [];
for (var i = 0; i < mintNumber; i++) {
  hideLayers(psd);

  const psdTemp = newPSD(psd, sizePercentage);

  groups.forEach(async (group) => {
    group.hidden = false;

    const mockGroup = { ...group };
    try {
      if (layerData[group.name][i] !== undefined) {
        mockGroup.children = [group.children[layerData[group.name][i]]];
        mockGroup.children[0].hidden = false;
        psdTemp.children.push(mockGroup);
      }
    }
    catch (error) {
      console.log(group.name, layerData[group.name][i])
    }


  });
  psdList.push(psdTemp);
}

const metaData = [];

for (var i = 0; i < mintNumber; i++) {
  savePSDFile(i);
}


let blob = new Blob([JSON.stringify(metaData)], { type: 'application/json' })
const data = await blob.arrayBuffer()
fs.writeFileSync("metadata.json", Buffer.from(data), (err) => {
  if (err) {
    console.log("writeFileSync :", err);
  }
  console.log(filename + " file is saved!");
});

const json2xls = pkg;
var xls = json2xls(rarityData);
fs.writeFileSync("rarityDataExport.xlsx", xls, 'binary', (err) => {
  if (err) {
    console.log("writeFileSync :", err);
  }
  console.log(filename + " file is saved!");
});
console.timeEnd('test');

// fs.write("./info" + i + ".dat", layerData);
