//Corporate Cats
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { initializeCanvas, readPsd, writePsd, byteArrayToBase64 } from "ag-psd";
import * as Canvas from "canvas";

const mintNumber = 2000;
const canvasSize = 1440;
const sizePercentage = 100;

function formatNumber(num) {
  return num < mintNumber ? num.toString().padStart(4, '0') : num.toString();
}

const createCanvas = (width, height) => {
  const canvas = Canvas.createCanvas(width, height);
  canvas.width = width;
  canvas.height = height;
  return canvas;
};


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
  // ctx.scale(scale, scale);

  ctx.drawImage(image, 0, 0);
  // always clean up! Reverse the scale
  // ctx.scale(-scale, -scale);

  return canvas;
};

function saveImage(filename, data) {
  fs.writeFileSync(filename, data, function (err) {
    if (err) {
      console.log(err);
    } else {
      // console.log("The file was saved!");
    }
  });
}
function showLayers(layer) {
  layer.hidden = false;
  layer.children?.forEach((child) => showLayers(child));
}

function newPSD(psdInput) {
  const psd = {
    width: psdInput.width * (sizePercentage / 100),
    height: psdInput.height * (sizePercentage / 100),
    children: psdInput.children,
  };
  return psd;
}

initializeCanvas(createCanvas, createCanvasFromData);
const collection = [];
for (var i = 0; i < mintNumber; i++) {
  // read only document structure
  const buffer = fs.readFileSync("./psd/image" + i.toString() + ".psd");
  const psd = readPsd(buffer);

  // // psd.children=psd.children.reverse();
  const canvas = Canvas.createCanvas(psd.width, psd.height);
  const canvas2 = Canvas.createCanvas(canvasSize, canvasSize);

  const ctx = canvas.getContext("2d");
  const ctx2 = canvas2.getContext("2d");
  psd.children.forEach(group => group.children.forEach(layer => { if (layer.hidden == false && group.hidden == false) { ctx.drawImage(layer.canvas, layer.left, layer.top) } }));
  ctx2.drawImage(canvas, 0, 0, psd.width, psd.height, 0, 0, canvasSize, canvasSize);

  // console.log(byteArrayToBase64(psd.imageData.data));
  let name = formatNumber(i).toString();

  const path = "./images/" + name.toString() + ".png";
  const bufferOut = psd.canvas.toBuffer("image/png");
  fs.writeFileSync(path, bufferOut);

  saveImage(path, canvas2.toBuffer());
  const metaData =
  {
    "image_name": name + ".png",
    "attributes": []
  };
  metaData.attributes = psd.children.map(item => {
    if(item.children[0].name.toLowerCase().includes("[show-")){
      item.children[0].name = item.children[0].name.split("[")[0];
    }
    return {
      "category": item.name,
      "value": item.children[0].name
    }
  });
  collection.push(metaData);
  const jsonData = JSON.stringify(metaData, null, 4);

  // Save JSON data to a file (for Node.js environment)
  // fs.writeFileSync("./images/" + i + ".json", jsonData);


}

const metaDataFinal =
{
  "name": "PsyCats",
  "description": "",
  "collection": collection
};
const jsonDataFinal = JSON.stringify(metaDataFinal, null, 4);

// Save JSON data to a file (for Node.js environment)
fs.writeFileSync("./images/metadata.json", jsonDataFinal);