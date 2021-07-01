import { Injectable } from '@angular/core';
import { WebService } from './web.service';
import Task from './models/task';
import { map, mergeMap } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class TaskService {

    constructor( private webService: WebService ) { }

    getLists () {
        return this.webService.get('lists')
    }

    createList ( title: string ) {
        return this.webService.post('lists', { title });
    }

    getTasks(listId: string) {
        return this.webService.getTask(`lists/${listId}/tasks`)
    }

    createTask(listId:string, title: string) {
        return this.webService.postTask(`lists/${listId}/tasks`, { title });
    }

    deleteList (listId: string) {
        return this.webService.delete(`lists/${listId}`)
    }

    deleteTask(listId: string, taskId: string) {
        return this.webService.deleteOnlyTask(`lists/${listId}/tasks/${ taskId }`)
    }

    setCompleted( listId:string, task: Task ) {
        return this.webService.patch( `lists/${listId}/tasks/${task._id}`, { completed: !task.completed } )
    }

    combiineReq(listId: string) {
        let x = this.getLists();
        let y = this.getTasks(listId);

        return x.pipe(
            mergeMap( (map1) => {
                return y.pipe(
                    map( map2 => {
                        return { map1, map2 }
                    })
                )
            })
        )
    }
}
