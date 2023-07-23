

const puppeteer = require('puppeteer');
const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const relativePath = path.join('src', 'assets', 'UI.png');
const relativePath2 = path.join('src', 'assets', 'TSImg.png');

// run npx tsc to compile then node dist/index.js to produce pdf, must either delete pdf or change pdfPath to another name to see result

// Sample Product Data 
interface Product {
  shortTitle: string;
  SKU: number;
  name: string;
}

const productData: Product[] = [
  {
    shortTitle: 'Dream Router',
    SKU: 9310203,
    name: 'UDR',
  
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
    }
    
    .product-image {
        width: 100px;
        height: 100px;
        
    }
    
    .product-details {
        font-family: 'Lato';
        font-size: 12px;
        font-weight: 400;
        color: #BEBEBE;
    }
    
    .short-title {
        font-family: 'Lato';
        font-size: 32px;
        font-weight: 700;
        color: #393A3F;
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
        <img class="product-image" src="{{fileUrl2}}" alt="{{shortTitle}}" />
    </div>
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
    const pdfPath = 'pdf/workingnowW.pdf';
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