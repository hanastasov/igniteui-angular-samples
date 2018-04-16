import { Component, Injectable, ViewChild, ChangeDetectorRef } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs/Rx";
import { IgxColumnComponent } from "igniteui-angular/grid/column.component";
import { IgxGridComponent } from "igniteui-angular/grid/grid.component";
import {
	DataContainer,
	IForOfState
} from "igniteui-angular/main";

@Injectable()
export class RemoteService {
    public remoteData: Observable<any[]>;
    private url: string = "http://services.odata.org/V4/Northwind/Northwind.svc/Products";
    private _remoteData: BehaviorSubject<any[]>;

    constructor(private http: HttpClient) {
        this._remoteData = new BehaviorSubject([]);
        this.remoteData = this._remoteData.asObservable();
    }

    public getData(data?: IForOfState, cb?: (any) => void): any {
        var dataState = data;
        return this.http
            .get(this.buildUrl(dataState))
            .subscribe((data) => {
                this._remoteData.next(data['value']);
                if (cb) {
                    cb(data);
                }
            });
    }

    private buildUrl(dataState: any): string {
        let qS: string = "?", requiredChunkSize: number;
        if (dataState) {
            const skip = dataState.startIndex;
                
                requiredChunkSize =  dataState.chunkSize === 0 ?
                    // Set initial chunk size, the best value is igxForContainerSize divided on igxForItemSize
                    10 : dataState.chunkSize;
            const top = requiredChunkSize;
            qS += `$skip=${skip}&$top=${top}&$count=true`;
        }
        return `${this.url}${qS}`;
    }
}

@Component({
	providers: [RemoteService],
	selector: "grid-remote-virtualizatiuon-sample",
	styleUrls: ["grid-sample-4.component.scss"],
	templateUrl: "grid-sample-4.component.html"
})

export class GridRemoteVirtualizationSampleComponent {
    public remoteData:any;
	public prevRequest:any;
	public columns:any;

	@ViewChild("grid1") public grid: IgxGridComponent;
	constructor(private remoteService: RemoteService, public cdr: ChangeDetectorRef) { }
	public ngOnInit(): void {
		this.columns = [
			{ field: "ProductID", width: "100px" },
			{ field: "ProductName", width: "200px" },
			{ field: "UnitPrice", width: "100px" },
			{ field: "UnitsInStock", width: "50px" },
			{ field: "QuantityPerUnit", width: "200px" },
			{ field: "Discontinued", width: "50px" }
		];
		this.remoteData = this.remoteService.remoteData;
	}

	public ngAfterViewInit() {
		this.remoteService.getData(this.grid.virtualizationState, (data) => {
			this.grid.totalItemCount = data["@odata.count"];
		});
	}

	dataLoading(evt) {
		if(this.prevRequest){
			this.prevRequest.unsubscribe();
		}
		this.prevRequest = this.remoteService.getData(evt, ()=> {
			this.cdr.detectChanges();
		});
	}
}
