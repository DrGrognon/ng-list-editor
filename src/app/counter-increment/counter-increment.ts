import { Component, model } from '@angular/core';

@Component({
  selector: 'app-counter-increment',
  imports: [],
  templateUrl: './counter-increment.html',
  styleUrl: './counter-increment.css',
})
export class CounterIncrement {
  count = model.required<number>();

  increment(): void {
    this.count.set(this.count() + 1);
  }
}
