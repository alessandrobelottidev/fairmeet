import swaggerOptions from '../src/options/swagger.options.js';
import { writeFile } from 'fs/promises';
import swaggerJsdoc from 'swagger-jsdoc';
import { stringify } from 'yaml';

async function generateSwagger() {
  try {
    // Generate swagger specification
    const specs = swaggerJsdoc(swaggerOptions);

    // Convert to YAML
    const yamlStr = stringify(specs);

    // Write to file
    await writeFile('../docs/swagger.yaml', yamlStr);

    console.log('✨ Swagger YAML file has been generated successfully!');
  } catch (error) {
    console.error('Error generating swagger file:', error);
    process.exit(1);
  }
}

generateSwagger();
