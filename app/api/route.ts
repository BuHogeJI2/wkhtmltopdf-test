import wkhtmltopdf from 'wkhtmltopdf';
const wkhtmltoimage = require('wkhtmltoimage');
import * as fs from "fs";

async function makeImage(html: string): Promise<Buffer> {
  wkhtmltopdf.command = 'wkhtmltoimage';

  return new Promise((resolve, reject) => {
    const stream = wkhtmltopdf(html);

    const chunks = [];

    stream.on('data', chunk => {
      chunks.push(chunk);
    });

    stream.on('error', reject);

    stream.on('end', () => {
      // Combine all the chunks into one Buffer
      const buffer = Buffer.concat(chunks);
      resolve(buffer);
    });
  });
}

export async function GET(req: Request) {
  // const html = '<h1>hello world</h1><main>hello world</main><footer>hello world</footer>';

  const html = fs.readFileSync('./outer.html', 'utf-8');

  const imageBuffer = await makeImage(html);
  const imageSrc = `data:image/png;base64,${imageBuffer.toString('base64')}`;

  const imageFragment = `<img src="${imageSrc}" />`;


  try {
    return new Response(imageFragment, {
      headers: { 'content-type': 'text/html' },
      status: 200,
    });
  } catch (error: any) {
    return new Response(error.message, {
      headers: { 'content-type': 'text/html' },
      status: 500,
    });
  }
}