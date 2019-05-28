/* global app */

// eslint-disable-next-line no-unused-vars
function placeImage(file, layer, position = [0, 0]) {
  const img = app.activeDocument.placedItems.add();
  img.file = new File(file);
  img.layer = layer;
  img.position = position;
  return img;
}
