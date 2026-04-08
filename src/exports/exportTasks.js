// this files contains functions for exporting data from the application, such as exporting responses or settings to a file. It uses the file-saver library to save files on the client side. This allows users to download their data in a structured format, such as JSON, which can be easily shared or stored for future reference. The exportToJson function takes in data and a filename, converts the data to a JSON string, creates a blob from it, and triggers a download of the file with the specified name.
import { saveAs } from 'file-saver';

export default function ExportTasks(data, exportType){
    switch(exportType){
        case "json":
            exportToJson(data, "exported_data.json");
            break;
        default:
            console.error("Unsupported export type: " + exportType);
    }
}



/**
 * Exports the given data as a JSON file.
 * @param {Object} data - The data to be exported.
 * @param {string} filename - The name of the file to save.
 */
export function exportToJson(data, filename) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, filename);
}
