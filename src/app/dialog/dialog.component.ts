import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-dialog",
  styleUrls: ["./dialog.component.css"],
  templateUrl: "./dialog.component.html"
})
export class DialogComponent implements OnInit {

  constructor() { }

  public onDialogOKSelected(event) {
    event.dialog.close();
  }
  public ngOnInit() {
  }

}
