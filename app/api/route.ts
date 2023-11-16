import wkhtmltopdf from 'wkhtmltopdf';

async function makeImage(html: string): Promise<Buffer> {
  wkhtmltopdf.command = 'wkhtmltoimage'

  return new Promise((resolve, reject) => {
    wkhtmltopdf(html)
      .on('data', (data) => {
        resolve(data); // The image data is received here.
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

export async function GET(req: Request) {
  const html = '<h1>hello world</h1><main>hello world</main><footer>hello world</footer>';

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