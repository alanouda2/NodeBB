"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.listCodes = exports.get = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const plugins = __importStar(require("./plugins"));
// Export the function for getting language data
function get(language, namespace) {
    return __awaiter(this, void 0, void 0, function* () {
        const languagesPath = path.join(__dirname, '../build/public/language');
        const pathToLanguageFile = path.join(languagesPath, language, `${namespace}.json`);
        if (!pathToLanguageFile.startsWith(languagesPath)) {
            throw new Error('[[error:invalid-path]]');
        }
        const data = yield fs.readFile(pathToLanguageFile, 'utf8');
        const parsed = JSON.parse(data);
        const result = yield plugins.hooks.fire('filter:languages.get', {
            language,
            namespace,
            data: parsed,
        });
        return result.data;
    });
}
exports.get = get;
// Export the function for listing language codes
let codeCache = null;
function listCodes() {
    return __awaiter(this, void 0, void 0, function* () {
        if (codeCache && codeCache.length) {
            return codeCache;
        }
        try {
            const languagesPath = path.join(__dirname, '../build/public/language');
            const file = yield fs.readFile(path.join(languagesPath, 'metadata.json'), 'utf8');
            const parsed = JSON.parse(file);
            codeCache = parsed.languages;
            return parsed.languages;
        }
        catch (err) {
            const customError = err;
            if (customError.code === 'ENOENT') {
                return [];
            }
            throw err;
        }
    });
}
exports.listCodes = listCodes;
