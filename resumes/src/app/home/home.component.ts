import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Tool } from '../models/tool.model';
import { ToolsService } from '../services/tools.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  tools: Tool[] = [];
  toolsSub: Subscription | null = null;

  constructor(private toolsService: ToolsService) { }

  ngOnInit(): void {
    this.toolsSub = this.toolsService.toolsChange.subscribe(
      (tools: { [key: number]: Tool }): any => {
        this.tools = Object.values(tools);
      }
    );
    this.toolsService.getToolsList();
  }

  ngOnDestroy(): void {
    this.toolsSub?.unsubscribe();
  }

}
