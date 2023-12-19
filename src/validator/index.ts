interface IValidationData {
  name: string;
  data: any;
  validator: ((value: any) => string)[];
}

export class Validator {
  private validationData: IValidationData[];
  private errors: Map<string, string[]>;

  constructor(validateData?: IValidationData[]) {
    if (validateData) {
      this.validationData = validateData;
    } else {
      this.validationData = [];
    }
    this.errors = new Map();
  }

  addValidation(
    name: string,
    data: any,
    validator: ((value: any) => string)[]
  ) {
    this.validationData.push({
      name,
      data,
      validator,
    });
  }

  validate(): boolean {
    let isError = false;
    for (const val of this.validationData) {
      const errorMessage: string[] = [];
      for (const fc of val.validator) {
        const msg = fc(val.data);
        if (msg) {
          errorMessage.push(msg);
          isError = true;
        }
      }
      this.errors.set(val.name, errorMessage);
    }
    return isError;
  }

  getError(name: string): string[] {
    const error = this.errors.get(name);
    if (error?.length) return error;
    return [];
  }
}
