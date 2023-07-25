# Techspecs PDF Download
This will be a feature on the [techspecs](https://techspecs.ui.com/) page that will allow users to quickly download the selected product. 

## Usage
Simply run this in the terminal. (Will automatically generate a pdf with your changes and file starts with 'z' so you can easily collect & delete.) 
```bash
npx ts-node ./src/index.ts
```

## To-Do
- [x] Create Designed PDF - Jack
- [] Manage Multi page count / ~footer & header display~ - Jack
- [] Hook up datasheet and product values
- [] Make template files live in specific folder and manually copied on build
- [] Add ability to show up to 3 different tech spec images on page 1

## Docs
Puppeteer & Handlebar quicklinks :smile:
* https://pptr.dev/ 
* https://github.com/puppeteer/puppeteer
* https://devdocs.io/puppeteer/ 
* https://handlebarsjs.com/guide/
