import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import List from 'src/app/models/list';
import Task from 'src/app/models/task';

import { TaskService } from 'src/app/task.service';

@Component({
    selector: 'app-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
    lists: List[] = [];
    tasks: Task[] = [];

    listId:string = '';
    
    // ActivatedRoute - we need current route
    // router - if the user clicks on the link we can redirect him to that router
    constructor( private taskService: TaskService, private route: ActivatedRoute, private router: Router ) { }

    ngOnInit(): void {
        this.taskService.getLists()
            .subscribe( (lists:List[]) => {
                this.lists = lists;
            })

        this.route.params.subscribe((params:Params) => { // Whenever the router changes this triggers
            this.listId = params.listId;
            if ( !this.listId ) return;

            this.taskService.combiineReq(this.listId).subscribe(s => {
                this.lists = s.map1;
                this.tasks = s.map2;
            });
        })
    }

    onTaskClick( task:Task ) {
        this.taskService.setCompleted(this.listId, task).subscribe( () => task.completed = !task.completed );
    }

    deleteTheTask ( task: Task ) {
        this.taskService.deleteTask(this.listId, task._id).subscribe( (task: Task) => this.tasks = this.tasks.filter( taskOnly => taskOnly._id != task._id ) );
    }

    deleteTheList (list: List) {
        this.taskService.deleteList( list._id ).subscribe( () => {
            this.lists = this.lists.filter(listOnly => listOnly._id != list._id)
            this.tasks = [];
        });
    }

    addTask () {
        if ( !this.listId ) {
            alert("please select a list to add tasks to");
            return;
        }

        this.router.navigate( ['./new-task'], { relativeTo: this.route } );
    }

}
