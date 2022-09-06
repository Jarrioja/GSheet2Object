const dotEnv = require("dotenv");
dotEnv.config();
const axios = require("axios");

const url =
  "https://docs.google.com/spreadsheets/d/1PZMEyiHiE0LSa5hUjZH-RoV7Lo5X5L4yOVQZb3IG7NE/edit#gid=0"; //Se requiere URL

const spreadsheetId = url.match("(?<=/spreadsheets/d/)(.*)[/]")[1];

async function getColumns(spreadsheetId) {
  const sheetName = await axios
    .get(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets&key=${process.env.GOOGLE_SHEET_API_KEY}`
    )
    .then((sheetInfo) => {
      return sheetInfo.data.sheets[0].properties.title;
    });

  const rawColumns = await axios
    .get(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURI(
        sheetName
      )}?majorDimension=COLUMNS&key=${process.env.GOOGLE_SHEET_API_KEY}`
    )
    .then((response) => {
      //console.log(response.data.values);
      return response.data.values;
    });
  let obj = {};
  rawColumns.forEach((col) => {
    let colIndex = col.shift();
    obj[colIndex] = col;
  });
  return obj;
}

async function main(spreadsheetId) {
  const columns = await getColumns(spreadsheetId);
  console.log(columns);
}

main(spreadsheetId);
