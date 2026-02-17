import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  TemplateRef,
  computed,
  contentChild,
  input,
  model
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface EditableItem<T> {
  item: T;
  itemChange: (updatedItem: T) => void;
}

/**
 * A generic generic component to manage a list of items with editing capabilities.
 * Provides functionality for adding, removing, reordering, and updating items in the list.
 * Supports drag-and-drop reordering and customizable child templates for rendering items.
 *
 * Example use:
 * ```html
 *    <hw-list-editor [(list)]="counters" [newItem]="0" [displayArrows]="true">
 *       <ng-template let-item let-itemChange="itemChange">
 *         <app-counter-increment [count]="item" (countChange)="itemChange($event)"></app-counter-increment>
 *       </ng-template>
 *     </hw-list-editor>
 * ```
 * @template T The type of item contained in the list.
 */
@Component({
  selector: 'hw-list-editor',
  imports: [CommonModule, MatButtonModule, MatIconModule, CdkDropList, CdkDrag, CdkDragHandle],
  templateUrl: './list-editor.html',
  styleUrl: './list-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListEditor<T> {
  readonly newItem = input<T>();
  readonly displayArrows = input<boolean>(false);
  readonly list = model.required<T[]>();
  readonly listWithUpdate: Signal<EditableItem<T>[]> = computed(() =>
    this.list().map((item, index) => ({
      item: item,
      itemChange: (updatedItem: T) => this.updateItem(index, updatedItem)
    }))
  );

  readonly childTemplate: Signal<
    TemplateRef<{
      $implicit: T;
      item: T;
      itemChange: (updatedItem: T) => void;
    }>
  > = contentChild.required<TemplateRef<{ $implicit: T; item: T; itemChange: (updatedItem: T) => void }>>(TemplateRef);

  addItem(): void {
    const newItemValue: T | undefined = this.newItem();

    if (newItemValue !== undefined) {
      const updated: T[] = [...this.list(), newItemValue];
      this.list.set(updated);
    }
  }

  removeDefinition(index: number): void {
    const updated: T[] = [...this.list()];
    updated.splice(index, 1);
    this.list.set(updated);
  }

  moveUp(index: number): void {
    if (index > 0) {
      const updated: T[] = [...this.list()];
      const temp: T = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
      this.list.set(updated);
    }
  }

  moveDown(index: number): void {
    const current: T[] = this.list();
    if (index < current.length - 1) {
      const updated: T[] = [...current];
      const temp: T = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
      this.list.set(updated);
    }
  }

  updateItem(index: number, update: T): void {
    const updated: T[] = [...this.list()];
    updated[index] = update;
    this.list.set(updated);
  }

  protected drop($event: CdkDragDrop<EditableItem<T>[]>): void {
    const updated: T[] = [...this.list()];
    const temp: T = updated[$event.previousIndex];
    updated.splice($event.previousIndex, 1);
    updated.splice($event.currentIndex, 0, temp);
    this.list.set(updated);
  }
}
