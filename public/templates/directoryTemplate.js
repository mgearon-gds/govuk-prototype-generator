// directoryTemplate.js

const directoryTemplate = (fileList) => `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="utf-8">
    <title>Generated Pages Directory</title>
  </head>

  <body>
    <h1>Generated Pages Directory</h1>
    <ul>
      ${fileList.map((filename) => `<li><a href="/${filename}">${filename}</a></li>`).join('')}
    </ul>
  </body>

  </html>
`;

module.exports = directoryTemplate;