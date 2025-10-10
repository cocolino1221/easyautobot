export class ValidationErrorDto {
  field: string;
  message: string;
  value?: any;

  constructor(field: string, message: string, value?: any) {
    this.field = field;
    this.message = message;
    this.value = value;
  }
}

export class ValidationErrorResponse {
  success: false;
  statusCode: 422;
  message: string;
  errors: ValidationErrorDto[];

  constructor(errors: ValidationErrorDto[]) {
    this.success = false;
    this.statusCode = 422;
    this.message = '📝 Validation failed. Please check the highlighted fields.';
    this.errors = errors;
  }
}
