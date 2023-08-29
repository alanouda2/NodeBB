import * as fs from 'fs/promises';
import * as path from 'path';

import * as plugins from '../plugins';

// Define an interface for the language data structure
interface LanguageData {
    [key: string]: string;
}

// Define a type for the specific error you're handling
interface CustomError extends NodeJS.ErrnoException {
    code: string;
}

// Export the function for getting language data
export async function get(language: string, namespace: string): Promise<LanguageData> {
    const languagesPath = path.join(__dirname, '../build/public/language');
    const pathToLanguageFile = path.join(languagesPath, language, `${namespace}.json`);
    if (!pathToLanguageFile.startsWith(languagesPath)) {
        throw new Error('[[error:invalid-path]]');
    }
    const data = await fs.readFile(pathToLanguageFile, 'utf8');




    const parsed: LanguageData = JSON.parse(data) as LanguageData || {};

    const result = await plugins.hooks.fire('filter:languages.get', {
        language,
        namespace,
        data: parsed,
    }) as { data: LanguageData }; // Type assertion here
    return result.data;
}

// Export the function for listing language codes
let codeCache: string[] | null = null;
export async function listCodes(): Promise<string[]> {
    if (codeCache && codeCache.length) {
        return codeCache;
    }
    try {
        const languagesPath = path.join(__dirname, '../build/public/language');
        const file = await fs.readFile(path.join(languagesPath, 'metadata.json'), 'utf8');

        // Manually parse the JSON string, which TypeScript won't recognize as any
        const parsed = JSON.parse(file) as { languages: string[] };
        codeCache = parsed.languages;
        return parsed.languages;
    } catch (err) {
        const customError = err as CustomError; // Type assertion here
        if (customError.code === 'ENOENT') {
            return [];
        }
        throw err;
    }
}

