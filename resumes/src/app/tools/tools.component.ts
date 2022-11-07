import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Tool } from '../models/tool.model';
import { ToolsService } from '../services/tools.service';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})
export class ToolsComponent implements OnInit {

  tools: Tool[] = [];
  toolsSubscription: Subscription | null = null;

  createTool: boolean = false;
  isLoading: boolean = true;

  toolForms: FormGroup = new FormGroup({ 'name': new FormControl('', Validators.required) });
  editingTools: boolean = false;

  constructor(private toolsService: ToolsService) { }

  ngOnInit(): void {
    this.toolsService.getToolsList()
    // this.toolsService.getTools().subscribe(
    //   (tools: Object): any => {
    //     this.tools = Object.values(tools);
    //     this.isLoading = false;
    //   }
    // );

    this.toolsSubscription = this.toolsService.toolsChange.subscribe(
      (tools: Tool[]): any => {
        this.tools = Object.values(tools);
        this.isLoading = false;
      }
    )

  }

  onSubmit(form: NgForm) {
    this.isLoading = true;
    this.toolsService.addTool(form.value.name);
    form.reset();
    this.changeCreateTool();
    this.isLoading = false;
  }

  changeCreateTool() {
    this.createTool = !this.createTool;
  }

  changeEdit(id: string | number, name: string) {
    this.toolForms = new FormGroup({
      'name': new FormControl(name, Validators.required),
    });
    this.editingTools = true;
    const editButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById('edit_' + id);
    editButton.classList.add('hidden');
    const deleteButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById('delete_' + id);
    deleteButton.classList.remove('hidden');
    const saveButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById('save_' + id);
    saveButton.classList.remove('hidden');
    const cancelButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById('cancelEdit_' + id);
    cancelButton.classList.remove('hidden');
    const toolDesc: HTMLElement = <HTMLElement>document.getElementById('toolDesc_' + id);
    toolDesc.classList.add('hidden');
    const toolForm: HTMLElement = <HTMLElement>document.getElementById('toolEditContainer_' + id);
    toolForm.classList.remove('hidden');

  }

  deleteTool(id: string | number) {
    // this.toolsService.deleteTool(idx);
    this.cancelEdit(id);
    this.toolsService.delTool(id);
  }

  cancelEdit(toolId: string | number) {
    const editButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById('edit_' + toolId);
    editButton.classList.remove('hidden');
    const deleteButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById('delete_' + toolId);
    deleteButton.classList.add('hidden');
    const saveButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById('save_' + toolId);
    saveButton.classList.add('hidden');
    const cancelButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById('cancelEdit_' + toolId);
    cancelButton.classList.add('hidden');
    const toolDesc: HTMLElement = <HTMLElement>document.getElementById('toolDesc_' + toolId);
    toolDesc.classList.remove('hidden');
    const toolForm: HTMLElement = <HTMLElement>document.getElementById('toolEditContainer_' + toolId);
    toolForm.classList.add('hidden');
    this.editingTools = false;
  }
  saveEdit(toolId: string | number, tool: Tool) {
    tool.name = this.toolForms.value.name;
    this.toolsService.updateTool(toolId, tool);
    this.cancelEdit(toolId);
  }

}
