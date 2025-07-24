import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="relative">
      <i class="pi pi-lock absolute left-3 top-1/2 -translate-y-1/2 text-blue-300"></i>

      <input
        pInputText
        class="w-full pl-10 pr-10 py-3"
        [id]="id"
        [name]="name"
        [type]="show ? 'text' : 'password'"
        [placeholder]="placeholder"
        [attr.aria-label]="placeholder"
        [required]="required"
        [disabled]="disabled"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onTouched()"
      />

      <button
        type="button"
        class="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 focus:outline-none"
        (click)="toggleVisibility()"
        [attr.aria-label]="show ? 'Ocultar contraseña' : 'Mostrar contraseña'"
      >
        <i class="pi" [ngClass]="show ? 'pi-eye-slash' : 'pi-eye'"></i>
      </button>
    </div>
  `,
})
export class PasswordInputComponent implements ControlValueAccessor {
  @Input() id = '';
  @Input() name = '';
  @Input() placeholder = 'Contraseña';
  @Input() required = false;
  @Input() disabled = false;

  show = false;
  value = '';

  private onChange: (value: string) => void = (value: string) => {
    console.log('onChange', value);
  };
  public onTouched: () => void = () => {
    console.log('onTouched');
  };

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
  }

  toggleVisibility(): void {
    this.show = !this.show;
  }
}