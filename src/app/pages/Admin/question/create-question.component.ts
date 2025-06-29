import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { QuestionService, Question, Answer } from '../../../services/question.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class CreateQuestionComponent {
  questionForm: FormGroup;
  loading = false;
  error: string | null = null;
  imageUploading = false;
  questionImagePreview: SafeUrl | null = null;
  answerImagePreviews: (SafeUrl | null)[] = [null, null];
  selectedImage: SafeUrl | null = null;

  constructor(private fb: FormBuilder, private questionService: QuestionService, private sanitizer: DomSanitizer) {
    this.questionForm = this.fb.group({
      text: ['', Validators.required],
      image: [null],
      answers: this.fb.array([
        this.createAnswer(),
        this.createAnswer()
      ], [this.minAnswersValidator(2), this.oneCorrectAnswerValidator()])
    });
  }

  get answers(): FormArray {
    return this.questionForm.get('answers') as FormArray;
  }

  createAnswer(): FormGroup {
    return this.fb.group({
      text: ['', this.textOrImageRequiredValidator()],
      image: [null],
      isCorrect: [false],
      correctDescription: ['']
    });
  }

  // Validatsiya: Har bir javobda matn yoki rasm bo‘lishi shart
  textOrImageRequiredValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const text = control.get('text')?.value;
      const image = control.get('image')?.value;
      return (text || image) ? null : { required: 'Javob matni yoki rasm kiritilishi shart' };
    };
  }

  // Validatsiya: Kamida 2 javob bo‘lishi shart
  minAnswersValidator(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as FormArray;
      if (!(formArray instanceof FormArray)) {
        return null; // Agar FormArray bo‘lmasa, xato qaytarmaymiz
      }
      return formArray.length >= min ? null : { minAnswers: 'Kamida 2 ta javob bo‘lishi kerak' };
    };
  }

  // Validatsiya: Kamida bitta to‘g‘ri javob bo‘lishi shart
  oneCorrectAnswerValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as FormArray;
      if (!(formArray instanceof FormArray)) {
        return null; // Agar FormArray bo‘lmasa, xato qaytarmaymiz
      }
      const hasCorrect = formArray.controls.some(control => control.get('isCorrect')?.value);
      return hasCorrect ? null : { oneCorrectAnswer: 'Kamida bitta to‘g‘ri javob tanlanishi kerak' };
    };
  }

  addAnswer(): void {
    if (this.answers.length < 6) {
      this.answers.push(this.createAnswer());
      this.answerImagePreviews.push(null);
    } else {
      this.error = 'Maksimal 6 ta javob qo‘shish mumkin';
    }
    // FormArray validatsiyasini qayta ishga tushirish
    this.answers.updateValueAndValidity();
  }

  removeAnswer(index: number): void {
    if (this.answers.length > 2) {
      this.answers.removeAt(index);
      this.answerImagePreviews.splice(index, 1);
      if (this.selectedImage === this.answerImagePreviews[index]) {
        this.selectedImage = null;
      }
    }
    // FormArray validatsiyasini qayta ishga tushirish
    this.answers.updateValueAndValidity();
  }

  onImageChange(event: Event, type: 'question' | 'answer', index?: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.type.match('image/jpeg|image/png')) {
        this.error = 'Faqat JPEG yoki PNG rasmlar yuklanishi mumkin';
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.error = 'Fayl hajmi 5MB dan kichik bo‘lishi kerak';
        return;
      }
      this.imageUploading = true;
      if (type === 'question') {
        this.questionForm.patchValue({ image: file });
        this.questionImagePreview = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
      } else if (type === 'answer' && index !== undefined) {
        this.answers.at(index).patchValue({ image: file });
        this.answerImagePreviews[index] = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
        // Rasm qo‘shilganda validatsiyani qayta tekshirish
        this.answers.at(index).updateValueAndValidity();
      }
      this.imageUploading = false;
    }
  }

  openImage(image: SafeUrl | null): void {
    if (image) {
      this.selectedImage = image;
    }
  }

  closeImage(): void {
    this.selectedImage = null;
  }

  removeImage(type: 'question' | 'answer', index?: number): void {
    if (type === 'question') {
      this.questionForm.patchValue({ image: null });
      this.questionImagePreview = null;
      if (this.selectedImage === this.questionImagePreview) {
        this.selectedImage = null;
      }
    } else if (type === 'answer' && index !== undefined) {
      this.answers.at(index).patchValue({ image: null });
      this.answerImagePreviews[index] = null;
      if (this.selectedImage === this.answerImagePreviews[index]) {
        this.selectedImage = null;
      }
      // Rasm olib tashlanganda validatsiyani qayta tekshirish
      this.answers.at(index).updateValueAndValidity();
    }
  }

  setCorrectAnswer(index: number): void {
    this.answers.controls.forEach((control, i) => {
      control.patchValue({ isCorrect: i === index });
      if (i !== index) {
        control.patchValue({ correctDescription: '' });
      }
    });
    // FormArray validatsiyasini qayta ishga tushirish
    this.answers.updateValueAndValidity();
  }

  clearForm(): void {
    this.questionForm.reset();
    this.answers.clear();
    this.answers.push(this.createAnswer());
    this.answers.push(this.createAnswer());
    this.questionImagePreview = null;
    this.answerImagePreviews = [null, null];
    this.selectedImage = null;
    this.error = null;
    // FormArray validatsiyasini qayta ishga tushirish
    this.answers.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.questionForm.invalid) {
      this.error = 'Forma to‘ldirishda xatolik: Iltimos, barcha majburiy maydonlarni to‘ldiring';
      this.questionForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('Text', this.questionForm.get('text')?.value);
    
    const questionImage = this.questionForm.get('image')?.value;
    if (questionImage) {
      formData.append('Image', questionImage);
    }

    const answers = this.questionForm.get('answers')?.value;
    answers.forEach((answer: Answer, index: number) => {
      if (answer.text) {
        formData.append(`Answers[${index}].Text`, answer.text);
      }
      if (answer.image) {
        formData.append(`Answers[${index}].Image`, answer.image);
      }
      formData.append(`Answers[${index}].IsCorrect`, answer.isCorrect.toString());
      if (answer.isCorrect && answer.correctDescription) {
        formData.append(`Answers[${index}].CorrectDescription`, answer.correctDescription);
      }
    });

    this.loading = true;
    this.questionService.createQuestion(formData).subscribe({
      next: () => {
        this.loading = false;
        this.clearForm();
      },
      error: (err: { message: any; }) => {
        this.loading = false;
        this.error = `Savol yaratishda xatolik: ${err.message || 'Server xatosi'}`;
      }
    });
  }

  // 🔤 Belgilar uchun harfni olish (A, B, C, D)
  getLetter(index: number): string {
    return String.fromCharCode(65 + index); // A=65, B=66, C=67, D=68...
  }
}