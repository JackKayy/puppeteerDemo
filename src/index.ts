

const puppeteer = require('puppeteer');
const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const relativePath = path.join('src', 'assets', 'UILOGO.png');
const relativePath2 = path.join('src', 'assets', 'TSImg.png');

// run npx tsc to compile then node dist/index.js to produce pdf, must either delete pdf or change pdfPath to another name to see result

// Sample Product Data 
interface Product {
  shortTitle: string;
  SKU: number;
  name: string;
  dimensions: string;
  weight: string;
  enclosure: string;
  sensor: string;
  lens: string;
  video: string;
  res: string;
}

const productData: Product[] = [
  {
    shortTitle: 'Dream Router',
    SKU: 9310203,
    name: 'UDR',
    dimensions: '207 x 223.7 x 341.3 mm (8.15 x 8.81 x 13.44")',
    weight: 'Without mount: 3.8kg With mount: 6.8kg',
    enclosure: 'metal and plastic',
    sensor: 'Sony 4K 8 MP 1 1.8 CMOS sensor',
    lens: '22x Optical zoom',
    video: 'H.264',
    res: '4K2K 3840 x 2160'
  }
]

export async function generatePdf(data: Product[]) {

    const imageData = fs.readFileSync(relativePath);
    const dataURI = `data:image/png;base64,${imageData.toString('base64')}`;

    const imageData2 = fs.readFileSync(relativePath2);
    const dataURI2 = `data:image/png;base64,${imageData2.toString('base64')}`;

   // Use context object to access values for now
   const context = {
    fileUrl: dataURI,
    fileUrl2: dataURI2,
    shortTitle: data[0].shortTitle,
    SKU: data[0].SKU,
    name: data[0].name,
    dimensions: data[0].dimensions,
    weight: data[0].weight,
    enclosure: data[0].enclosure,
    sensor: data[0].sensor,
    lens: data[0].lens,
    video: data[0].video,
    res: data[0].res
    };


    // Only way it currently works is with the handlebar inside this file
    const template = `<!DOCTYPE html>
    <html>
    <head>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap">
    
    <style>
      @font-face {
        font-family: 'Lato';
        font-style: normal;
        font-weight: 400;
        src: url(https://fonts.gstatic.com/s/lato/v22/S6uyw4BMUTPHjxAwWw.ttf) format('truetype');
      }
  
      @font-face {
        font-family: 'Lato';
        font-style: normal;
        font-weight: 700;
        src: url(https://fonts.gstatic.com/s/lato/v22/S6u8w4BMUTPHh6UVSwiPHA.ttf) format('truetype');
      }
    
    .product-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 55px;
        height: 100vh; // I Guess only way to create seperate pages
    }
    
    .product-image {
        width: 118px;
        height: 118px;
        
    }

    .tech-image {
       max-width: 500px;
        height: auto;
        margin-top: 77px;
    }
    
    .product-details {
        font-family: 'Lato';
        font-size: 12px;
        font-weight: 400;
        color: #BEBEBE;
        margin-top: 16px;
        text-align: center;
    }
    
    .short-title {
        margin-top: 15px;
        font-family: 'Lato';
        font-size: 32px;
        font-weight: 700;
        color: #393A3F;
    }

    .row {
        padding: 6px 0px;
        border-top: 1px solid #4A4A4A;
        border-bottom: 1px solid #4A4A4A;
    }

    tr {
        padding: 6px 0px;
        border-top: 1px solid #4A4A4A;
        border-bottom: 1px solid #4A4A4A;
    }

    .datasheet {
        padding: 40px;
    }

    .data {
        min-width: 100%;
    }

    .property {
        text-align: left;
    }

    .value {
        text-align: right;
    }

   
    </style>
    </head>
    <body>

    <div class="product-container">
    <img class="product-image" src="{{fileUrl}}" alt="{{shortTitle}}" />
        <div class="short-title">{{shortTitle}}</div>
        <div class="product-details">
        <div>SKU : {{SKU}}</div>
        <div>{{name}}</div>
        </div>
        <img class="tech-image" src="{{fileUrl2}}" alt="{{shortTitle}}" />
    </div>
    <div class="datasheet">
    <table class="data">
        <tbody>
            <tr class="row">
            <td class="property">Dimensions</td>
            <td class="value">{{dimensions}}</td>
            </tr>
            <tr class="row">
            <td class="property">Weight</td>
            <td class="value">{{weight}}</td>
            </tr>
            <tr class="row">
            <td class="property">Enclosure</td>
            <td class="value">{{enclosure}}</td>
            </tr>
            <tr class="row">
            <td class="property">Sensor</td>
            <td class="value">{{sensor}}</td>
            </tr>
            <tr class="row">
            <td class="property">Lens</td>
            <td class="value">{{lens}}</td>
            </tr>
            <tr class="row">
            <td class="property">Video</td>
            <td class="value">{{video}}</td>
            </tr>
            <tr class="row">
            <td class="property">Resolution</td>
            <td class="value">{{res}}</td>
            </tr>
        </tbody>
    </table>
    </div>
    
    </body>
    </html>`;
  
    const compiledTemplate = Handlebars.compile(template);
  
   
  
    const html = compiledTemplate(context);
    // Launch Browser and create page.
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    /* 
    Waits for all page properties to load, networkidle0 = navigation is finished when there are no more than 0 network connections for at least 500 ms. 
     */
    await page.setContent(html, { waitUntil: 'networkidle2' });
    const pdfPath = 'pdf/b.pdf';
    // emulateMediaTypes changes the CSS media type of the page.
    await page.emulateMediaType('screen');
    await page.waitForTimeout(1000);
  
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      displayHeaderFooter: true,
      // If graphical elements are still missing, turning printBackground to true may help.
      printBackground: true,
    });
    // Close Browser
    await browser.close();
  }
  

generatePdf(productData);