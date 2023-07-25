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
    dimensions: data[0].dimensions,
    weight: data[0].weight,
    enclosure: data[0].enclosure,
    sensor: data[0].sensor,
    lens: data[0].lens,
    video: data[0].video,
    res: data[0].res
    };

    
    const templateHeader = fs.readFileSync(path.join(__dirname, 'template-header.hbs'), 'utf-8')
    const templateFooter = fs.readFileSync(path.join(__dirname, 'template-footer.hbs'), 'utf-8')


  // #############################################################################
  // PDF DOCUMENT STYLING
  // #############################################################################

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
        height: 100vh; // I Guess only way to create seperate pages
    }
    
    .ui-image {
        width: 118px;
        height: auto;
        text-align: center;
        
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

    .datasheet {
        padding: 0px 40px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th {
        text-align: left;
        color: #4A4A4A;
        font-family: Lato;
        font-size: 11px;
        font-style: normal;
        font-weight: 700;
        line-height: 11px;
        padding: 20px 0px 10px;  
    }

    .row {
        border-bottom: 1px solid #E5E7ED;
        border-top: 1px solid #E5E7ED;
    }

    .property {
        font-family: 'Lato';
        text-align: left;
        padding-top: 6px;
        padding-bottom: 6px;
        color: #4A4A4A;
        font-size: 8px;
        font-weight: 600;
        line-height: 12px;
    }

    .value {
        font-family: 'Lato';
        margin-left: 192px;
        padding-top: 6px;
        padding-bottom: 6px;
        color: #56585A;
        font-size: 8px;
        font-weight: 400;
        line-height: 12px;
    }

   
    </style>
    </head>
    <body>

    <div class="product-container">
    
    <div class="ui-image">
        <svg width="60" height="81" viewBox="0 0 60 81" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_674_20802)">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M57.6629 0.826904H53.9723V4.51423H57.6629V0.826904ZM44.7541 26.6219V19.2473V19.231H52.1352L52.1352 16.0148V11.8889H59.5V19.2473H52.1352L52.1352 26.6057H59.5163V28.9448C59.5163 31.6412 59.2886 34.8413 58.7521 37.359C58.4595 38.7722 58.0043 40.1692 57.484 41.5012C56.9475 42.8819 56.3297 44.1976 55.6469 45.3672C54.7689 46.9103 53.7447 48.3885 52.5579 49.7692L52.5061 49.8308L52.506 49.831L52.5057 49.8312C52.1831 50.2151 51.8722 50.585 51.5174 50.955C51.1597 51.3286 50.7857 51.7022 50.4118 52.0596C45.697 56.5916 39.5353 59.4342 33.1134 60.084C32.333 60.1652 30.7885 60.2464 30.0081 60.2464C29.2277 60.2464 27.6832 60.1652 26.9029 60.084C20.481 59.4342 14.3192 56.5916 9.60443 52.0596C9.2305 51.7022 8.85657 51.3449 8.4989 50.955C8.14394 50.585 7.83293 50.2149 7.51025 49.8309L7.45839 49.7692C6.27156 48.3723 5.24731 46.9103 4.36939 45.3672C3.68655 44.1814 3.06875 42.8657 2.53224 41.5012C2.01199 40.1529 1.55676 38.756 1.26412 37.359C0.727611 34.8413 0.5 31.6412 0.5 28.9448V1.28173H15.2622V26.6219C15.2622 26.6219 15.2622 28.5712 15.2785 29.2047C15.2837 29.3459 15.2885 29.4866 15.2933 29.627C15.3183 30.3586 15.3429 31.0787 15.4248 31.7874C15.6686 34.0616 16.1726 36.222 17.2131 38.0413C17.522 38.5773 17.8309 39.0809 18.1886 39.5682C20.3997 42.5245 23.7813 44.7499 27.9921 45.3672C28.4961 45.4322 29.5041 45.4971 30.0081 45.4971C30.5121 45.4971 31.5201 45.4484 32.0241 45.3672C36.2349 44.7499 39.6166 42.5245 41.8276 39.5682C42.2016 39.0809 42.5105 38.5611 42.8031 38.0413C43.8436 36.222 44.3476 34.0616 44.5915 31.7874C44.6728 30.9265 44.7053 30.0818 44.7378 29.2047C44.7541 28.5712 44.7541 26.6219 44.7541 26.6219ZM46.6075 6.34977H52.1352V11.8726H46.6075V6.34977ZM9.49057 77.2537C9.71818 76.8151 9.76695 76.3115 9.79947 75.8405V69.4729H12.0918V75.808C12.0918 76.2303 12.0431 76.7339 11.9618 77.14C11.8642 77.5623 11.6854 78.0334 11.474 78.407C11.2789 78.7156 11.0676 79.008 10.8237 79.2841C9.94579 80.2263 8.71019 80.7461 7.42581 80.7461C6.14143 80.7461 4.90583 80.21 4.0279 79.2841C3.78403 79.0242 3.55642 78.7156 3.39384 78.407C3.18249 78.0334 2.9874 77.5623 2.88985 77.14C2.80856 76.7339 2.77604 76.2303 2.77604 75.808V69.4729H5.06841V75.9704C5.06841 76.3278 5.13344 76.8313 5.39357 77.3024C5.78376 78.0009 6.56414 78.4557 7.42581 78.4557C8.28748 78.4557 9.0516 78.0009 9.47431 77.2699L9.49057 77.2537ZM16.5628 69.4729H14.2704V80.5186H16.5628V69.4729ZM18.4324 79.4466C18.4324 78.7318 19.0177 78.1471 19.7168 78.1471C20.4159 78.1471 21.0337 78.7318 21.0337 79.4466C21.0337 80.1613 20.4484 80.7461 19.7168 80.7461C18.9852 80.7461 18.4324 80.1613 18.4324 79.4466ZM31.959 79.1217L32.0728 79.0242L30.5771 77.5623L30.3495 77.7735C29.7154 78.3582 28.805 78.7643 27.732 78.7643C24.9844 78.7643 24.2528 76.5877 24.2528 74.9795C24.2528 73.3714 25.0169 71.211 27.732 71.211C28.7562 71.211 29.7642 71.6171 30.3332 72.2181L30.5608 72.4455L32.0728 70.9673L31.959 70.8699C30.9673 69.9277 29.5528 69.2455 27.7157 69.2455C24.838 69.2455 23.0659 70.8374 22.3018 72.4293C21.9116 73.2577 21.749 74.1186 21.749 74.9795C21.749 75.8405 21.9116 76.7014 22.3018 77.5298C23.0497 79.1217 24.8055 80.7461 27.7157 80.7461C29.5203 80.7461 30.9673 80.0476 31.959 79.1217ZM32.6093 74.9958C32.6093 74.2161 32.7557 73.4364 33.0646 72.6729C33.6824 71.1135 35.3407 69.2617 38.2996 69.2617C41.2585 69.2617 42.9819 71.211 43.5997 72.8191C43.8598 73.5338 43.9899 74.2648 43.9899 75.012C43.9899 75.7592 43.8761 76.4902 43.5997 77.2049C42.9981 78.8131 41.3561 80.7461 38.2996 80.7461C35.2431 80.7461 33.6986 78.9105 33.0483 77.3349C32.7557 76.5714 32.6093 75.7917 32.6093 75.012V74.9958ZM38.3159 78.6993C39.3076 78.6993 40.1693 78.1958 40.6895 77.5948C41.3073 76.8801 41.5187 75.8567 41.5187 74.9958C41.5187 74.1349 41.3236 73.144 40.6895 72.3968C40.1693 71.7958 39.2913 71.2922 38.2996 71.2922C37.3079 71.2922 36.4299 71.812 35.9097 72.3968C35.2919 73.1278 35.0805 74.1349 35.0805 74.9958C35.0805 75.8567 35.2756 76.8638 35.9097 77.5948C36.4299 78.1958 37.3079 78.6993 38.3159 78.6993ZM54.9152 80.5186H57.2076V69.4729H57.1913H54.9802L51.5173 76.0516L48.0544 69.4729H45.8433V80.5186H48.1356V74.2486L50.5743 78.8618H52.4765L54.9152 74.2486V80.5186Z" fill="#393A3F"/>
        </g>
        <defs>
        <clipPath id="clip0_674_20802">
        <rect width="59" height="79.9029" fill="white" transform="translate(0.5 0.826904)"/>
        </clipPath>
        </defs>
        </svg>
    </div>
        <div class="short-title">{{shortTitle}}</div>
        <div class="product-details">
        <div>SKU: {{SKU}}</div>
        <div>Technical Specification</div>
        </div>
        <img class="tech-image" src="{{fileUrl2}}" alt="{{shortTitle}}" />
    </div>


    <div class="datasheet">
    <table class="data">
    <thead>
    <tr>
    <th>Mechanical</th>
    </tr>
    </thead>
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
        <thead>
    <tr>
    <th>Optics</th>
    </tr>
    </thead>
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
        <thead>
    <tr>
    <th>Video</th>
    </tr>
    </thead>
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
        <thead>
    <tr>
    <th>System</th>
    </tr>
    </thead>
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
        </tbody>
        <thead>
    <tr>
    <th>Software</th>
    </tr>
    </thead>
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
            <td class="property">Dimensions</td>
            <td class="value">{{dimensions}}</td>
            </tr>
            <tr class="row">
            <td class="property">Weight</td>
            <td class="value">{{weight}}</td>
            </tr>
            <tr class="row">
            <td class="property">Dimensions</td>
            <td class="value">{{dimensions}}</td>
            </tr>
            <tr class="row">
            <td class="property">Weight</td>
            <td class="value">{{weight}}</td>
            </tr>
            <tr class="row">
            <td class="property">Dimensions</td>
            <td class="value">{{dimensions}}</td>
            </tr>
            <tr class="row">
            <td class="property">Weight</td>
            <td class="value">{{weight}}</td>
            </tr>
            <tr class="row">
            <td class="property">Dimensions</td>
            <td class="value">{{dimensions}}</td>
            </tr>
            <tr class="row">
            <td class="property">Weight</td>
            <td class="value">{{weight}}</td>
            </tr>
        </tbody>
    </table>
    </div>
    
    </body>
    </html>`;

    let x = Math.floor((Math.random() * 1000) + 1);

  // #############################################################################
  // CREATE PAGE TEMPLATE USING PUPPETEER
  // https://pptr.dev/ || https://github.com/puppeteer/puppeteer
  // #############################################################################
  
    const compiledTemplate = Handlebars.compile(template);
    const html = compiledTemplate(context);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle2' });
    const pdfPath = `pdf/z${x}.pdf`;
    await page.emulateMediaType('screen');
    await page.waitForTimeout(1000);
  
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      displayHeaderFooter: true,
      headerTemplate: templateHeader,
      footerTemplate: templateFooter,
      margin: {
        top: '70px',
        bottom: '100px',
        right: '0px',
        left: '0px',
      },
      printBackground: true,
    });
    await browser.close();
  }

generatePdf(productData);