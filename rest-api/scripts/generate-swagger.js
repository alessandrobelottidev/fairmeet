import swaggerOptions from '../src/options/swagger.options.js';
import { writeFile } from 'fs/promises';
import swaggerJsdoc from 'swagger-jsdoc';
import { stringify } from 'yaml';
async function generateSwagger() {
    try {
        const specs = swaggerJsdoc(swaggerOptions);
        const yamlStr = stringify(specs);
        await writeFile('../docs/swagger.yaml', yamlStr);
        console.log('✨ Swagger YAML file has been generated successfully!');
    }
    catch (error) {
        console.error('Error generating swagger file:', error);
        process.exit(1);
    }
}
generateSwagger();
//# sourceMappingURL=generate-swagger.js.map