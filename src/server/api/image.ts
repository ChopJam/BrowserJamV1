import sharp from 'sharp';
import { Buffer } from 'buffer';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const url = query.url as string;
  
  if (!url) {
    return createError({ statusCode: 400, message: 'Missing url parameter' });
  }
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      return createError({ 
        statusCode: response.status, 
        message: `Failed to fetch image: ${response.statusText}` 
      });
    }
    
    const buffer = Buffer.from(await response.arrayBuffer());
    
    const pngBuffer = await sharp(buffer).png().toBuffer();
    
    setResponseHeaders(event, {
      'Content-Type': 'image/png',
      'Content-Disposition': 'attachment; filename="masterpiece.png"'
    });
    
    return pngBuffer;
  } catch (error) {
    console.error('Error in proxy:', error);
    return createError({ 
      statusCode: 500, 
      message: 'Failed to process image' 
    });
  }
});