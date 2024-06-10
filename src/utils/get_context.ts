"use server"

import path from "path";
import fs from "fs";


export const getHormigonArmadoContext = async () => {
    const filePath = path.join(process.cwd(), 'src', 'data', 'document_data.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const context = JSON.parse(fileContent);

    return context
}