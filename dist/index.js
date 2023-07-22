"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePdf = void 0;
const puppeteer = require('puppeteer');
const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const relativePath = path.join('src', 'assets', 'UI.png');
const fileUrl = 'file:///Users/jack.kay/UII.png';
const productData = [
    {
        shortTitle: 'Dream Router',
        SKU: 9310203,
        name: 'UDR',
    }
];
function generatePdf(data) {
    return __awaiter(this, void 0, void 0, function* () {
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
        width: 500px;
        
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
    </div>
    </div>
    </body>
    </html>`;
        const compiledTemplate = Handlebars.compile(template);
        // Use context object to access values for now
        const context = {
            fileUrl: fileUrl,
            shortTitle: data[0].shortTitle,
            SKU: data[0].SKU,
            name: data[0].name,
        };
        const html = compiledTemplate(context);
        // Launch Browser and create page.
        const browser = yield puppeteer.launch();
        const page = yield browser.newPage();
        /*
        Waits for all page properties to load, networkidle0 = navigation is finished when there are no more than 0 network connections for at least 500 ms.
         */
        yield page.setContent(html, { waitUntil: 'networkidle2' });
        const pdfPath = 'pdf/pcitrsjgdcue.pdf';
        // emulateMediaTypes changes the CSS media type of the page.
        yield page.emulateMediaType('screen');
        yield page.waitForTimeout(1000);
        yield page.pdf({
            path: pdfPath,
            format: 'A4',
            displayHeaderFooter: true,
            // If graphical elements are still missing, turning printBackground to true may help.
            printBackground: true,
        });
        // Close Browser
        yield browser.close();
    });
}
exports.generatePdf = generatePdf;
generatePdf(productData);
