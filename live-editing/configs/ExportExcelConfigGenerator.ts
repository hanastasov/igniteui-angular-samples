import { IConfigGenerator } from "./core/IConfigGenerator";
import { Config } from "./core/Config";
import { AppModuleConfig } from "./core/AppModuleConfig";
import { IgxExcelExporterService } from "igniteui-angular/services/index";
import { ExcelExportComponent } from "../../src/app/export-excel/excel-export.component";
import { ExcelExportSample1Component } from "../../src/app/export-excel/excel-export-sample-1/excel-export-sample-1.component";
import { IgxGridModule } from "igniteui-angular/main";

export class ExportExcelConfigGenerator implements IConfigGenerator {
    generateConfigs(): Config[] {
        let configs = new Array<Config>();

        configs.push(new Config({
            component: ExcelExportComponent,
            appModuleConfig: new AppModuleConfig({
                imports: [IgxExcelExporterService, ExcelExportComponent],
                ngDeclarations: [ExcelExportComponent],
                ngImports: [],
                ngProviders: [IgxExcelExporterService]
            })
        }));

        configs.push(new Config({
            component: ExcelExportSample1Component,
            appModuleConfig: new AppModuleConfig({
                imports: [IgxGridModule, IgxExcelExporterService, ExcelExportSample1Component],
                ngDeclarations: [ExcelExportSample1Component],
                ngImports: [IgxGridModule],
                ngProviders: [IgxExcelExporterService]
            }),
            shortenComponentPathBy: "/export-excel/"
        }));

        return configs;
    }
}
