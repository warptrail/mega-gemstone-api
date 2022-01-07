module.exports = (data) => {
  let widgetRows = [];

  for (let i = 0; i < data.length; i++) {
    widgetRows.push(`
    <tr>
    <td class="service">${data[i].service}</td>
    <td class="email">${data[i].email}</td>
    <td class="username">${data[i].username}</td>
    <td class="pswd">${data[i].pswd}</td>
    </tr>
    `);
  }

  const widgets = widgetRows.join('');

  return `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Example 3</title>
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Rock+Salt&display=swap');
    
    body {
       color: #e007e8;
      background: black;
      font-size: 8px;
    }

    h1 {
      color: #49d10e;
      line-height: 1.4em;
      font-weight: normal;
      text-align: center;
      border-top: 1px solid #5d6975;
      border-bottom: 1px solid #5d6975;
      margin: 0 0 2em 0;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      margin-bottom: 30px;
    }
    
    table th,
    table td {
      text-align: left;
    }
    
    table th {
      padding: 5px 20px;
      color: #49d10e;
      border-bottom: 1px solid #c1ced9;
      white-space: nowrap;
      font-weight: normal;
    }
    
    table td.service {
      color: #76e2c4;
    }
    
    table td.pswd {
      color: #ffaa00;
    }
    
    table td {

    }
    
    table td.service,
    table td.desc {
      vertical-align: top;
    }
    
    table tr {
      background: #18404e;
    }
    table tr:nth-child(2n-1) td {
      background: #221f57;
    }

    

    footer {
      color: #14c514;
      position: relative;
      height: 28cm;
      bottom: 0;
      border-top: 1px solid #c1ced9;
      padding: 8px 0;
      margin-top: auto;
    }

    footer span {
      position: absolute;
      bottom: 0;
      left: 0;
    }
    
    </style>
  </head>
  <body>
    <main>
      <h1>Gemstone Directory</h1>
      <table>
        <thead>
          <tr>
            <th class="service">SERVICE</th>
            <th class="email">EMAIL</th>
            <th class="username">USERNAME</th>
            <th class="pswd">PSWD</th>
          </tr>
        </thead>
        <tbody>
          ${widgets}
        </tbody>
      </table>
    </main>
    <footer>
    <span>
    "Compassion: that's the one things no machine ever had. Maybe it's the one thing that keeps men ahead of them." Dr. McCoy, "The Ultimate Computer"
      </span>
    </footer>
  </body>
</html>

  `;
};
