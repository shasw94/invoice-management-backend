import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';

@Injectable()
export class OrderService {

    readExcelFile(file :Express.Multer.File) {
        const workbook : XLSX.WorkBook = XLSX.readFile(file.path);
        const sheetnames = Object.keys(workbook.Sheets);
        const check = sheetnames.includes("Data");
        if (!check) {
            throw new HttpException('Sheet named Data does not exist. Please upload excel file in correct format.', HttpStatus.BAD_REQUEST,);
        }
        const data = XLSX.utils.sheet_to_json(workbook.Sheets["Data"]);
        console.log(data)
    }
}
