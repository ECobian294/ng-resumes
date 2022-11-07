import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, map, Observable, Subject, take, tap } from "rxjs";
import { Tool } from "../models/tool.model";
import { AuthenticationService } from "./authentication.service";

import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { JsonPipe } from "@angular/common";

@Injectable(
    { providedIn: 'root' }
)
export class ToolsService {
    private firebaseUrl: string = 'https://ng-resumes-default-rtdb.firebaseio.com/';

    toolsRef: AngularFireList<Tool>;
    toolRef: AngularFireObject<Tool>;

    toolsChange: Subject<Tool[]> = new Subject<Tool[]>();
    tools: Tool[] = [];

    constructor(private http: HttpClient, private authService: AuthenticationService, private db: AngularFireDatabase) {
        this.toolsRef = this.db.list('/tools');
        this.toolRef = this.db.object('tools/');
    }

    addTool(name: string) {
        this.toolsRef.push(new Tool('', name, new Date().getTime(), new Date().getTime()));
        let lastKey: string = '';
        this.toolsRef.snapshotChanges().subscribe(
            (snapshot): any => {
                lastKey = snapshot[snapshot.length - 1].key as string;
            }
        );
        this.toolsRef.valueChanges().subscribe(
            (tools: Tool[]): any => {
                this.tools = tools;
                this.tools[this.tools.length - 1]['id'] = lastKey;
                this.toolsChange.next({ ...this.tools });
            }
        );
    }
    updateTool(id: string | number, tool: Tool) {
        tool.updatedAt = new Date().getTime();
        this.toolRef = this.db.object('tools/' + id);
        this.toolRef.update(tool);
        this.toolsRef.valueChanges().subscribe(
            (tools: Tool[]): any => {
                this.tools = tools;
                this.toolsChange.next({ ...this.tools });
            }
        );
    }

    getToolsList() {
        this.toolsRef = this.db.list('/tools');
        const mapWithIds: { [key: string]: Tool } = {};
        this.toolsRef.snapshotChanges()
            .pipe(
                map(
                    (val): any => {
                        val.forEach(
                            (currRes): any => {
                                mapWithIds[currRes.payload.key as string] = <Tool>currRes.payload.val();
                            }
                        )
                    }
                )
            )
            .subscribe(
                (obj): any => {
                    const keys: string[] = Object.keys(mapWithIds);
                    const newTools: Tool[] = [];
                    for (let key of keys) {
                        newTools.push({ ...mapWithIds[key], id: key });
                    }
                    this.tools = newTools;
                    this.toolsChange.next(this.tools.slice());
                }
            );
    }

    getTool(id: number) {
        this.toolRef = this.db.object('tools/' + id);
        return this.toolRef;
    }

    // getTools() {
    //     return this.authService.user.pipe(
    //         take(1),
    //         exhaustMap(
    //             (user): Observable<any> => {
    //                 return this.http.get<Tool[]>(this.firebaseUrl + 'tools.json');
    //             }
    //         ), tap(
    //             (tools: Tool[]): any => {
    //                 this.tools = Object.values(tools);
    //                 this.toolsChange.next({ ...tools });
    //             }
    //         )
    //     );
    // }

    // createTool(name: string) {
    //     const tool: Tool = new Tool(name, new Date().getTime(), new Date().getTime());
    //     this.tools.push(tool);
    //     this.http.put<{ [key: number]: Tool }>(this.firebaseUrl + 'tools.json', this.tools)
    //         .subscribe(
    //             (tool: { [key: number]: Tool }): any => {
    //                 this.toolsChange.next({ ...this.tools });
    //             }
    //         );
    // }

    // deleteTool(idx: number) {
    //     this.tools.splice(idx, 1);
    //     this.http.put<{ [key: number]: Tool }>(this.firebaseUrl + 'tools.json', this.tools)
    //         .subscribe(
    //             (tool: { [key: number]: Tool }): any => {
    //                 this.toolsChange.next({ ...this.tools });
    //             }
    //         );
    // }

    delTool(id: string | number) {
        this.toolRef = this.db.object('tools/' + id);
        this.toolRef.remove();
        this.getToolsList();
    }

}