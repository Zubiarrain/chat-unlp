"use server"

import path from "path";
import fs from "fs";
import yaml from 'js-yaml';


export const getHormigonArmadoContext = async () => {
    const filePath = path.join(process.cwd(), 'src', 'data', 'document_data.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const context = JSON.parse(fileContent);

    return context
}

export const getHormigonArmadoContextYAML = async () => {
    const filePath = path.join(process.cwd(), 'src', 'data', 'document_data.yaml');
    const datos = fs.readFileSync(filePath, 'utf8');
    //const context = yaml.load(datos)

    return datos
}