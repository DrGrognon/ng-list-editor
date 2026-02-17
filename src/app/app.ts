import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListEditor } from './list-editor/list-editor';
import { JsonPipe } from '@angular/common';
import { CounterIncrement } from './counter-increment/counter-increment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ListEditor, JsonPipe, CounterIncrement],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ng-transclude');


  counters = signal([1,2,3,4,5])
}
