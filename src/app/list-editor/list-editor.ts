import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  model,
  Signal,
  TemplateRef
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';


export interface EditableItem<T> {
  item: T;
  itemChange: (updatedItem: T) => void;
}

@Component({
  selector: 'app-list-editor',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    CdkDropList,
    CdkDrag
  ],
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

  readonly childTemplate: Signal<TemplateRef<{
    $implicit: T;
    item: T;
    itemChange: (updatedItem: T) => void
  }>> = contentChild.required<TemplateRef<{ $implicit: T; item: T; itemChange: (updatedItem: T) => void }>>(TemplateRef)

  addItem(): void {
    const newItemValue = this.newItem();

    if (newItemValue !== undefined) {
      const updated: T[] = [
        ...(this.list()),
        newItemValue
      ];
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

  protected drop($event: CdkDragDrop<EditableItem<T>[]>) {
    const updated: T[] = [...this.list()];
    const temp: T = updated[$event.previousIndex];
    updated.splice($event.previousIndex, 1);
    updated.splice($event.currentIndex, 0, temp);
    this.list.set(updated);
  }
}



